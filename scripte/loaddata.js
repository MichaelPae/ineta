// loaddata.js
// stellt Meeting-, Session- und Location- Daten für Indeta-Site zur Verfügung

// Copyright (c) Michael Paetzold. Alle Rechte vorbehalten. http://www.michael-paetzold.de

/*
Tabellen-Struktur:

Meeting
MtId, TreffenNr, TerminISO, OrtId, SessionCount

Session
MtId, SessionId, Caption, Summary, Items, Speaker, Leute, Firmen

Ort
OrtId, Ort, Lokal, AnfahrtLink
*/

// Class Inetasite
function Inetasite() {
    // laedt Inetasite-Object aus JSON-Datei vom Inetasite-HOST-Server
    var oTab = loadInetaTable( getDataPath("data")+"/"+"t_inetasite.json" );

    var oDate =convIsoDate2Date(oTab.T_Inetasite.Datenstand);
    this.cDatenStand = convDate2DudenDate(oDate);
    this.cVersion = oTab.T_Inetasite.Version;
    this.lTest = oTab.T_Inetasite.Test;
    this.nDefaultTreffenNr = oTab.T_Inetasite.DefaultTreffenNr;
    this.nStartDataMigrationsTreffenNr = oTab.T_Inetasite.StartDataMigrationsTreffenNr;
    this.nAnzThemenListe = oTab.T_Inetasite.AnzThemenListe;
    this.nAnzahlTreffenlisteTest = oTab.T_Inetasite.AnzahlTreffenlisteTest;
    this.cBackEnd = oTab.T_Inetasite.BackEnd;
    this.cDataMode = oTab.T_Inetasite.DataMode;
    this.cFixDataPath = oTab.T_Inetasite.FixDataPath;
}

// Class BackEnd
function BackEnd(cBackEnd, cDataMode, cFixDataPath) {
    // liefert ein Back-End-Object
    this.cBackEnd = cBackEnd;           // Zugriffs-Key fuer Back-End (Datenquelle): "JSON", "Code"
    this.cDataMode = cDataMode;         // "FIXDATAPATH", "HOST"
    this.cFixDataPath = cFixDataPath;   // http://375nb/ineta/data, http://www.befo.com/voca/data
    this.assembleDataPath();
}

BackEnd.prototype.assembleDataPath = function assembleDataPath() {
    // holt DataPath
    var cDataPath;

    switch (this.cDataMode) {
        case "HOST":
            cDataPath = getDataPath("data"); // HOST-Path
            break;
        case "FIXDATAPATH":
            cDataPath = this.cFixDataPath;
            break;
        default:
            cDataPath = getDataPath("data"); // HOST-Path
            break;
    }
    this.cDataPath = cDataPath;
}

// Class Meeting
function Meeting(oAccess) {
    // initialsiert ein Object der Klasse Meeting; Datenobject zu einem Treffen

    // Meeting-Properties
    // Keys
    this.Access = oAccess;
    this.MtId = this.Access.nKey;   // TreffenNr Sollwert
    // Meeting Fields Default-Values
    this.TreffenNr = undefined;
    this.TerminISO = undefined;
    this.OrtId = undefined;
    this.SessionCount = 1;

    // Back-End Content
    var oData = this.load(); // Zugriff auf Back-End - Datum, OrtId,
    this.TreffenNr = oData.TreffenNr;
    this.SessionCount = oData.SessionCount;
    this.TerminISO = oData.TerminISO;
    this.OrtId = oData.OrtId;

    // abgeleitete Meeting-Properties
    // Usergroup-Name
    this.Usergroup = ((this.MtId > 89) ? "DevGroup Göttingen/Kassel" : "VOCA-Usergroup Göttingen/Kassel"); // Umbenennung der Usergroup ab Meeting 90
    // Termin
    this.Date = convIsoDate2Date(this.TerminISO);
    this.Termin = this.Date.convAlpha();
    //this.TerminDuden = oSession.Datum.convDuden();
    this.Anmeldeschluss = this.Date.addDays(-1).convAlpha(); // "16. 07. 2014";
    // Location
    this.Location = new Location(oAccess.oBackEnd, this.OrtId);
    // Sessions
    this.Sessions = new Array(this.SessionCount);

    // Loop ueber alle Sessions eines Meetings
    var i = 1;
    var cSessionId;
    var oSession;
    for (var i = 1; i <= this.SessionCount; i++) {
        cSessionId = rightStr("000" + this.MtId.toString(), 3) + rightStr("00" + i.toString(), 2); // "mmmss"

        oSession = new Session(this, cSessionId);

        this.Sessions[i] = oSession;
    }

    // Statistik <ENGINE> Mittelwert statt Werte der 1. Session
    this.Leute = this.Sessions[1].Leute;
    this.Firmen = this.Sessions[1].Firmen;
}

Meeting.prototype.load = function Load() {
    // laedt Meeting-Object
    var cBE = this.Access.cBE; // "JSON"; // "Code"
    var oData;

    switch (cBE) {
        case "JSON":
            oData = loadMeetingFromJSON(this.Access.oBackEnd.cDataPath + "/" + "t_meeting.json", this.MtId);
            break;
        case "Code":
            oData = loadMeetingFromCode(this.MtId);
            break;
        case "SQLite":
            break;
    }
    return oData;
}

// Class Session
function Session(oMeeting, cSessionId) {
    // initialsiert ein Object der Klasse Subject-Record; Datenobject mit Datum, Thema, Sprecher, ... zu einem Treffen
    this.Access = oMeeting.Access
    //this.cBE = this.Access.cBE;
    this.lTest = this.Access.lTest;
    this.nKey = this.Access.nKey;
    this.MtID = oMeeting.MtId;          // = TreffenNr
    this.SessionIdSoll = cSessionId;
    this.SessionArrayIx = parseInt(cSessionId.substr(4, 2)-1); // laufende Session-Nr.

    var oData = this.load();	// Zugriff auf Back-End

    // Session-Object bedienen
    this.SessionId = oData.SessionId;
    this.Caption = oData.Caption;
    this.Summary = oData.Summary;
    this.Items = oData.Items;
    this.Speaker = oData.Speaker;
    this.Leute = oData.Leute;
    this.Firmen = oData.Firmen;
}

Session.prototype.load = function load() {
    // laedt Session-Object
    var oData;

    // Zugriffsart
    switch (this.Access.oBackEnd.cBackEnd) {
        case "JSON":
            oData = loadSessionFromJSON(this.Access.oBackEnd.cDataPath+"/"+"t_session.json", this.nKey, this.SessionArrayIx);
            break;
        case "Code":
            oData = loadSessionFromCode(this.nKey, this.SessionArrayIx);
            break;
        case "SQLite":
            break;
    }
    return oData;
}

// Class Location
function Location(oBackEnd, cOrtId) {
    // initialsiert ein Object der Klasse Location-Record
    cOrtId = ((isEmpty(cOrtId)) ? undefined : cOrtId);
    cOrtId = checkVar(cOrtId, "string", "default");

    this.oBackEnd = oBackEnd;
    this.OrtIdQuery = cOrtId;

    var oData = this.load();	// Zugriff auf Back-End

    // Location-Object fuellen
    this.OrtId = oData.OrtId;
    this.Kurzname = oData.Kurzname;
    this.Praeposition = oData.Praeposition;
    this.Name = oData.Name;
    this.Ort = oData.Ort;
    this.PLZ = oData.PLZ;
    this.Strasse = oData.Strasse;
    this.Fon = oData.Fon;
    this.URL = oData.URL;
    this.VcfTag = oData.VcfTag;
    this.ImageTag = oData.ImageTag;
    this.AnfahrtLink = oData.AnfahrtLink;
    this.AnfahrtText = oData.AnfahrtText;
}

Location.prototype.load = function load() {
    // laedt Location-Object
    var oData;

    // Zugriffsart
    switch (this.oBackEnd.cBackEnd) {
        case "JSON":
            oData = loadLocationFromJSON(this.oBackEnd.cDataPath + "/" + "t_location.json", this.OrtIdQuery);
            break;
        case "Code":
            oData = loadLocationFromCode(this.OrtIdQuery);
            break;
        case "SQLite":
            break;
    }
    if (typeof oData == "undefined") {
        oData = loadLocationFromCode("default");
    }
    return oData;
}

// Back-End JSON
function loadInetaTable(cUrl) {
    // laedt Ineta Table-Object mit Daten
    var cContent = ReadFile(cUrl);
    return JSON.parse(cContent);
}

function loadMeetingFromJSON(cUrl, nTreffenNr) {
    // laedt Meeting-Object aus JSON-Datei vom Server
    var oTab = loadInetaTable(cUrl);
    var iMaxId = oTab.T_Meeting[0].TreffenNr;       // 1. Array-Element, Feld "TreffenNr"
    var iTPos = iMaxId - nTreffenNr;	// Umrechnung der TreffenNr in this.Access.nKey in Array-Position des JSON-Table, iTPos = 0 ist das 1. Array-Element
    return oTab.T_Meeting[iTPos];
}

function loadSessionFromJSON(cUrl, nTreffenNr, nSessionArrayIx) {
    // laedt Session-Object aus JSON-Tabelle T_Session vom Server
    var oTab = loadInetaTable(cUrl);
    var iMaxId = oTab.T_Session[0].TreffenNr;   // 1. Array-Element, Feld "TreffenNr"
    var iTPos = iMaxId - nTreffenNr;             // Umrechnung der TreffenNr in this.nKey in Array-Position des JSON-Table
    return oTab.T_Session[iTPos].Session[nSessionArrayIx];
}

function loadLocationFromJSON(cUrl, cOrtId) {
    // laedt Location-Object aus JSON-Datei vom Server
    var oTab = loadInetaTable(cUrl);
    // Array notation for objects
    return oTab.T_Location[cOrtId];
}

function ReadFile(fileUrl) {
    // Mozilla 0.9.6, Linux (Debian).
    // Mozilla 0.9.7, NT4.
    // Mozilla 0.9.8, Linux (Red Hat 7.1).
    // Mozilla 0.9.9, Win2000.
    // Mozilla 0.9.9, NT4.
    // Mozilla 0.9.9, Linux (Red Hat 7.2).
    // Mozilla 1.0 RC1, FreeBSD.
    // Netscape 6.1, NT4.
    // Netscape 6.2.1, Win2000.
    // Netscape 6.2.2, Win2000.
    // Netscape 6.2.2, NT4.
    // Netscape 6.2.2, Linux (Debian).
    // Netscape 7 Win2000
    // Netscape 8 Win2000
    // Firefox 1.07 Win2000
    // Firefox 1.5 Win2000
    // Opera 8.51 Win2000
    // Avant Browser 10 Win2000
    // Internet Explorer 6.0 SP1 Win2000
    // Internet Explorer 7.0 Windows Vista
    // Internet Explorer 11.0 Windows 8.1
    var req;
    var fileContent;

    if (window.XMLHttpRequest) {
        // branch for native XMLHttpRequest object
        req = new XMLHttpRequest();
        req.open("GET", fileUrl, false);
        req.send(null);
        fileContent = req.responseText;
    } else if (window.ActiveXObject) {
        // branch for IE/Windows ActiveX version
        req = new ActiveXObject("Microsoft.XMLHTTP"); // Microsoft.XMLHTTP
        req.open("GET", fileUrl, false);
        req.onreadystatechange = function () {
            if (req.readyState == 4) {
                fileContent = req.responseText;
            }
        }
        req.send(null);
    }
    return fileContent;
}

// Back-End Code (Testdaten)
function loadMeetingFromCode(nMtId) {
    // laedt Meeting-Object direkt aus dem Code
    var oTab =
    { "T_Meeting":
        [
           {
               "TreffenNr": 183,
               "SessionCount": 1,
               "TerminISO": "2015-03-19",
               "OrtId": ""
           },
           {
               "TreffenNr": 182,
               "SessionCount": 1,
               "TerminISO": "2015-02-19",
               "OrtId": "LetzterHeller"
           },
           {
               "TreffenNr": 181,
               "SessionCount": 2,
               "TerminISO": "2015-01-22",
               "OrtId": "JagdhausHeede"
           },
           {
               "TreffenNr": 180,
               "SessionCount": 2,
               "TerminISO": "2014-12-18",
               "OrtId": "OsteriaToscana"
           },
           {
               "TreffenNr": 179,
               "SessionCount": 1,
               "TerminISO": "2014-11-20",
               "OrtId": "OsteriaToscana"
           }
        ]
    };
    var iTPos = 183 - nMtId;
    iTPos = checkArrayAccessIndex(iTPos, oTab.T_Meeting);
    return oTab.T_Meeting[iTPos];
}

function loadSessionFromCode(nMtId, nSessionArrayIx) {
    //
    var oTab =
    { "T_Session":
        [
           { "TreffenNr": 183,
               "Session":
               [	{ "SessionId": "18301",
                   "Caption": "... wird noch gesucht",
                   "Summary": "...",
                   "Items": [ "Item 1", "Item 2", "Item 3", "Item 4" ],
                   "Speaker": "NN",
                   "Leute": 0,
                   "Firmen": 0 }
               ]
           },
           { "TreffenNr": 182,
               "Session":
               [	{ "SessionId": "18201",
                   "Caption": "Projekte der Software-Entwicklung Johannes K.",
                   "Summary": "Der freiberufliche Software-Entwickler Johannes stellt seine Projekte vor.",
                   "Items": [ "Item 1", "Item 2", "Item 3", "Item 4" ],
                   "Speaker": "Johannes",
                   "Leute": 0,
                   "Firmen": 0 }
               ]
           },
           { "TreffenNr": 181,
               "Session":
               [	{ "SessionId": "18101",
                   "Caption": "Vom Prozess zum Werkzeug - Software-Entwicklungsprozesse (Part&nbsp;2)",
                   "Summary": "Wie bekomme ich meinen angepassten Entwicklungsprozess auf ein ALM-Werkzeug wie den TFS? Es geht nicht um die vollständige Umsetzung sondern um das Umreißen der Möglichkeiten mit kleinen Demos.",
                   "Items": [ "Kandidaten für ALM im Vergleich (Polarion. TFS)", "Fertige Testumgebungen für TFS-Konfiguration (Brian Harry’s blog)",  "Individuelle TFS-Anpassungen an den Projekt Workflow", "Blick in ein aktiv genutztes TFS System mit über 16000 Change Requests" ],
                   "Speaker": "Martin R.",
                   "Leute": 9,
                   "Firmen": 7 },
          
                  { "SessionId": "18102",
                      "Caption": "Ausblick auf Microsoft HoloLens",
                      "Summary": "\"The era of holographic computing is here.\"",
                      "Items": [ "Video: Microsoft HoloLens presentation", "Video: Microsoft HoloLens - Das ist mit der Brille möglich" ],
                      "Speaker": "Martin R.",
                      "Leute": 8,
                      "Firmen": 6 }
               ]
           },
           { "TreffenNr": 180,
               "Session":
               [	{ "SessionId": "18001",
                   "Caption": "Veröffentlichungsprozess einer Universal App",
                   "Summary": "Zunächst wird kurz die kleine Taschenrechner-Anwendung vorgestellt (für die, die im August nicht da waren), danach wird gezeigt, wie der Submit Prozess für Windows-Phone und Windows-Store abläuft.",
                   "Items": [ "HP 41CV App", "Entwicklerkonto", "Zertifizierungskit für Windows-Apps", "Upload" ],
                   "Speaker": "Jürgen S.",
                   "Leute": 8,
                   "Firmen": 5 },
          
                  { "SessionId": "18002",
                      "Caption": "Vorstellung des 'All in One-PC' DELL XPS 18",
                      "Summary": "Intel® Core™ Prozessor der 3. Generation, hohe Datenverarbeitungsleistung, Windows 8.1, großer Full-HD-Touch-Bildschirm.",
                      "Items": [ "Motivation", "Produktvarianten", "Zubehör", "Praxiserfahrungen" ],
                      "Speaker": "Andreas",
                      "Leute": 8,
                      "Firmen": 5 }
               ]
           },
           { "TreffenNr": 179,
               "Session":
               [	{ "SessionId": "17901",
                   "Caption": "Software-Entwicklungsprozesse (Part&nbsp;1)",
                   "Summary": "Merkmale verschiedener Software-Entwicklungsprozesse im Vergleich",
                   "Items": [ "V-Modell", "Agile Softwareentwicklung", "Synthese, jeweils das beste aus den Prozessen", "Praxis Beispiel und Demo" ],
                   "Speaker": "Martin R.",
                   "Leute": 9,
                   "Firmen": 6 }
               ]
           }
        ]
    }
    var iTPos = 183 - nMtId;
    iTPos = checkArrayAccessIndex(iTPos, oTab.T_Session);
    return oTab.T_Session[iTPos].Session[nSessionArrayIx];
}

function loadLocationFromCode(cOrtId) {
    // initialsiert ein Object der Klasse Location-Record; Datenobject Ortsangaben zum Treffpunkt eines Treffens
    var oTab =
    {
        "T_Location":
        {
            "JagdhausHeede":
            {
                "OrtId": "JagdhausHeede",
                "Kurzname": "Jagdhaus Heede",
                "Name": "Hotel - Restaurant <b>\"Jagdhaus Heede\"</b>",
                "Praeposition": "im",
                "Ort": "Hann. M&uuml;nden",
                "PLZ": "34346",
                "Strasse": "Hermannsh&auml;ger Str. 81",
                "Fon": "05541 2395",
                "URL": "http://www.jagdhausheede.de",
                "VcfTag": "<a href=\"data/HannMuenden, JagdhausHeede.vcf\">HannMuenden, JagdhausHeede.vcf</a>",
                "ImageTag": "<img border=\"0\" src=\"images/as_jagdhausheede.png\" alt=\"Anfahrt &quot;Jagdhaus Heede&quot;\" width=\"1878\" height=\"762\">",
                "AnfahrtLink": "devglocation.htm?OrtId=JagdhausHeede",
                "AnfahrtText": "Das Lokal ist gut von der <em>A7</em> (Abfahrt 75, Hann. Münden - Hedemünden) zu erreichen. <strong>Aus Richtung Nord von der Abfahrt links abbiegen und dann die erste Ausfahrt des Kreisels nehmen; aus Richtung Süd die zweite Ausfahrt des Kreisels nehmen</strong>.<br> Nach rund 200 m nach rechts auf die <em>B80</em> Richtung Hann. Münden abbiegen. Der B80 bis Hann. Münden folgen. In Hann. Münden ca. 400 m nach dem Ortseingang beim EDEKA Markt NEUKAUF rechts in den Wiershäuser Weg abbiegen. Nach rund 200 m nach links in die Hermannshäger Straße. abbiegen. Der Hermannshäger Straße zunächst nach 50 m nach rechts folgen, danach ca. 1,2 km weiter folgen. Das &quot;Jagdhaus Heede&quot; liegt am Waldrand."
            },
            "default":
            {
                "OrtId": "default",
                "Kurzname": "NN",
                "Praeposition": "im",
                "Name": "Gasthaus <b>\"NN\"</b>",
                "Ort": "Xyz",
                "PLZ": "00000",
                "Strasse": "Straße",
                "Fon": "00000 000000",
                "URL": "",
                "VcfTag": "(no VCF-file)</a>",
                "ImageTag": "<img border=\"0\" src=\"images/as_default.png\" alt=\"Anfahrt &quot;default&quot;\" width=\"880\" height=\"495\">",
                "AnfahrtLink": "devglocation.htm?OrtId=default",
                "AnfahrtText": "(kein Anfahrttext)"
            }
        }
    };
    return oTab.T_Location[cOrtId];
}
