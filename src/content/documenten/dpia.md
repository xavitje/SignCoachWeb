---
title: DPIA-opzet
sub: Voorzet voor de school
order: 4
lead: Na de maatregelen is het restrisico laag. Er gaan geen camerabeelden naar de server en per leerling worden alleen een voornaam en de voortgang bewaard. Dit is een voorzet; de school vult de DPIA aan en stelt hem vast.
status: concept
datum: 26 oktober 2026
---

#### Waarom een DPIA

De app gebruikt de camera bij kinderen en verwerkt gegevens van een kwetsbare groep. Dat zijn twee criteria van de Autoriteit Persoonsgegevens waarbij een DPIA verplicht kan zijn. Ook als de school concludeert dat het niet verplicht is, laat een DPIA zien dat de afweging zorgvuldig is gemaakt.

#### Beschrijving van de verwerking

- **Doel:** leerlingen leren gebarentaal; de docent volgt de voortgang.
- **Betrokkenen:** leerlingen (minderjarigen), docenten, schoolbeheerders.
- **Gegevens:** zie bijlage 1. Geen bijzondere persoonsgegevens; de camerabeelden worden niet opgeslagen of verstuurd.
- **Grondslag:** te bepalen door de school.
- **Ontvangers:** de docent van de klas, de schoolbeheerder, SignCoach als verwerker, Supabase als subverwerker.

#### Noodzaak en evenredigheid

- **Dataminimalisatie:** geen e-mailadres, achternaam of geboortedatum van leerlingen; een bijnaam mag ook.
- **Alternatief voor de camera:** lessen zonder herkenning werken met een zelfcheck ("Gelukt" of "Nog eens"). Wil een school of ouder geen camera, dan zet de docent de camera voor die leerling uit; de leerling doet dan elke les met de zelfcheck.
- **Bewaartermijn:** kort en automatisch, zie bijlage 1.
- **Transparantie:** het privacybeleid staat in de app, met een apart stuk voor leerlingen via school.

#### Risico's en maatregelen

| Risico | Kans | Impact | Maatregel | Restrisico |
| --- | --- | --- | --- | --- |
| Camerabeelden van kinderen lekken | Zeer klein | Hoog | Herkenning op het apparaat; geen beelden naar de server | Laag |
| Een andere leerling logt in met iemands pincode | Middel | Laag | 5 pogingen, dan 15 minuten blokkade; docent kan pincode resetten | Laag |
| Op een gedeelde tablet blijft de vorige leerling ingelogd | Middel | Laag | Automatisch uitloggen na 10 minuten op de achtergrond; uitlogknop in Profiel | Laag |
| Een docent ziet leerlingen van een andere klas | Klein | Middel | Row Level Security; controle in elke serverfunctie | Laag |
| Gegevens worden langer bewaard dan nodig | Klein | Middel | Automatisch wissen 90 dagen na einde licentie; docent kan direct verwijderen | Laag |
| Doorgifte buiten de EU via Supabase (Amerikaans bedrijf) | Klein | Middel | Servers in Frankfurt; standaardcontractbepalingen | Laag |
| Druk of vergelijking tussen leerlingen door scores en XP | Klein | Laag | Geen ranglijst tussen leerlingen; voortgang alleen zichtbaar voor de leerling zelf en de docent | Laag |
| Gegevens gebruikt voor iets anders dan leren | Zeer klein | Middel | Vastgelegd in de verwerkersovereenkomst; geen reclame of analyse-diensten in de app | Laag |

#### Conclusie

Met deze maatregelen is het restrisico voor leerlingen laag. Het ingelogd blijven op gedeelde tablets is opgelost met automatisch uitloggen.
