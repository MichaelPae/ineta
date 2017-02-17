// readdata.js
// liest JSON-Daten ein

// Copyright (c) Michael Paetzold. Alle Rechte vorbehalten. http://www.michael-paetzold.de



// Class MyTestData
function MyTestData() {
    // laedt MyTestData-Object aus JSON-Datei vom Test-Client
    var oTab = loadJsonData( getDataPath("data")+"/"+"z_test.json" );
    var oDate =convIsoDate2Date(oTab.ServiceProperty.Datenstand);

    this.cDatenStand = convDate2DudenDate(oDate);
    this.cVersion = oTab.ServiceProperty.Version;
    this.lTest = oTab.ServiceProperty.Test;
    this.nDefaultTreffenNr = oTab.ServiceProperty.DefaultTreffenNr;
    this.nStartDataMigrationsTreffenNr = oTab.ServiceProperty.StartDataMigrationsTreffenNr;
    this.nAnzThemenListe = oTab.ServiceProperty.AnzThemenListe;
    this.nAnzahlTreffenlisteTest = oTab.ServiceProperty.AnzahlTreffenlisteTest;
    this.cBackEnd = oTab.ServiceProperty.BackEnd;
    this.cDataMode = oTab.ServiceProperty.DataMode;
    this.cFixDataPath = oTab.ServiceProperty.FixDataPath;
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

function convIsoDate2Date(cIsoDate) {
    // konvertiert einen ISO-Datumsstring "2014-06-05" in ein Date-Object
    var iDay = parseInt(cIsoDate.substr(8, 2), 10);         // Zahlsystemangabe wichtig, fuehrende Nullen kennzeichnen Oktalzahlen
    var iMonth = parseInt(cIsoDate.substr(5, 2), 10) - 1;
    var iYear = parseInt(cIsoDate.substr(0, 4), 10);
    var oDate = new Date(iYear, iMonth, iDay);
    return oDate;
}

// Back-End JSON
function loadJsonData(cUrl) {
    // laedt und deserialisiert JSON-File von cUrl
    var cContent = ReadFile(cUrl);
    return JSON.parse(cContent);
}

function ReadFile(fileUrl) {
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
