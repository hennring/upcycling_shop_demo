# Phasenplan: Portfolio-Webanwendung (CMS/CRM/Shop)

Stand: 15.07.2026

## Phasen

- **Phase 0** – Infrastruktur-Fundament (Oracle-VM, Domain/DNS, k3s, Traefik/cert-manager, Repo-Struktur)
- **Phase 1** – Backend-Skelett (Spring Boot Module: auth, blog, newsletter, shop; DB-Schema)
- **Phase 2** – CI/CD & Erst-Deployment (siehe Deployment-Details in `architektur-entscheidungen.md`) – Pipeline früh etablieren, bevor weitere Features entstehen
- **Phase 3** – Frontend öffentlicher Bereich (Landing Page, News-Feed, Shop, Login/Registrierung, Newsletter-Formular)
- **Phase 4** – Admin Dashboard mit Protected Routes, und Basis-Statistiken (z. B. Abonnentenzahl)
- **Phase 5** – Verwaltung (CMS & CRM): Artikel erstellen/löschen inkl. Bild-Upload, Newsletter-Editor & -Versand an Abonnenten
- **Phase 6** – Optional/Stretch: HPA, Prometheus/Grafana, Helm-Chart, zweiter k3s-Node
- **Phase 7** – Firebase-Adapter als zweite Backend-Implementierung (siehe Abschnitt „Zwei-Backend-Strategie" in `architektur-entscheidungen.md`)

## Offene Prüfpunkte

- **GitHub Student Developer Pack:** prüfen, ob Henning aktuell (Bildungsgutschein-Kurs) als Student zählt – ggf. kostenloser Domain-Gutschein und Cloud-Credits nutzbar.
- **Oracle-Cloud-Risiko:** Free-Tier-Limits wurden im Juni 2026 für reine Free-Tier-Accounts auf 2 OCPU/12 GB halbiert; Pay-as-you-go-Accounts (Kreditkarte hinterlegt, aber innerhalb Free-Grenzen) behalten 4 OCPU/24 GB. Zudem gibt es 2026 strengere/uneinheitliche Account-Freigaben. Empfehlung: Account früh anlegen, PAYG-Modus wählen, Fallback im Hinterkopf behalten (z. B. Hetzner ~4 €/Monat, leicht über Budget).
