---
title: Beveiligingsbijlage
sub: Bijlage 2
order: 3
lead: De gegevens staan versleuteld in een EU-datacenter, en elke rij in de database is afgeschermd zodat een gebruiker alleen ziet waar hij recht op heeft.
status: concept
datum: 26 oktober 2026
---

#### Technische maatregelen

| Onderwerp | Maatregel |
| --- | --- |
| Versleuteling onderweg | Al het verkeer tussen app en server loopt via HTTPS (TLS 1.2 of hoger) |
| Versleuteling opgeslagen | De database en opslag van Supabase zijn versleuteld met AES-256 |
| Toegang per rij | Row Level Security op alle tabellen: een leerling ziet alleen zichzelf, een docent alleen de leerlingen van de eigen klassen, een schoolbeheerder alleen de eigen school |
| Gevoelige acties | Leerlingen aanmaken, pincodes resetten en verwijderen lopen via serverfuncties die eerst controleren of de aanvrager docent van die school is |
| Pincodes | Inloggen controleert een hash. Daarnaast staat de pincode leesbaar opgeslagen, alleen op te vragen door docenten van die school (bewuste keuze: een pincode geeft alleen toegang tot de leerapp, er zijn geen beelden of gevoelige gegevens achter). Na 5 mislukte pogingen is inloggen 15 minuten geblokkeerd |
| Gedeelde tablets | Leerlingen worden na 10 minuten op de achtergrond automatisch uitgelogd |
| Wachtwoorden docenten | Beheerd door Supabase Auth, opgeslagen met bcrypt |
| Rollen | Een gebruiker kan zijn eigen rol niet wijzigen; dat wordt in de database afgedwongen |
| Camera | Herkenning op het apparaat; geen beelden naar de server |
| Crashrapporten | Anoniem: geen gebruikers-ID; e-mailadressen, ID's en tokens worden in de app verwijderd voor verzending |
| Sleutels | De app bevat alleen de publieke sleutel van Supabase; de beheersleutel staat alleen in serverfuncties |

#### Organisatorische maatregelen

- Alleen de leverancier (1 persoon) heeft beheertoegang tot de database.
- Vakmensen die gebaren opnemen hebben geen toegang tot leerlinggegevens.
- Elke database-wijziging staat als script in versiebeheer (privé GitHub-repository) en wordt eerst gecontroleerd.
- Gegevens van leerlingen worden niet gebruikt voor testen; daarvoor zijn aparte testaccounts.

#### Datalekken

1. SignCoach meldt een (vermoedelijk) datalek binnen 24 uur na ontdekking aan de contactpersoon van de school, met wat er bekend is: welke gegevens, hoeveel leerlingen, oorzaak en genomen maatregelen.
2. De school beslist of het lek gemeld moet worden bij de Autoriteit Persoonsgegevens (binnen 72 uur) en aan ouders.
3. SignCoach dicht het lek, vult de melding aan zodra er meer bekend is, en legt elk incident vast in een register.

#### Controle

De school mag eenmaal per jaar vragen hoe de maatregelen werken. SignCoach beantwoordt dat schriftelijk. Een externe audit of certificering is er nog niet.
