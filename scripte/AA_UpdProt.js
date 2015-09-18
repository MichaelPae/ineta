// AA_UpdProt.js
// Arbeits-Aufgaben und Update-Protokoll der InetaSite

// Copyright (c) Michael Paetzold. Alle Rechte vorbehalten. http://www.michael-paetzold.de

/*
Update Schritte zur Inetasite-Aktualisierung
--------------------------------------------
1. Editieren
    - Änderungen durchführen
    - index.htm touchen (Dummy-Änderung speichern wg. Aktualisierung)
    - devgnext.htm touchen (Dummy-Änderung speichern wg. Aktualisierung)
2. Test der Site "local"
3. Site -> Veröffentlichen
    - Die Verzeichnisse: Data, Images, Scripte, Root aktualisieren (Merkmale: Status="Geändert", Remote->Geändert<=Local->Geändert)
    - Insbesondere aktualisieren:
        - t_meeting.json
        - t_session.json
        - t_location.json
4. Test der Site "remote"

Anforderungen- und Update-Protokoll
-----------------------------------
Hauptziele der Inetasite-Entwicklung (Stand 24.01.2015)
1. Einfache Aktualisierung zu den Ineta-Meetings (V 2.0)
   a. Aktualisierung Meeting-Daten
   b. Aktualisierung Steuerdaten
   c. sämtliche Treffen-Contents, die noch in HTML codiert sind nach .JSON uebertragen
2. Dynamische dem Zeitpunkt angepasste Darstellung der Daten (V 2.x)
   a. MEZ-Datum ermitteln und fuer Darstellung verwenden
   b. Anzeige devgnext.htm in Abhängigkeit von MEZ-Datum
   c. Teilnahme- und Jahres-Statistik auf Daten einrichten
3. Daten in SQL halten (V 3.0)
4. Ineta-App (V 4.0)

Update-Protokoll
----------------
Update-Schritte 18.09.2015 Fr
- GitHub beherrschen lernen
- GitHub MichaelPae aktualisieren
- Ineta Web-Page als Lokales Git Repository einrichten
- Chart.js auf www.befo.com testen
- Statistik mit Chart umsetzen (Brainstorming: Devgroup-Logo in Caption-Zeile, Statistik rechts neben die Themenliste)
- Chart-Statistik auf "letzte Treffen" einrichten
- devgimpr.htm Abschnitts-Abstände vergrößern
- Page-Menü wie bei "Impressum", "Links" auch auf "Bisherige Treffen", "Nächstes Treffen"
- Treffen Nr. 1-50 in JSON-Data erfassen
- alle einzelnen Treffenberichte stilllegen

Update-Schritte 17.09.2015 Do
erl. Nr 190. als Default-Treffennr. gesetzt, Nr. 189 erfasst, Nr. 191 initialisiert
erl. GitHub MichaelPae/PS-Pieces aktualisieren
erl. Property Session.Link implementieren (Link-String mit "Material zur Session")
     erl. loaddata.js Class Session erweitert
     erl. mywebbot.js neue function assembleMaterialLink()

Update-Schritte 21.08.2015 Fr
erl. Nr 189. als Default-Treffennr. gesetzt, Nr. 188 erfasst, Nr. 190 initialisiert
erl. GitHub MichaelPae/PS-Pieces eingerichten, aktualisieren

Update-Schritte 17.07.2015 Fr
erl. Nr 188. als Default-Treffennr. gesetzt, Nr. 187 erfasst, Nr. 189 initialisiert

Update-Schritte 19.06.2015 Fr
erl. Nr 187. als Default-Treffennr. gesetzt, Nr. 186 erfasst, Nr. 188 initialisiert

Update-Schritte 22.05.2015 Fr
erl. Nr 186. als Default-Treffennr. gesetzt, Nr. 186 erfasst, Nr. 187 initialisiert

Update-Schritte 20.04.2015 Mo
erl. Nr 185. als Default-Treffennr. gesetzt, Nr. 184 erfasst, Nr. 186 initialisiert

Update-Schritte 12.04.2015 Di
erl. Treffen Nr. 51-60 in JSON-Data erfasst
erl. neu: oMeeting.Location.Praeposition

Update-Schritte 07.04.2015 Sa
erl. Treffen Nr. 61-65 in JSON-Data erfasst

Update-Schritte 29.03.2015 Sa
erl. Treffen Nr. 66-69 in JSON-Data erfasst

Update-Schritte 27.03.2015 Sa
erl. Treffen Nr. 70-77 in JSON-Data erfasst

Update-Schritte 23.03.2015 Mo
erl. Nr 184. als Default-Treffennr. gesetzt, Nr. 183 erfasst, Nr. 185 initialisiert

Update-Schritte 14.03.2015 Sa
erl. Treffen Nr. 79-80 in JSON-Data erfasst

Update-Schritte 03.03.2015 Di
erl. Treffen Nr. 81-89 in JSON-Data erfasst

Update-Schritte 22.02.2015 So
erl. Treffen Nr. 90-100 in JSON-Data erfasst

Update-Schritte 19.02.2015 Do
erl. Nr 183. als Default-Treffennr. gesetzt, Nr. 182 erfasst, Nr. 184 initialisiert

Update-Schritte 10.02.2015 Di
erl. Treffen Nr. 101-110 in JSON-Data erfasst

Update-Schritte 09.02.2015 Mo
erl. Treffen Nr. 111-119 in JSON-Data erfasst

Update-Schritte 07.02.2015 Sa
erl. Treffen Nr. 120-128 in JSON-Data erfasst

Update-Schritte 06.02.2015 Fr
erl. Treffen Nr. 129-136 in JSON-Data erfasst

Update-Schritte 05.02.2015 Do
erl. 182. Treffen aktualisiert

Update-Schritte 29.01.2015 Do
erl. Treffen Nr. 137-139 in JSON-Data erfasst

Update-Schritte 28.01.2015 Mi
erl. Treffen Nr. 140-148 in JSON-Data erfasst

Update-Schritte 27.01.2015 Di
erl. Treffen Nr. 148-149 in JSON-Data erfasst
erl. devglink.htm, devgnext layoutmäßig angeglichen

Update-Schritte 26.01.2015 Mo
erl. devglast.htm, devgnext layoutmäßig angeglichen

Update-Schritte 25.01.2015 So
erl. devgimpr.htm Abschnitts-Abstände vergrößern

Update-Schritte 24.01.2015 Sa
erl. AA_UpdProt.js aus mywebbot.js erstellt
erl. oInetasite.cDatenstand, oInetasite.cVersion (Versionsstand Javascript mywebbot) eingeführt

Update-Schritte 23.01.2015
erl. ut_devgchart.htm eingerichtet
erl. devgnext.htm: alle Abschnitte dynamisiert
erl. Publish: mywebbot.js V1.9 (Komplettes Update aller Files incl. neu: Anfahrt Letzter Heller, "Code"-Daten in JSON-Syntax)
erl. "Code"-Daten-Zugriffe auch in JSON-Syntax.
erl. Anfahrt Letzter Heller: HannMuenden, LetzterHeller.vcf erzeugt
erl. Anfahrt Letzter Heller: PSD-File LetzterHellerAnfahrt.psd und PNG-file as_letzterheller.png erzeugt
erl. Publish: Standard-Seiten-Aktualisierung
erl. Standard-Seiten-Aktualisierung: index.htm, devglink.htm aktualisiert.
erl. Standard-Seiten-Aktualisierung: TreffenNr 181 in t_ineta.json, t_location.json, t_meeting.json, t_session.json aktualisiert.

Update-Schritte 21.01.2015
erl. Chart.js download und Test

Update-Schritte 20.01.2015
erl. Treffen Nr. 150-155 in JSON-Data erfasst
erl. SessionReport, Sonderfall oSession.Items.length = 0
erl. oMeeting.Usergroup eingerichtet, wg. Namenswechsel an Nr. 90
erl. nAnzThemenListe als Site-Parameter in Class InetaSite() implementiert
erl. t_meeting.json  OrtId auf "default" falls "unbekannt", da "default" die Key Expression ist

Update-Schritte 19.01.2015
erl. Treffen Nr. 156 in JSON-Data erfasst
erl. checkVar() bzgl. "number" isNaN() geändert
erl. ut_devgmeeting.htm eingerichtet
erl. Aufruf fuer oMeeting (entsprechend "Location")

Update-Schritte 18.01.2015
erl. Test-HTML Pages in UT_<Testname>.htm umbenannt
erl. data-Verzeichnis mit *.json und *.vcf komplettiert
erl. images-Verzeichnis aufgeräumt und Images nach Funktion umbenannt
     (as_* Anfahrtskizzen, banner_, logo_*, stat_*, Tnnn_ Treffen zugeordnet, totale_ Gruppenbilder der Usergroup)
erl. alle Files, die nicht benutzt werden entfernt
erl. Publish: mywebbot.js V1.8 (Komplettes Update aller Files incl. neu: t_location.json, devglocation.htm?OrtId=cccccccc)
erl. Sicherungskopie Sik_2015_01_18

Update-Schritte 17.01.2015
erl. loadLocation() stillgelegt
erl. devglocation.htm?OrtId=cccccccc statt der einzelnen devgtref_xxx.htm implementieren
erl. für alle <Treffpunkt>.htm einen JSON-Abschnitt anlegen
erl. t_location.json komplettiert
erl. ut_devglocation.htm einrichten
erl. <Treffpunkt>.htm stilllegen

Update-Schritte 16.01.2015
erl. Back-End-Parameter für Zugriffe auf T_Meeting, T_Seesion, T_Location, ... identisch verwenden
erl. BackEnd-Klasse einführen.

Update-Schritte 15.01.2015
erl. Die verschiedenen Daten-Zugriffe von function location() und function loadLocation() harmonisieren

Update-Schritte 14.01.2015
erl. Treffpunkt-Beschreibungsseiten-Template devglocation.htm (JSON-Driven "t_location.json")
erl. Struktur und Zugriff auf Treffpunkt-Daten definieren ("t_location.json")

Update-Schritte 13.01.2015
erl. Umgebungs-Parameter in .JSON auslagern t_inetasite.json
erl. Publish: mywebbot.js V1.7 (JSON im Echtbetrieb)
erl. alle Treffen ab Nr. 181-157 in JSON-Files t_meeting.json, t_session.json erfassen
erl. JSON im Echtbetrieb testen
erl. .JSON als MIMI-Typ "application/json" aktivieren

Update-Schritte 12.01.2015
erl. loaddata.js komplett Parameter getrieben, ohne Update-abhängige Änderungen
erl. Parameter im Startbereich der Access-Class
erl. mywebbot("DataPath")
erl. neue fct. getRootPath()
erl. JSON auf dem Host implementieren
erl. alle 182 Treffen mit Key-Werten TreffenNr SessionCount als JSON-Data erfassen

Update-Schritte 10.01.2015
erl. technisch auf JSON Data umstellen

Update-Schritte 10.01.2015
erl. Datensicherung siehe Verzeichnis SIK
erl. Publish: mywebbot.js V1.6 (dynamische Treffen-Reports devtreffen.htm?TreffenNr=xxx)
erl. Datenpflege der Treffen bis 158-169
erl. Aufruf devtreffen.htm?TreffenNr=xxx in devglast.htm
erl. devgtreffen.htm -Template: <TITLE> dynamisieren
erl. devgtreffen.htm -Template statt einzelner Files
erl. Parameter-Übergabe an HTML-File

Update-Schritte 29.12.2014
erl. Bugfix: devgt180.htm nicht mehrsessionfähig
erl. weiterer Access-Parameter nSNr
erl. Bugfix: index.htm Singular klappt nicht bei "Themen"
erl. dev_tref_jagdhausheede.htm Anfahrtskizze Jagdhaus Heede fehlt

Update-Schritte 10.06.2014
erl. Publish: mywebbot.js V1.5 (entwickelt als inetabot.js, Inetasite-Content-Daten als Javascript-DataObjects)

Update-Schritte 07.06.2014
erl. Test: Implementierung .JSON-Files in Inetasite (VS-Testumgebung)
erl. Test: Auslagern der Javascript DatenObject-Strukturen in .JSON-Files
erl. Test: Verlagerung der Inetasite-Content-Daten in Javascript DatenObject-Strukturen (inetabot.js)
erl. Test .JSON-Parser json2.js, function JSON.parse(cContent)
erl. Test readfile()
erl. Sondieren der Problemetik: Verlagerung der Daten aus dem Code in reine Daten-Files
erl. Übungen zum Javascript Debuggen
erl. Einrichten einer Javascript Testumgebung in Visual Studio 12 (VS-Testumgebung)

Update-Schritte 2010
erl. Publish: mywebbot.js V1.0
erl. Wechsel von Microsoft Frontpage nach Microsoft Expression Web 4
erl. Ersetzen der Frontpage-Variablen durch "mywebbot.js" Javascript-Funktion (mywebbot.js V1.0)

Update-Schritte 03.07.2008
erl. Implementierung INETA Werbe-Banner

Update-Schritte 17.02.2006
erl. Layout-Wechsel der Homepage zu .NET "DevGroup Göttingen/Kassel" als INETA-Mitglied

Update-Schritte 05.12.1997
erl. Einrichten einer einfachen statischen "VOCA-Usergroup GöKs" Homepage mit Microsoft Frontpage
*/