# Architektur-Entscheidungen: Portfolio-Webanwendung (CMS/CRM/Shop)

Stand: 11.08.2026

Projektkontext und funktionale Anforderungen: siehe `anforderungen.md`. Zeitplan: siehe `phasenplan.md`.

## 1. Tech-Stack-Entscheidung

Ursprünglich war eine Oracle-Cloud-VM mit k3s als Infrastruktur-Fundament geplant. Phase 0 (siehe `phasenplan.md`) ergab, dass sich im Oracle Free Tier keine VM-Instanz erstellen ließ – daher der Pivot auf den unten stehenden Stack ohne eigene VM.

| Ebene | Wahl | Begründung |
|---|---|---|
| Frontend | React + TypeScript (Vite), Tailwind, gehostet auf Vercel | bestehender Stack, kein SSR nötig; Vercel deployt automatisch aus dem Git-Repo |
| Backend | Spring Boot (Java), Spring Security + JWT, gehostet auf Render (Docker-Deploy aus `backend/Dockerfile`) | CV-relevanter Kernstack; Render deployt automatisch aus dem Git-Repo, keine eigene VM/kein k3s nötig |
| Datenbank | PostgreSQL, gehostet bei Neon | kostenlos im Free Tier, kein Selbstbetrieb (StatefulSet/PVC) mehr nötig |
| Object Storage | Oracle Cloud Object Storage (`app.storage.provider=oracle`, `OracleCloudFileStorageService`, S3-kompatibel über das AWS SDK) für Uploads, produktiv angebunden. Lokal weiterhin `LocalFileStorageService` (`app.storage.provider=local`), ausgeliefert über den Vercel-Rewrite `/uploads/*` → Render | Oracle Object Storage ist ein eigenständiger Free-Tier-Dienst, unabhängig von der an der VM gescheiterten Compute-Seite; löst den vorherigen Übergangszustand ab, bei dem Uploads über Redeploys hinweg nicht dauerhaft waren |
| CI/CD | GitHub Actions → Build & Test bei Push/PR; Deployment automatisch über die native GitHub-Integration von Render und Vercel bei Push auf `main` | Automatisierung ohne eigenen Deploy-Job/Kubernetes-Secrets |
| E-Mail/Newsletter | Brevo SMTP-Relay (Free: 300 E-Mails/Tag, unbegrenzte gespeicherte Kontakte) über Port 2525, lokal MailHog | Versand über `spring-boot-starter-mail`/`JavaMailSender` – Backend-Code bleibt identisch, nur Host/Port/Credentials unterscheiden sich zwischen lokal und produktiv; produktiv auf Port 2525 statt 587/465, da Render auf Free-Tier-Web-Services ausgehenden Traffic auf Port 25/465/587 blockt; Absender über Brevo-Single-Sender-Verifizierung, keine eigene Domain nötig |
| DNS | Cloudflare (Free) | **nicht umgesetzt** – aktuell keine eigene Domain, es wird mit den Standard-Subdomains von Vercel/Render gearbeitet; optional für später |
| Domain | separat zu registrieren | **nicht umgesetzt** – optionale Kostenposition (~10–15 €/Jahr) für später |

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
- **Konfiguration/Secrets:** DB-Connection-String (Neon), JWT-Secret, Mail-Zugangsdaten (Brevo, produktiv, Port 2525) sowie `SITE_BASE_URL` und Oracle-Object-Storage-Zugangsdaten als Environment-Variablen im Render-Dashboard hinterlegt, nicht im Repo
