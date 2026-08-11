# Lokales Setup für Entwickler

Diese Anleitung beschreibt, wie du das Projekt lokal aufsetzt und ausführst. Es gibt zwei Wege:

- **Option A – Alles per Docker Compose** (schnellster Weg, kein lokales Java/Node/Postgres nötig)
- **Option B – Backend und Frontend einzeln starten** (besser zum Entwickeln, mit Hot-Reload)

## Voraussetzungen

| Tool | Für welche Option | Hinweis |
|---|---|---|
| Docker + Docker Compose | A, sowie Mailhog in Option B | https://docs.docker.com/get-docker/ |
| Java 17 + Maven | Option B (Backend) | Maven-Wrapper (`mvnw`/`mvnw.cmd`) ist im Repo enthalten, kein separates Maven-Setup nötig |
| Node.js (aktuelle LTS) + npm | Option B (Frontend) | |
| PostgreSQL 17 | Option B (Backend), außer du nutzt das `local`-Profil (H2) | Kann auch via Docker laufen |

---

## Option A: Alles per Docker Compose starten

Im Repo-Root liegt eine `docker-compose.yml`, die Frontend, Backend, PostgreSQL und Mailhog zusammen startet — dieselben Images wie in der CI.

```bash
docker compose up --build
```

Danach erreichbar:

- App (Frontend, proxied zum Backend): http://localhost:8080
- Backend-API direkt: http://localhost:8081
- Mailhog Web-UI (versendete Newsletter-Mails ansehen): http://localhost:8025

Standardmäßig wird beim Start automatisch ein Admin-Account angelegt (siehe unten), da `docker-compose.yml` dafür bereits Defaults setzt:

- E-Mail: `admin@example.com`
- Passwort: `admin-local-password`

Diese Defaults kannst du überschreiben, indem du vor dem Start eigene Umgebungsvariablen setzt, z. B.:

```bash
ADMIN_EMAIL=du@example.com ADMIN_PASSWORD=einSicheresPasswort docker compose up --build
```

Postgres und die Upload-Daten liegen in benannten Docker-Volumes (`db-data`, `uploads-data`) und bleiben zwischen Neustarts erhalten. Zum kompletten Zurücksetzen: `docker compose down -v`.

---

## Option B: Backend und Frontend einzeln starten

Nützlich für aktive Entwicklung mit Hot-Reload. Es braucht drei Dinge parallel: eine Datenbank, Mailhog (für Newsletter-Tests) und die beiden Apps.

### 1. Datenbank

Standardmäßig erwartet das Backend Postgres unter `localhost:5432`, Datenbank/User/Passwort `portfolio`/`portfolio`/`portfolio`. Am einfachsten per Docker, ohne den Rest des Compose-Stacks:

```bash
docker run -d --name portfolio-db -p 5432:5432 \
  -e POSTGRES_DB=portfolio -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio \
  postgres:17-alpine
```

**Alternative ohne Postgres:** Das Backend kann auch mit dem Spring-Profil `local` gestartet werden, das eine In-Memory-H2-Datenbank verwendet (kein Datenbank-Setup nötig, Daten gehen beim Stoppen verloren). Dabei werden zusätzlich automatisch Demo-Blogartikel eingefügt (`app.fixtures.enabled=true`). Siehe Schritt 3.

Das Schema wird beim Start automatisch von Hibernate erzeugt/aktualisiert (`ddl-auto=update`) — es gibt keine Migrationsskripte (Flyway/Liquibase), daher gibt es keinen separaten Migrationsschritt.

### 2. Mailhog (für lokalen Newsletter-Versand)

Damit das Backend E-Mails (z. B. Newsletter) lokal "versenden" kann, ohne echte Mails zu verschicken, brauchst du [Mailhog](https://github.com/mailhog/MailHog) als lokalen SMTP-Server. Am einfachsten per Docker:

```bash
docker run -d --name mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog:v1.0.1
```

- SMTP-Port `1025` — hierhin sendet das Backend Mails (Standardkonfiguration, siehe `application.properties`).
- Web-UI unter http://localhost:8025 — hier siehst du alle "versendeten" Mails (z. B. Newsletter), ohne dass irgendetwas an echte Empfänger geht.

Die Backend-Mail-Konfiguration liegt wie gewohnt in `backend/src/main/resources/application.properties`:

```properties
spring.mail.host=${MAIL_HOST:localhost}
spring.mail.port=${MAIL_PORT:1025}
app.mail.from=${MAIL_FROM:newsletter@example.com}
```

Die Defaults passen bereits zu einem lokal laufenden Mailhog — es sind keine Umgebungsvariablen nötig, solange Mailhog auf `localhost:1025` erreichbar ist.

### 3. Backend starten

Im Ordner `backend/`:

```bash
# Windows
mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```

Das Backend läuft danach auf **http://localhost:8080**.

**Wichtig – Admin-Account:** Beim Start prüft `AdminUserInitializer`, ob die Umgebungsvariablen `ADMIN_EMAIL` und `ADMIN_PASSWORD` gesetzt sind. Nur dann wird (sofern noch kein User mit dieser E-Mail existiert) ein initialer Admin-Account angelegt — die reguläre Registrierung erzeugt immer nur normale User, ohne diesen Bootstrap wäre der `/admin`-Bereich also nie erreichbar. Sind die Variablen leer/nicht gesetzt, startet die App trotzdem normal, nur eben ohne Admin-Account.

Setze die Variablen also vor dem Start, z. B.:

```bash
# Windows (PowerShell)
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="ein-sicheres-passwort"
mvnw.cmd spring-boot:run

# macOS/Linux
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=ein-sicheres-passwort ./mvnw spring-boot:run
```

**Ohne lokale Postgres-Installation** kannst du stattdessen das `local`-Profil nutzen (H2 In-Memory-DB, siehe oben):

```bash
# Windows (PowerShell)
$env:SPRING_PROFILES_ACTIVE="local"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_PASSWORD="ein-sicheres-passwort"
mvnw.cmd spring-boot:run
```

### 4. Frontend starten

Im Ordner `frontend/`:

```bash
npm install
npm run dev
```

Das Frontend läuft danach auf **http://localhost:5173** (Vite Dev-Server). API-Aufrufe an `/api/...` und `/uploads/...` werden automatisch zum Backend auf `localhost:8080` weitergeleitet (siehe `frontend/vite.config.ts`). Es sind keine Frontend-`.env`-Dateien nötig.

---

## Wichtige Umgebungsvariablen (Backend)

Alle Variablen haben Defaults in `backend/src/main/resources/application.properties` und müssen nur gesetzt werden, wenn du von den Defaults abweichen willst — mit Ausnahme von `ADMIN_EMAIL`/`ADMIN_PASSWORD`, die für einen nutzbaren Admin-Zugang zwingend gesetzt werden müssen.

| Variable | Default | Zweck |
|---|---|---|
| `ADMIN_EMAIL` | *(leer → kein Admin wird angelegt)* | E-Mail des initialen Admin-Accounts |
| `ADMIN_PASSWORD` | *(leer → kein Admin wird angelegt)* | Passwort des initialen Admin-Accounts |
| `DB_URL` | `jdbc:postgresql://localhost:5432/portfolio` | JDBC-URL der Datenbank |
| `DB_USERNAME` | `portfolio` | DB-Benutzername |
| `DB_PASSWORD` | `portfolio` | DB-Passwort |
| `JWT_SECRET` | Dev-Dummy-Secret | Signierschlüssel für JWTs — für echten Betrieb ändern |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Erlaubte Origin(s) für CORS |
| `FIXTURES_ENABLED` | `false` | Legt Demo-Blogartikel in einer leeren DB an |
| `MAIL_HOST` | `localhost` | SMTP-Host (Mailhog) |
| `MAIL_PORT` | `1025` | SMTP-Port (Mailhog) |
| `MAIL_FROM` | `newsletter@example.com` | Absenderadresse für Newsletter-Mails |
| `SITE_BASE_URL` | `http://localhost:5173` | Basis-URL fürs Bauen absoluter Links in Newsletter-Mails |
| `STORAGE_PROVIDER` | `local` | `local` (Dateisystem) |
| `STORAGE_LOCAL_BASE_PATH` | `uploads` | Verzeichnis für hochgeladene Dateien bei `STORAGE_PROVIDER=local` |

Für lokale Entwicklung reicht es, `STORAGE_PROVIDER` unverändert auf `local` zu lassen — hochgeladene Bilder landen dann in `backend/uploads/` und werden unter `http://localhost:8080/uploads/...` ausgeliefert. Die `oracle`-Variante (weitere Variablen `STORAGE_ORACLE_*`) ist nur für die Produktivumgebung relevant.

---

## Hintergrund & weiterführende Doku

Architektur- und Deployment-Entscheidungen (Vercel/Render/Neon-Setup, Mail-Provider für Produktion, etc.) sind in [`architektur-entscheidungen.md`](architektur-entscheidungen.md) und [`newsletter-produktion.md`](newsletter-produktion.md) dokumentiert.
