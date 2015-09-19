// mywebbot.js (Ursprung inetabot.js mit Stand 2014-06-10)
// stellt fuer Ineta Site Variablen zur Verfügung

// Copyright (c) Michael Paetzold. Alle Rechte vorbehalten. http://www.michael-paetzold.de


function mywebbot(cName, xKey, nSNr, cBE, cFE) {
    // stellt fuer Ineta Site 'Variablen' cName zur Verfügung
    var oVar = new Access(cName, xKey, nSNr, cBE, cFE);

    if (typeof oVar.Wert == "undefined") {
        oVar.executeIneta();
    }

    if (typeof oVar.Wert == "undefined") {
        oVar.executeStandard();
    }

    if (oVar.cFE == 'Document') {
        document.write(oVar.Wert);
    }
    return oVar.Wert;
}

// Class Access
function Access(cName, xKey, nSNr, cBE, cFE) {
    // Class Access - Zugriffe auf Variable cName mit Schluessel xKey von Datenquelle cBE fuert Front-End cFE
    var oInetasite = new Inetasite()

    // Site-Parameter
    var lTest = oInetasite.lTest;                                       // false, true - steuert Länge von Listen
    var nDefaultTreffenNr = oInetasite.nDefaultTreffenNr;               // die Nr. des nächsten Treffens
    var nStartDataMigrationsTreffenNr = oInetasite.nStartDataMigrationsTreffenNr;
    var nAnzahlTreffenlisteTest = oInetasite.nAnzahlTreffenlisteTest;   // nur im Testfall relevant

    // berechnete Site-Parameter
    var nAnzThemenListe = ((lTest) ? 3 : oInetasite.nAnzThemenListe);  // Laenge der Letzte-Themen-Liste auf Index.htm
    var nLetztesTreffenNrMax = nDefaultTreffenNr - 1;
    var nStartDataTemplateUse = ((lTest) ? (nLetztesTreffenNrMax + 1) - nAnzahlTreffenlisteTest : nStartDataMigrationsTreffenNr );

    // Default-Werte fuer Aufruf-Parameter
    this.cName = checkVar(cName, "string", "Nonsense");         // Zugriffs-Key fuer Wertermittlung
    this.nKey = checkVar(xKey, "number", nDefaultTreffenNr);    // Zugriffs-Key fuer Back-End Meeting-Record
    this.cKey = checkVar(xKey, "string", "");
    this.nSNr = checkVar(nSNr, "number", 1);                    // Zugriffs-Nummer fuer Back-End Session-Record
    this.cBE = checkVar(cBE, "string", oInetasite.cBackEnd);
    this.cFE = checkVar(cFE, "string", "Document");             // Zugriffs-Key fuer Front-Ende

    // Access-Eigenschaften
    this.oBackEnd = new BackEnd(this.cBE, oInetasite.cDataMode, oInetasite.cFixDataPath);
    this.lTest = lTest;                                         // false, true
    this.nNrMax = nLetztesTreffenNrMax;
    this.nNrMin = nStartDataMigrationsTreffenNr;
    this.nNrMinTemplateUse = nStartDataTemplateUse;
    this.nAnzThemenListe = nAnzThemenListe;
    this.Wert = undefined;
}

Access.prototype.executeIneta = function executeIneta() {
    // fuehrt die Ineta spezifischen Wertermittlungen eines Access-Objects aus
    switch (this.cName) {
        case "DataPath":  
            this.DataPath();
            break;
        case "AddressTag":  // Meeting
            this.AddressTag();
            break;
        case "AnfahrtLink": // Meeting
            this.AnfahrtLink();
            break;
        case "Anmeldeschluss": // Meeting
            this.Anmeldeschluss();
            break;
        case "Beteiligung": // Meeting
            this.Beteiligung();
            break;
        case "LetzterTermin": // Meeting
            this.Decrement();
            this.Termin();
            break;
        case "Location": 
            this.getLocation(); // gibt in this.Wert oLocation fuer this.cKey zurueck
            break;
        case "Meeting":
            this.getMeeting();  // gibt in this.Wert oMeeting fuer this.cKey zurueck
            break;
        case "NaechsterTermin": // Meeting // Kompatibilitaetsfunktion besser "Termin"
            this.Termin();
            break;
        case "Ort": // Meeting // Kompatibilitaetsfunktion besser "Treffpunkt"
            this.Treffpunkt();
            break;
        case "Termin":  // Meeting
            this.Termin();
            break;
        case "TerminDuden": // Meeting
            this.TerminDuden();
            break;
        case "TerminISO":   // Meeting
            this.TerminISO();
            break;
        case "TreffenNr":   // Meeting
            this.TreffenNr();
            break;
        case "TreffenZaehler":  // Meeting
            this.TreffenZaehler();
            break;
        case "Treffpunkt": // Meeting
            this.Treffpunkt();
            break;
        case "UeberNaechsterTermin":    // Meeting
            this.Increment();
            this.Termin();
            break;
        case "BisherigeTreffenListe":   // Meeting, Session
            this.BisherigeTreffenListe();
            break;
        case "SessionCount":   // Meeting
            this.SessionCount();
            break;
        case "getNumerusThema":   // Meeting, Session
            this.SessionCount();
            this.getNumerus("Thema", "Themen", this.Wert);
            break;
        case "listCaptions":   // Meeting, Session
            this.listCaptions();
            break;
        case "SessionAnnouncement":   // Meeting
            this.SessionAnnouncement();
            break;
        case "MeetingReport":   // Meeting, Session
            this.MeetingReport();
            break;
        case "ThemenListe":   // Meeting, Session
            this.ThemenListe(this.nAnzThemenListe);
            break;
        case "NextLink": // Meeting, Session
            this.Increment();
            this.Link();
            break;
        case "NextSpeaker": // Meeting, Session
            this.Increment();
            this.Speaker();
            break;
        case "NextThema":   // Meeting, Session
            this.Increment();
            this.Thema();
            break;
        case "Items":   // Meeting, Session       
            this.Items(this.nSNr);
            break;
        case "Link": // Meeting, Session
            this.Link(this.nSNr);
            break;
        case "Speaker": // Meeting, Session
            this.Speaker(this.nSNr);
            break;
        case "Summary": // Meeting, Session
            this.Summary(this.nSNr);
            break;
        case "Thema":   // Meeting, Session
            this.Thema(this.nSNr);
            break;
        //case "Announce":   // Meeting, Session
        //    this.Announce();
        //    break;
    }
}

Access.prototype.executeStandard = function executeStandard() {
    // fuehrt die Standard-Wertermittlungen eines Access-Objects aus
    switch (this.cName) {
        case "Today":
            this.Wert = (new Date).convMyStr();
            break;
        default:
            this.UnknownVar();
            break;
    }
}

// Methoden ohne Databinding
Access.prototype.DataPath = function DataPath() {
    // holt DataPath
    var cDataPath = this.oBackEnd.cDataPath;
    this.Wert = cDataPath + ((this.cBE=="Code") ? " (inaktiv)" : "");
    return cDataPath;
}

Access.prototype.Decrement = function Decrement() {
    // decrement this.nKey
    this.nKey = this.nKey - 1;
}

Access.prototype.Increment = function Increment() {
    // increment this.nKey
    this.nKey = this.nKey + 1;
}

Access.prototype.UnknownVar = function UnknownVar() {
    //
    this.Wert = "(" + typeof this.cName + ", " + typeof this.nKey + ") " + this.cName + ", " + this.nKey.toString();
}

// Methoden mit Databinding Location
Access.prototype.getLocation = function getLocation() {
    //
    var oLocation = new Location(this.oBackEnd, this.cKey);
    this.Wert = oLocation;
}

// Methoden mit Databinding Meeting
Access.prototype.getMeeting = function getMeeting() {
    //
    var oMeeting = new Meeting(this);
    this.Wert = oMeeting;
}
Access.prototype.AddressTag = function AddressTag() {
    //
    var oMeeting = new Meeting(this);
    var cTreffenNr = oMeeting.TreffenNr.toString();
    this.Wert = assembleAddressTag("devgt" + cTreffenNr + ".htm", cTreffenNr + ". Treffen");
}

Access.prototype.AnfahrtLink = function AnfahrtLink() {
    //
    var oMeeting = new Meeting(this);
    this.Wert = assembleAddressTag(oMeeting.Location.AnfahrtLink, "Anfahrtskizze und Adresse");
}

Access.prototype.Anmeldeschluss = function Anmeldeschluss() {
    //
    var oMeeting = new Meeting(this);
    this.Wert = oMeeting.Anmeldeschluss;
}

Access.prototype.Beteiligung = function Beteiligung() {
    //
    var oMeeting = new Meeting(this);
    this.Wert = "(" + oMeeting.Leute.toString() + " Leute aus " + oMeeting.Firmen.toString() + " Firmen)";
}

Access.prototype.Ort = function Ort() {
    var oMeeting = new Meeting(this);
    this.Wert = oMeeting.Location.Ort;
}

Access.prototype.Treffpunkt = function Treffpunkt() {
    var oMeeting = new Meeting(this);
    this.Wert = '<b>' + oMeeting.Location.Ort + '</b> ' + oMeeting.Location.Praeposition + ' ' + oMeeting.Location.Name;
}

Access.prototype.Termin = function Termin() {
    var oMeeting = new Meeting(this);
    this.Wert = oMeeting.Date.convAlpha();
}

Access.prototype.TerminDuden = function TerminDuden() {
    // "3.6.1956"
    var oMeeting = new Meeting(this);
    this.Wert = oMeeting.Date.convDuden();
}

Access.prototype.TerminISO = function TerminISO() {
    // "2014-12-31"
    var oMeeting = new Meeting(this);
    this.Wert = oMeeting.Date.convIso();
}

Access.prototype.TreffenNr = function TreffenNr() {
    this.Wert = this.nKey;
}

Access.prototype.TreffenZaehler = function TreffenZaehler() {
    //var oMeeting = new Meeting(this);
    this.TreffenNr();
    this.Wert = this.Wert.toString(10) + ". Treffen";
}

// benoetigt Databinding Meeting, Session
Access.prototype.BisherigeTreffenListe = function BisherigeTreffenListe() {
    //
    this.Wert = this.assembleBisherigeTreffenListe(this.nNrMax, this.nNrMinTemplateUse);
}

Access.prototype.SessionCount = function SessionCount() {
    //
    var oMeeting = new Meeting(this);
    var nCount = oMeeting.SessionCount; // <ENGINE />
    this.Wert = nCount;
}

Access.prototype.getNumerus = function getNumerus(cSingular, cPlural, nAnzahl) {
    // gibt in Abhaengigkeit von nAnzahl cSingular oder cPlural zurueck
    var cNumerus = cPlural;
    if (nAnzahl == 1) {
        cNumerus = cSingular;
    }
    this.Wert = cNumerus;
}

Access.prototype.listCaptions = function listCaptions() {
    // stellt HTML-Liste der Sessions mit Caption, Speaker, Summary je Session zusammen
    var oMeeting = new Meeting(this);
    var iAnzahl = oMeeting.SessionCount;
    var cHtml = '';

    if (iAnzahl > 1) {
        // Loop ueber alle Sessions eines Meetings
        for (var i = 1; i <= iAnzahl; i++) {
            cHtml += '<li><b>' + oMeeting.Sessions[i].Caption + '</b></li>';
        }
    } else {
        cHtml += '<b>' + oMeeting.Sessions[1].Caption + '</b>';
    }
    this.Wert = cHtml + '<br />';
}

Access.prototype.SessionAnnouncement = function SessionAnnouncement() {
    // stellt HTML-Liste der Sessions mit Caption, Speaker, Summary je Session zusammen
    var oMeeting = new Meeting(this);
    var iAnzahl = oMeeting.SessionCount;
    var oSession;
    var cHtml = '';

    if (iAnzahl > 1) {
        // Loop ueber alle Sessions eines Meetings
        for (var i = 1; i <= iAnzahl; i++) {
            oSession = oMeeting.Sessions[i];
            cHtml += '<li>';
            cHtml += '<b>' + oSession.Caption + '</b> (' + oSession.Speaker + ')'
            cHtml += '</li>';
            cHtml += '<ul>' + oSession.Summary + '</ul><br />';
        }
    } else {
        oSession = oMeeting.Sessions[1];
        cHtml += '<b>' + oSession.Caption + '</b> (' + oSession.Speaker + ')'
        cHtml += '<ul>' + oSession.Summary + '</ul><br />';
    }
    this.Wert = cHtml;
}

Access.prototype.MeetingReport = function MeetingReport() {
    // stellt HTML-Liste der Sessions mit Caption, Speaker, Summary je Session zusammen
    var oMeeting = new Meeting(this);
    var iAnzahl = oMeeting.SessionCount;
    var oSession;
    var aItems;
    var cHtml = '';

    if (iAnzahl > 1) {
        // Loop ueber alle Sessions eines Meetings
        for (var i = 1; i <= iAnzahl; i++) {
            oSession = oMeeting.Sessions[i];
            cHtml += this.SessionReport(oSession);
        }
    } else {
        oSession = oMeeting.Sessions[1];
        cHtml += this.SessionReport(oSession);
    }
    this.Wert = cHtml;
}

Access.prototype.SessionReport = function SessionReport(oSession) {
    // stellt HTML-Code der Sessions mit Caption, Items, Speaker zusammen
    // var  aItems = oSession.Items;
    var cHtml = '';

    cHtml += '<div>';
	cHtml += '<b>' + oSession.Caption + '</b>' + assembleMaterialLink(oSession.Link);
	cHtml +=  assembleSummary(oSession.Summary); 
	if (oSession.Items.length>0) {
        cHtml += '<ul>' + assembleHtmlListFromArray(oSession.Items) + '</ul>';
    } else {
        cHtml += '<br />'
    }
	cHtml += '<br />Usergroup: <i>Herzlichen Dank ' + oSession.Speaker + '!</i>';
	cHtml += '</div><br />';  
    return cHtml;
}

Access.prototype.ThemenListe = function ThemenListe(nAnzahl) {
    // Themenliste der letzten nAnzahl Treffen
    this.Wert = this.assembleThemenListe(nAnzahl);
}

Access.prototype.Items = function Items(nSessionNr) {
    // stellt HTML-Liste der Items einer Session zusammen
    nSessionNr = checkVar(nSessionNr, "number", 1);
    var oMeeting = new Meeting(this);
    var aItems = oMeeting.Sessions[nSessionNr].Items; // <ENGINE />
    this.Wert = assembleHtmlListFromArray(aItems);
}

Access.prototype.Link = function Link(nSessionNr) {
    nSessionNr = checkVar(nSessionNr, "number", 1);
    var oMeeting = new Meeting(this);
    var cLink = oMeeting.Sessions[nSessionNr].Link; // <ENGINE />
    this.Wert = cLink;
}

Access.prototype.Speaker = function Speaker(nSessionNr) {
    nSessionNr = checkVar(nSessionNr, "number", 1);
    var oMeeting = new Meeting(this);
    var cSpeaker = oMeeting.Sessions[nSessionNr].Speaker; // <ENGINE />
    this.Wert = cSpeaker;
}

Access.prototype.Summary = function Summary(nSessionNr) {
    nSessionNr = checkVar(nSessionNr, "number", 1);
    var oMeeting = new Meeting(this);
    var cSummary = oMeeting.Sessions[nSessionNr].Summary; // <ENGINE />
    this.Wert = cSummary;
}

Access.prototype.Thema = function Thema(nSessionNr) {
    nSessionNr = checkVar(nSessionNr, "number", 1);
    var oMeeting = new Meeting(this);
    var cCaption = oMeeting.Sessions[nSessionNr].Caption; // <ENGINE />
    this.Wert = cCaption;
}

Access.prototype.assembleBisherigeTreffenListe = function assembleBisherigeTreffenListe(nNrMax, nNrMin) {
    // setzt Liste der bisherigen Treffen zusammen
    var oAccessI;
    var oMeetingI;
    var cCaptionList;
    nNrMax = checkVar(nNrMax, "number", this.nNrMax);
    nNrMin = checkVar(nNrMin, "number", this.nNrMin);
    var cListe = "";

    for (var i = nNrMax; i > nNrMin - 1; i--) {
        oAccessI = new Access("BisherigesTreffen", i, null, this.cBE, this.cFE);
        oMeetingI = new Meeting(oAccessI);       // Datenobject zum Key

        cCaptionList = assembleCaptionList(oMeetingI);
        cListe = cListe + assembleTreffenLinkItem(oMeetingI.TreffenNr, cCaptionList, oMeetingI.Termin)
    }
    return cListe;
}

Access.prototype.assembleThemenListe = function assembleThemenListe(nAnzahl) {
    // setzt eine Liste der Themen der letzten nAnzahl Treffen zusammen
    nAnzahl = checkVar(nAnzahl, "number", this.nAnzThemenListe);
    var cListe = "";
    var cCaptionList;
    var cLink;
    var cAhrefTreffen;
    var cARefMaterial;
    var oAccessI = this;
    var oMeeting = new Meeting(this);
    var nStartNr = oMeeting.TreffenNr - 1;
    for (var i = nStartNr; i > nStartNr - nAnzahl; i--) {
        oAccessI.Decrement();
        oMeeting = new Meeting(oAccessI);            // Datenobject zum Key 
        
        cTreffenNr = i.toString();
        cAhrefTreffen = assembleAddressTag("devgtreffen.htm?treffennr=" + cTreffenNr, cTreffenNr + ".");

        cCaptionList = oMeeting.Sessions[1].Caption; // <ENGINE />

        cLink = oMeeting.Sessions[1].Link;           // <ENGINE />
        cARefMaterial = assembleMaterialLink(cLink);
      
        cListe = cListe + '<li>' + cAhrefTreffen + " " + cCaptionList + cARefMaterial + '</li>';
    }
    return cListe;
}

// Extending Date Object
Date.prototype.convAlpha = function convAlpha() {
    return convDate2AlphaDate(this);
}

Date.prototype.convIso = function convIso() {
    return convDate2IsoDate(this);
}

Date.prototype.convDuden = function convDuden() {
    return convDate2DudenDate(this);
}

Date.prototype.convMyStr = function convMyStr() {
    return convDate2MyStr(this);
}

Date.prototype.addDays = function addDays(iDays) {
    // addiert/subtrahiert Tagesanzahl iDays auf/von Datums-Object this
    var iMillisec = this.getTime() + (iDays * 86400000);
    var oNewDate = new Date(iMillisec);
    return oNewDate;
}

Date.prototype.calcVortag = function calcVortag() {
    // berechnet den Vortag zum Datums-Object this
    return this.addDays(-1);
}

// Datums-Funktionen
function convDate2IsoDate(Datum) {
    // konvertiert ein Date-Object in einen ISO-Datumsstring (Bsp. "2014-06-05")
    var iDay = Datum.getDate();
    var iMonth = Datum.getMonth() + 1;
    var iYear = Datum.getFullYear();
    var cDate = "";
    cDate += rightStr("0000" + iYear.toString(), 4) + "-";
    cDate += rightStr("0" + iMonth.toString(), 2) + "-";
    cDate += rightStr("0" + iDay.toString(), 2);
    return cDate;
}

function convDate2AlphaDate(Datum) {
    // konvertiert ein Date-Object in alphanumerischen String (Bsp. "3. Juni 1956")
    var aMonat = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");
    var iDay = Datum.getDate();
    var iMonth = Datum.getMonth();
    var iYear = Datum.getFullYear();
    var cDate = "";
    cDate += iDay.toString() + ". ";
    cDate += aMonat[iMonth] + " ";
    cDate += iYear.toString();
    return cDate;
}

function convDate2DudenDate(Datum) {
    // konvertiert ein Date-Object in einen alphanumerischen Datums-String entspr. Duden
    var iDay = Datum.getDate();
    var iMonth = Datum.getMonth() + 1;
    var iYear = Datum.getFullYear();
    var cDate = "";
    cDate += iDay.toString() + ".";
    cDate += iMonth.toString() + ".";
    cDate += iYear.toString();
    return cDate;
}

function convDate2MyStr(Datum) {
    // konvertiert ein Datum in einen proprietären Datums-String
    var nDay = Datum.getDate();
    var nMonth = Datum.getMonth() + 1;
    var nYear = Datum.getFullYear();
    var cDate = "";
    cDate += nDay.toString() + ". ";
    cDate += nMonth.toString() + ". ";
    cDate += nYear.toString();
    return cDate;
}

function convIsoDate2Date(cIsoDate) {
    // konvertiert einen ISO-Datumsstring "2014-06-05" in ein Date-Object
    var iDay = parseInt(cIsoDate.substr(8, 2), 10);         // Zahlsystemangabe wichtig, fuehrende Nullen kennzeichnen Oktalzahlen
    var iMonth = parseInt(cIsoDate.substr(5, 2), 10) - 1;
    var iYear = parseInt(cIsoDate.substr(0, 4), 10);
    var oDate = new Date(iYear, iMonth, iDay);
    return oDate;
}

// HTML-Code um Inhalte bauen
function assembleHtmlListFromArray(aListe) {
    // konvertiert ein Dim1-Array() in eine <ul>-Liste
    var cListe = "";
    for (var i = 0; i < aListe.length; ++i) {
        cListe = cListe + '<li>' + aListe[i] + '</li>';
    }
    return cListe;
}

function assembleAddressTag(cUrl, cText) {
    // setzt einen <a>-Tag zusammen
    var cAhref = '<a href="' + cUrl + '">' + cText + '</a>';
    return cAhref;
}

function assembleCaptionList(oMeeting, cSep) {
    // setzt eine Liste der Session-Captions eines Meetings zusammen
    var cCaptionList = "";
    var nSessionCount = oMeeting.SessionCount;

    if (isEmpty(cSep)) {
        cSep = '<br />';
    } 
   
    for (var j = 1; j <= nSessionCount; j++) {
        cCaptionList = cCaptionList + oMeeting.Sessions[j].Caption; // urspr. nur : oMeeting.Sessions[1].Caption
        if (j<nSessionCount) {
            cCaptionList = cCaptionList + cSep ;
        }
    }
    return cCaptionList
}

function assembleMaterialLink(cUrl) {
    // setzt den <a>-Tag zum Material zusammen
    var cAHref = "";
    if (cUrl != "") {
        cAHref = ' (<a href="'+ cUrl + '" target="_blank">Material zur Session</a>)';   // ' (<a href="'+cLink+'" target="_blank">Material zur Session</a>)'
    }
    return cAHref;
}

function assembleSummary(cSummary) {
    // setzt den Summary-String zusammen
    var cString = "";
    if (cSummary != "...") {
        cString = '<br />' + cSummary; 
    }
    return cString;
}

function assembleTreffenLinkItem(nTreffenNr, cMainSessionCaption, cTermin) {
    // setzt Item fuer den Link auf die HTML-Template-Page des Treffen zusammen
    var cTreffenNr = nTreffenNr.toString();
    //var cAhref = assembleAddressTag("devgt" + cTreffenNr + ".htm?treffennr="+cTreffenNr, cTreffenNr + ". Treffen");
    var cAhref = assembleAddressTag("devgtreffen.htm?treffennr=" + cTreffenNr, cTreffenNr + ". Treffen");
    var cBisherigesTreffen = '<li>' + cAhref + ', ' + cTermin + '<br />' + cMainSessionCaption + '<br /><br /></li>'
    return cBisherigesTreffen;
}

// String-Manipulation
function extractRightPart(cString, cSeparator) {
    // extrahiert rechten Teil nach Separator von cString
    var nPos = 0;
    var cRight = "";

    if (cString != "") {
        nPos = cString.indexOf(cSeparator);
    }
    if (nPos > 0) {
        cRight = cString.substr(nPos + 1);
    }
    return cRight;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function rightStr(cStr, iLength) {
    var cRight = cStr.substr(cStr.length - iLength, iLength);
    return cRight;
}

function readQueryValue(cDefaultValue) {
    // liest den Value des Query-Teils einer URI
    cDefaultValue = checkVar(cDefaultValue, "string", "default");
    var cParm = extractRightPart(location.search, "=");
    cParm = ((isEmpty(cParm)) ? undefined : cParm);
    cParm = checkVar(cParm, "string", cDefaultValue);
    return cParm;
}

// Sonstige Funktionen
function checkArrayAccessIndex(nPos, a) {
    // prueft Array-Zugriffsindex nPos
    var nAlen = a.length;

    if (nPos < 0) {
        nPos = 0;
    }
    if (nPos >= nAlen) {
        nPos = nAlen - 1;
    }
    return nPos;
}

function checkVar(xVar, cType, xDefault) {
    // prueft Key xVar
    if (cType == "number" && isNaN(xVar)) {
        xVar = xDefault;
    }
    if (!(typeof xVar == cType)) {
        var xChecked = xDefault;
    } else {
        var xChecked = xVar;
    }
    return xChecked;
}

function getDataPath(cSubDir) {
    // liefert Daten-Zugriffspfad
    var cDataPath = getRootPath();
    cDataPath = cDataPath + "/" + cSubDir; 
    return cDataPath;
}

function getRootPath() {
    // holt den Pfad zum aktuellen Document
    var cRootPath = "";
    var cUrl = window.location.href;
    var nPosSlash = cUrl.lastIndexOf("/");

    if (nPosSlash > 1) {
        cRootPath = cUrl.substr(0, nPosSlash);
    }
    return cRootPath;
}
