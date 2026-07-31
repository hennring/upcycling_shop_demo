# Phasenplan: Portfolio-Webanwendung (CMS/CRM/Shop)

Stand: 15.07.2026

## Phasen

- **Phase 0** – Infrastruktur-Fundament (Oracle-VM, Domain/DNS, k3s, Traefik/cert-manager, Repo-Struktur)
- **Phase 1** – Backend-Skelett (Spring Boot Module: auth, blog, newsletter, shop; DB-Schema) – **abgeschlossen**
  - Module: `auth` (Registrierung/Login/JWT, ADMIN-Bootstrap), `blog` (CMS-CRUD + öffentlicher Feed), `newsletter` (Opt-in, Token-Opt-out, Abonnentenzahl), `shop` (Produktkatalog, serverseitiger Warenkorb, kein Checkout)
  - Tabellen: `app_user`, `blog_article`, `subscriber`, `product`, `cart_item` (aus den Entities generiert)
  - Öffentlich: `GET /api/blog/**`, `GET /api/products/**`, `POST /api/newsletter/{subscribe,unsubscribe}`, `POST /api/auth/{register,login}`; alles unter `/api/admin/**` nur mit Rolle ADMIN
- **Phase 2** – CI/CD & Erst-Deployment (siehe Deployment-Details in `architektur-entscheidungen.md`) – Pipeline früh etablieren, bevor weitere Features entstehen – **CI abgeschlossen, Deployment offen (wartet auf die VM aus Phase 0)**
  - Pipeline (`.github/workflows/ci.yml`), Stufen laufen der Reihe nach: `backend-build-test` (`mvnw verify`) und `frontend-build-test` (`oxlint` + `tsc` + `vite build`) → `smoke-test` → `images`
  - `smoke-test` startet den kompletten Stack aus `docker-compose.yml` (nginx → Spring Boot → **echtes Postgres**) und prüft: Frontend liefert die App, `/actuator/health` ist UP, öffentlicher Blog-/Produkt-Feed antwortet, `/api/cart` gibt anonym 401, Registrierung + Login + `/api/auth/me` funktionieren durch den nginx-Proxy
  - `images` baut Backend und Frontend für `linux/amd64` **und `linux/arm64`** (die Oracle-VM ist ARM) und pusht bei Push auf `main` nach GHCR, getaggt mit Git-SHA und `latest`; auf Pull Requests wird nur gebaut, nicht gepusht
  - Der Maven-/npm-Build läuft dank `FROM --platform=$BUILDPLATFORM` nativ, nur die Runtime-Stage wird pro Architektur gebaut – kein QEMU, keine langen Build-Zeiten
  - Lokal identisch startbar: `docker compose up --build` → App auf http://localhost:8080, API direkt auf http://localhost:8081
  - Deployment-Schritt bewusst noch nicht enthalten: der `deploy`-Job ist als TODO am Ende der Pipeline beschrieben (`kubectl apply -f infra/k8s/` + `kubectl set image ...:<SHA>` über ein `KUBECONFIG`-Secret), `infra/k8s` ist noch leer
- **Phase 3** – Frontend öffentlicher Bereich (Landing Page, News-Feed, Shop, Login/Registrierung, Newsletter-Formular)
- **Phase 4** – Admin Dashboard mit Protected Routes, und Basis-Statistiken (z. B. Abonnentenzahl)
- **Phase 5** – Verwaltung (CMS & CRM): Artikel erstellen/löschen inkl. Bild-Upload, Newsletter-Editor & -Versand an Abonnenten
- **Phase 6** – Optional/Stretch: HPA, Prometheus/Grafana, Helm-Chart, zweiter k3s-Node
- **Phase 7** – Firebase-Adapter als zweite Backend-Implementierung (siehe Abschnitt „Zwei-Backend-Strategie" in `architektur-entscheidungen.md`)

## Offene Prüfpunkte

- **Schema-Verwaltung (offen, vor dem Erst-Deployment):** Das Schema entsteht derzeit über `spring.jpa.hibernate.ddl-auto=update`. Der `smoke-test`-Job der Pipeline prüft inzwischen zwar gegen echtes Postgres statt H2, ändert an der Grundproblematik aber nichts: Das reicht für die Entwicklung, fügt aber nur hinzu – Spalten werden nie umbenannt, verkleinert oder gelöscht, und Constraints/Indizes aus früheren Läufen bleiben stehen. Vor dem ersten Deployment auf die echte Postgres-Instanz sollte entweder auf Migrationen (Flyway) umgestellt oder `ddl-auto=validate` plus manuell gepflegtes Schema gewählt werden.

- **GitHub Student Developer Pack:** prüfen, ob Henning aktuell (Bildungsgutschein-Kurs) als Student zählt – ggf. kostenloser Domain-Gutschein und Cloud-Credits nutzbar.
- **Oracle-Cloud-Risiko:** Free-Tier-Limits wurden im Juni 2026 für reine Free-Tier-Accounts auf 2 OCPU/12 GB halbiert; Pay-as-you-go-Accounts (Kreditkarte hinterlegt, aber innerhalb Free-Grenzen) behalten 4 OCPU/24 GB. Zudem gibt es 2026 strengere/uneinheitliche Account-Freigaben. Empfehlung: Account früh anlegen, PAYG-Modus wählen, Fallback im Hinterkopf behalten (z. B. Hetzner ~4 €/Monat, leicht über Budget).
