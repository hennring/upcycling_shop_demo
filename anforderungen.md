# Projektkontext & Anforderungen: Portfolio-Webanwendung (CMS/CRM/Shop)

Stand: 15.07.2026

## 1. Projektkontext

- **Art des Projekts:** Portfolio-/Lernprojekt (kein realer Kunde)
- **Ziel:** Fullstack-Anwendung für Bewerbungen zeigen, inkl. Kubernetes-/Ops-Skills
- **Ops-Bereitschaft:** Hoch – bewusst Server/Kubernetes selbst betreiben statt alles managed
- **Erwarteter Traffic:** Sehr gering (paar Dutzend Besucher, privates Umfeld)
- **Hartes Budget-Limit:** max. 2 €/Monat bzw. 24 €/Jahr (Domain ausgenommen)

## 2. Funktionale Anforderungen

### Öffentlicher Bereich
- Landing Page (Hero, Services, Über uns)
- Dynamischer News-Feed aus der Datenbank (CMS)
- Shop-Bereich: Produktübersicht, Detailansicht, Warenkorb – **ohne** Zahlungsabwicklung (endet am „Kauf“-Button)
- User-Login/Registrierung
- Newsletter-Anmeldeformular (CRM)

### Admin-Bereich (`/admin`)
- Geschützter Bereich, nur nach Login erreichbar (Protected Routes)
- Basis-Statistiken (z. B. Abonnentenzahl)
- Blogartikel erstellen/löschen inkl. Bild-Upload (CMS)
- Newsletter verfassen und an Abonnenten versenden (CRM)
