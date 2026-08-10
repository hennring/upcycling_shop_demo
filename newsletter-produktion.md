# Newsletter-Versand produktionsreif machen (Render/Vercel)

## Kontext

Backend läuft auf Render, Frontend auf Vercel, beide kommunizieren erfolgreich. Für den Newsletter-Versand wird lokal MailHog genutzt (`docker-compose.yml:27-30`), das SMTP-Mails nur abfängt und in einer Web-UI anzeigt (`http://localhost:8025`) - es leitet **nie** an echte Postfächer weiter. MailHog als eigenständigen Render-Service zu deployen würde daran nichts ändern: Newsletter würden weiterhin nirgends ankommen, es wäre nur ein zusätzlicher, dauerhaft laufender (kostenpflichtiger) Service ohne Nutzen.

Das Architekturdokument (`architektur-entscheidungen.md`, Abschnitt "E-Mail/Newsletter") sieht dafür bereits **Brevo** vor (kostenloses Tier: 300 E-Mails/Tag, unbegrenzte gespeicherte Kontakte) - genau der Zweck von Produktions-Mailversand. Ein Brevo-Account existiert bereits, die Absender-Domain ist aber noch nicht per SPF/DKIM verifiziert. Ziel dieses Plans: Brevo als SMTP-Relay in Produktion anschließen, ohne Code-Änderungen, nur über Konfiguration.

## Warum keine Code-Änderungen nötig sind

`NewsletterMailService.java` verwendet Spring Boots `JavaMailSender`, komplett generisch über `spring.mail.*`-Properties (`application.properties:49-61`). Host, Port, Zugangsdaten, Auth und TLS werden ausschließlich über Umgebungsvariablen gesteuert:

| Env-Var | Aktueller Default (lokal/MailHog) | Produktionswert (Brevo) |
|---|---|---|
| `MAIL_HOST` | `localhost` | `smtp-relay.brevo.com` |
| `MAIL_PORT` | `1025` | `587` |
| `MAIL_USERNAME` | leer | Brevo SMTP-Login (aus Account, nicht die Absender-Adresse selbst) |
| `MAIL_PASSWORD` | leer | Brevo **SMTP-Key** (SMTP & API → SMTP, nicht der REST-API-Key!) |
| `MAIL_SMTP_AUTH` | `false` | `true` |
| `MAIL_SMTP_STARTTLS` | `false` | `true` |
| `MAIL_FROM` | `newsletter@example.com` | verifizierte Absenderadresse (z. B. `newsletter@eure-domain.de`) |
| `SITE_BASE_URL` | `http://localhost:5173` | die echte Vercel-Frontend-URL (für Artikel-Links in der Mail) |

Das deckt sich exakt mit dem Kommentar in `application.properties:49-51`, der genau dieses Setup bereits antizipiert.

## Schritte

### 1. Absender-Domain in Brevo verifizieren
- In Brevo unter **Settings → Senders & IP → Domains** die eigene Domain hinzufügen.
- Die von Brevo angezeigten DNS-Einträge (SPF-TXT-Record, DKIM-TXT-Record, ggf. DMARC) beim Domain-Registrar/DNS-Provider eintragen.
- Warten bis Brevo die Domain als "verifiziert" markiert (kann bis zu einigen Stunden dauern, je nach DNS-Propagation).
- Erst danach unter **Senders** die konkrete Absenderadresse (z. B. `newsletter@eure-domain.de`) anlegen/verifizieren - ohne verifizierte Domain landen Mails sonst zuverlässig im Spam oder werden von Empfänger-Servern abgelehnt.

### 2. SMTP-Zugangsdaten holen
- In Brevo unter **SMTP & API → SMTP** den SMTP-Login (meist die Account-E-Mail) und den SMTP-Key kopieren (**nicht** den REST-API-Key - der funktioniert nicht für SMTP-Auth).

### 3. Environment-Variablen in Render setzen
Im Render-Dashboard beim Backend-Service unter **Environment**:
```
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=<Brevo SMTP-Login>
MAIL_PASSWORD=<Brevo SMTP-Key>
MAIL_SMTP_AUTH=true
MAIL_SMTP_STARTTLS=true
MAIL_FROM=<verifizierte Absenderadresse>
SITE_BASE_URL=<echte Vercel-URL, z. B. https://euer-projekt.vercel.app>
```
Als "Secret"/verschlüsselte Env-Vars markieren, wo Render das anbietet (insbesondere `MAIL_PASSWORD`). Nach dem Speichern redeployt Render den Service automatisch.

### 4. Verifizieren
- Render-Logs nach dem Deploy prüfen (kein Fehler beim Start, `management.health.mail.enabled=false` heißt aber: Verbindungsprobleme zeigen sich erst beim tatsächlichen Versand, nicht im Health-Check).
- Über die Admin-Oberfläche einen Test-Newsletter an eine echte, selbst kontrollierte Adresse senden.
- Prüfen: Mail kommt an (auch Spam-Ordner checken), Absenderadresse stimmt, im Newsletter verlinkter Artikel-Link zeigt korrekt auf die Vercel-URL.
- Bei Zustellproblemen: Brevo-Dashboard unter **Statistics/Logs** prüfen, ob Brevo die Mail überhaupt angenommen hat (Auth-Fehler vs. Zustellproblem lassen sich dort unterscheiden).

### 5. Aufräumen (optional)
- `docker-compose.yml` unverändert lassen - MailHog bleibt sinnvoll für lokale Entwicklung (Mails abfangen statt versehentlich echte Adressen anzuschreiben).
- Ggf. `architektur-entscheidungen.md` mit einem Hinweis ergänzen, dass Render/Vercel (statt der ursprünglich geplanten k3s/Oracle-VM) das tatsächliche Deployment-Ziel ist, und dass Brevo produktiv verdrahtet ist - rein optional, nur falls ihr das Dokument aktuell haltet.

## Nicht empfohlen: MailHog auf Render deployen
- MailHog ist ein reiner Test-Catcher, kein Relay - selbst mit öffentlicher URL würden Mails nie an echte Empfänger zugestellt.
- Zusätzlicher, dauerhaft laufender Service ohne funktionalen Nutzen (Render Free-Tier-Dienste schlafen zudem bei Inaktivität ein, was SMTP-Verbindungen beim Versand zusätzlich verzögern/blockieren würde).
