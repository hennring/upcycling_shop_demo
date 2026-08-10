# Architektur-Entscheidungen: Portfolio-Webanwendung (CMS/CRM/Shop)

Stand: 10.08.2026

Projektkontext und funktionale Anforderungen: siehe `anforderungen.md`. Zeitplan: siehe `phasenplan.md`.

## 1. Tech-Stack-Entscheidung

Ursprünglich war eine Oracle-Cloud-VM mit k3s als Infrastruktur-Fundament geplant. Phase 0 (siehe `phasenplan.md`) ergab, dass sich im Oracle Free Tier keine VM-Instanz erstellen ließ – daher der Pivot auf den unten stehenden Stack ohne eigene VM.

| Ebene | Wahl | Begründung |
|---|---|---|
| Frontend | React + TypeScript (Vite), Tailwind, gehostet auf Vercel | bestehender Stack, kein SSR nötig; Vercel deployt automatisch aus dem Git-Repo |
| Backend | Spring Boot (Java), Spring Security + JWT, gehostet auf Render (Docker-Deploy aus `backend/Dockerfile`) | CV-relevanter Kernstack; Render deployt automatisch aus dem Git-Repo, keine eigene VM/kein k3s nötig |
| Datenbank | PostgreSQL, gehostet bei Neon | kostenlos im Free Tier, kein Selbstbetrieb (StatefulSet/PVC) mehr nötig |
| Object Storage | Aktuell: lokales Dateisystem im Render-Backend-Container (`LocalFileStorageService`, `app.storage.provider=local`), ausgeliefert über den Vercel-Rewrite `/uploads/*` → Render. Geplante Ablösung: Oracle Cloud Object Storage (`app.storage.provider=oracle`, siehe `phasenplan.md`, Phase 7) | lokales Dateisystem ist der pragmatische Übergangszustand für den produktiven Betrieb, gilt aber über Redeploys hinweg nicht als dauerhaft; Oracle Object Storage ist ein eigenständiger Free-Tier-Dienst, unabhängig von der an der VM gescheiterten Compute-Seite |
| CI/CD | GitHub Actions → Build & Test bei Push/PR; Deployment automatisch über die native GitHub-Integration von Render und Vercel bei Push auf `main` | Automatisierung ohne eigenen Deploy-Job/Kubernetes-Secrets |
| E-Mail/Newsletter | Brevo SMTP-Relay (Free: 300 E-Mails/Tag, unbegrenzte gespeicherte Kontakte), lokal MailHog | Versand über `spring-boot-starter-mail`/`JavaMailSender` – Backend-Code bleibt identisch, nur Host/Port/Credentials unterscheiden sich zwischen lokal und produktiv; in Render produktiv angebunden |
| DNS | Cloudflare (Free) | **nicht umgesetzt** – aktuell keine eigene Domain, es wird mit den Standard-Subdomains von Vercel/Render gearbeitet; optional für später |
| Domain | separat zu registrieren | **nicht umgesetzt** – optionale Kostenposition (~10–15 €/Jahr) für später, siehe `phasenplan.md`, Offene Prüfpunkte (GitHub Student Developer Pack) |

**Geplante Gesamtkosten:** 0 €/Monat auf den Free Tiers von Vercel, Render und Neon; keine Domain-Kosten, solange keine eigene Domain angeschafft wird.

## 2. Repository- & Projektstruktur

- **Monorepo** (statt Multi-Repo) – einfacher für Solo-Portfolio-Projekt
```
/frontend           ← React/Vite, inkl. vercel.json für Rewrites/SPA-Fallback
/backend            ← Spring Boot, Docker-Deploy auf Render
```

## 3. Deployment-Details

- **CI (GitHub Actions):** Build & Test bei Push/PR auf `main` (Maven-Build Backend, `npm run build` Frontend)
- **CD:** kein eigener Deploy-Job mehr in der Pipeline – Render (Backend, Docker-Build aus `backend/Dockerfile`) und Vercel (Frontend, statisches Vite-Build) sind direkt an das GitHub-Repo angebunden und deployen automatisch bei jedem Push auf `main`
- **Routing:** `frontend/vercel.json` proxied `/api/:path*` und `/uploads/:path*` auf den Render-Backend-Service und liefert für alle übrigen Pfade `index.html` aus (SPA-Fallback). Da Vercel damit Frontend- und Backend-Requests aus Browsersicht same-origin macht, bleibt CORS effektiv ungenutzt (`app.cors.allowed-origins`, Default nur `localhost`)
- **Konfiguration/Secrets:** DB-Connection-String (Neon), JWT-Secret, Mail-Zugangsdaten (Brevo, produktiv) sowie `SITE_BASE_URL` als Environment-Variablen im Render-Dashboard hinterlegt, nicht im Repo
- **Objekt-Storage-Ausbaustufe (später, Phase 7 in `phasenplan.md`):** Wechsel vom aktuell lokalen Dateisystem im Render-Container auf Oracle Cloud Object Storage
