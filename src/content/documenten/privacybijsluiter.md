---
title: Privacybijsluiter
sub: Bijlage 1
order: 2
lead: SignCoach verwerkt van leerlingen alleen een voornaam of bijnaam, de klas, een pincode en de leervoortgang. Camerabeelden verlaten het apparaat nooit.
status: concept
datum: 26 oktober 2026
---

#### Het product

SignCoach is een app waarmee leerlingen Nederlandse Gebarentaal (NGT) leren. De app laat een voorbeeld zien, en de leerling doet het gebaar na voor de camera. De app herkent de handvorm op het apparaat zelf en geeft direct feedback. Docenten zien in de app de voortgang van hun klas.

#### Welke gegevens, van wie en waarom

| Betrokkene | Gegevens | Doel |
| --- | --- | --- |
| Leerling | Voornaam of bijnaam (ingevoerd door de docent) | Leerling herkennen in de klaslijst en bij het inloggen |
| Leerling | Klas en school | Leerling koppelen aan de juiste docent en licentie |
| Leerling | Pincode van 4 cijfers: als hash voor het inloggen, en leesbaar voor de eigen docent | Inloggen zonder e-mailadres; de docent kan een vergeten pincode opzoeken en inlogkaartjes printen |
| Leerling | Mislukte inlogpogingen (aantal en tijdstip) | Beveiliging: na 5 mislukte pogingen 15 minuten geblokkeerd |
| Leerling | Leervoortgang: welk gebaar geoefend, score en datum per geslaagde oefening, XP, oefenreeks, badges | Leren: voortgang tonen aan leerling en docent, volgende les openzetten |
| Leerling | Dagen waarop geoefend is (alleen de datum) | Docent en school zien hoeveel leerlingen per week oefenen |
| Leerling | Instelling "oefenen met camera" aan of uit (ingesteld door de docent) | Leerlingen zonder toestemming voor de camera oefenen zonder camera |
| Leerling | Technisch account-ID en een intern, niet-bestaand e-mailadres | Technisch nodig voor het inlogsysteem; bevat geen echte gegevens |
| Docent, schoolbeheerder | E-mailadres, wachtwoord (versleuteld) of Google-account, rol, school; vrijwillig: antwoorden op het feedbackformulier | Inloggen en beheer van klassen; de app verbeteren |
| School | Naam, BRIN-nummer, naam en e-mailadres contactpersoon, licentieperiode, aantal plekken | Licentiebeheer en facturatie |
| School (anoniem) | Per gebaar per dag: aantal camera-pogingen en hoeveel daarvan gelukt zijn, niet te herleiden tot een leerling | De herkenning verbeteren en de pilot evalueren |
| Alle gebruikers | IP-adres en tijdstip van inloggen, in de logbestanden van Supabase | Beveiliging en misbruikdetectie |
| Alle gebruikers | Anonieme crashrapporten: foutmelding, apparaatmodel, besturingssysteem, app-versie | Fouten in de app oplossen |

SignCoach verwerkt **geen** achternaam, geboortedatum, e-mailadres van leerlingen, foto's, video's of geluid van leerlingen. Er is geen reclame, geen profilering en geen verkoop van gegevens. Leerlingen krijgen geen pushmeldingen.

#### Camera

De camera wordt alleen gebruikt tijdens het oefenen. De herkenning (MediaPipe) draait volledig op het apparaat. Er wordt geen beeld, video of handpositie naar een server gestuurd en er wordt niets opgeslagen. Alleen het resultaat ("gebaar gehaald", met de score) gaat naar de server.

#### Bewaartermijnen

| Gegevens | Bewaartermijn |
| --- | --- |
| Leerlingaccount en voortgang | Tot de docent de leerling verwijdert, uiterlijk 90 dagen na het einde van de licentie |
| Docentaccount | Tot het account verwijderd wordt; de toegang tot de school vervalt 90 dagen na het einde van de licentie |
| Schoolgegevens en licentie | 7 jaar na het einde van de licentie (fiscale bewaarplicht facturatie) |
| Crashrapporten | 12 maanden |

Na verwijdering zijn de gegevens direct uit de database weg. In back-ups blijven ze bestaan tot die back-up verloopt.

#### Subverwerkers en locatie

| Subverwerker | Wat | Locatie |
| --- | --- | --- |
| Supabase Inc. | Database, inlogsysteem en opslag | Servers in de EU: Frankfurt, Duitsland. Supabase is een Amerikaans bedrijf; doorgifte is afgedekt met de EU-standaardcontractbepalingen in de verwerkersovereenkomst van Supabase. |
| Google (Firebase Cloud Messaging) | Pushmeldingen, alleen voor docenten die dit aanzetten | Wereldwijd; niet gebruikt voor leerlingen |

De app wordt verspreid via de App Store (Apple) en Google Play. Die partijen ontvangen geen schoolgegevens van SignCoach.

#### Rechten van betrokkenen

Verzoeken om inzage, correctie of verwijdering lopen via de school. De docent kan een leerling en alle gegevens zelf direct verwijderen in de app. Voor andere verzoeken helpt SignCoach de school binnen 10 werkdagen.
