# Architektur-Entscheidungen: Portfolio-Webanwendung (CMS/CRM/Shop)

Stand: 15.07.2026

Projektkontext und funktionale Anforderungen: siehe `anforderungen.md`. Zeitplan: siehe `phasenplan.md`.

## 1. Tech-Stack-Entscheidung

| Ebene | Wahl | Begründung |
|---|---|---|
| Frontend | React + TypeScript (Vite), Tailwind | bestehender Stack, kein SSR nötig |
| Backend | Spring Boot (Java), Spring Security + JWT | CV-relevanter Kernstack |
| Datenbank | PostgreSQL, selbst gehostet im Cluster (StatefulSet + PVC) | kostenlos, zeigt DB-Ops-Kenntnisse |
| Object Storage | MinIO, selbst gehostet im Cluster | kein externer Dienst nötig, zusätzliche K8s-Lernkurve |
| Infrastruktur | k3s (leichtgewichtiges Kubernetes) auf Oracle-Cloud-„Always-Free“-ARM-VM | kostenlos, echtes K8s statt nur „docker run“ |
| Ingress/TLS | Traefik (in k3s enthalten) + cert-manager + Let's Encrypt | kostenloses, automatisch erneuertes TLS |
| Registry | GitHub Container Registry (GHCR) | kostenlos |
| CI/CD | GitHub Actions → Build & Push Images → Deploy auf k3s | Automatisierung, GitOps-fähig |
| E-Mail/Newsletter | Brevo SMTP-Relay (Free: 300 E-Mails/Tag, unbegrenzte gespeicherte Kontakte), lokal MailHog | Versand über `spring-boot-starter-mail`/`JavaMailSender` – Backend-Code bleibt identisch, nur Host/Port/Credentials unterscheiden sich zwischen lokal und produktiv |
| DNS | Cloudflare (Free) | Domain zeigt auf VM-IP, DDoS-Schutz gratis inklusive |
| Domain | separat zu registrieren | einzige geplante Kostenposition (~10–15 €/Jahr) |

**Geplante Gesamtkosten:** 0 €/Monat für Infrastruktur, nur Domain-Registrierung.

## 2. Repository- & Projektstruktur

- **Monorepo** (statt Multi-Repo) – einfacher für Solo-Portfolio-Projekt
- Root-Infra-Ordner heißt bewusst `/infra` statt `/k8s`, da mit der Zwei-Backend-Strategie (siehe Abschnitt 3) zwei Infrastruktur-Welten koexistieren
```
/frontend
/backend            ← nur Spring Boot (Firebase ist BaaS, hat keinen eigenen App-Server)
/infra
  /k8s              ← Manifeste für die Spring/k3s-Variante (Deployments, Services, Ingress, ...)
  /firebase         ← firebase.json, firestore.rules, storage.rules, .firebaserc
```
- Die „Firebase-Seite" der Anwendung lebt primär im Frontend-Adapter (`frontend/src/api/firebaseAdapter/`) plus den Konfig-/Regeldateien in `/infra/firebase`

## 3. Zwei-Backend-Strategie (Lernzweck)

Zusätzlich zur Haupt-Implementierung (Spring Boot + k3s) soll als Vergleich eine **zweite, komplett separate Backend-Anbindung mit Firebase** (Spark-Plan, kostenlos) umgesetzt werden. Beide sollen unabhängig voneinander an dasselbe Frontend gekoppelt werden können.

**Architekturansatz:** Adapter-/Repository-Pattern im Frontend
```
frontend/src/api/
  contracts.ts        ← gemeinsame TS-Interfaces (Article, Product, User, CartItem, ...)
  springAdapter/       ← Implementierung gegen Spring-Boot-REST-API
  firebaseAdapter/      ← Implementierung gegen Firebase SDK
  index.ts             ← Auswahl per ENV-Variable (VITE_BACKEND=spring|firebase)
```

**Bekannte Herausforderungen:**
- Auth-Mechanismen unterscheiden sich stark (Spring Security/JWT vs. Firebase Auth/Custom Claims) – komplexester Teil der Adapter
- Datenmodell: relational (Postgres) vs. dokumentbasiert (Firestore) – kein 1:1-Mapping möglich
- Bild-Uploads: MinIO vs. Firebase Storage – zwei Implementierungen desselben Interfaces
- Newsletter/Brevo bleibt in beiden Varianten identisch (externer Service, backend-unabhängig)

## 4. Deployment-Details

- **CI (GitHub Actions):** Build & Test bei Push/PR auf `main` (Maven-Build Backend, `npm run build` Frontend)
- **Image-Build:** Docker-Images für Backend (Spring Boot Jar) und Frontend (statisches Vite-Build hinter Nginx) via `docker build`
- **Registry:** Push nach GitHub Container Registry (GHCR), getaggt mit Git-SHA und `latest`
- **CD:** GitHub Actions verbindet sich per SSH/kubeconfig auf die k3s-VM und wendet Manifeste aus `/infra/k8s` an (`kubectl apply` bzw. später `kubectl rollout restart` für neue Images)
- **Manifeste:** Deployment + Service pro Komponente (Backend, Frontend, Postgres als StatefulSet, MinIO), Ingress-Ressource für Traefik mit TLS über cert-manager/Let's Encrypt
- **Secrets:** DB-Zugangsdaten, JWT-Secret, MinIO-Keys, Brevo-SMTP-Zugangsdaten (Login + SMTP-Key, nicht der REST-API-Key) als Kubernetes-Secrets, nicht im Repo
- **Ausbaustufe (später, Phase 6):** Wechsel auf GitOps (ArgoCD) statt direktem `kubectl apply` aus der Pipeline
