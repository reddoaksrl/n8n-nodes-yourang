# Analisi workflow n8n degli strategist yourang

> Report generato il 2026-06-23 analizzando l'istanza n8n di produzione
> (`automations.wolfoncloud.com`, account `info@yourang.ai`).
> Dataset: **399 workflow totali**, **313 analizzati a fondo** (nodi + connessioni + parametri).
> Obiettivo: capire integrazioni e pattern ricorrenti per ottimizzare il lavoro
> degli strategist tramite template e funzionalità native in yourang.

---

## 1. Executive summary

Gli strategist usano n8n essenzialmente come **layer di integrazione attorno all'agente
vocale yourang**. Quasi ogni cliente ha 1–3 workflow dedicati e il grosso del lavoro è
sempre lo stesso schema ricostruito a mano:

1. **L'agente vocale chiama un webhook n8n come "tool esterno"** (request/response) per
   leggere/scrivere su calendario, CRM o fogli, e risponde all'utente in tempo reale.
2. **Gestione appuntamenti su Google Calendar** (verifica disponibilità, crea/sposta).
3. **Campagne outbound**: lista contatti (Google Sheets) → richiamo automatico via yourang.
4. **Follow-up a tempo** (`wait` → nuova chiamata/azione).
5. **Notifiche lead/prenotazioni** via email/Gmail.
6. **Sync verso CRM** (RelatiaCRM, ActiveCampaign, Spoki/WhatsApp, GoHighLevel…).

Il 70-80% di questo lavoro è **ripetitivo, fragile e fatto con nodi `code` + `httpRequest`
grezzi**. È esattamente ciò che si può standardizzare con **template ufficiali** e
**integrazioni native nella piattaforma yourang**.

**Numeri chiave**
- Mediana 6 nodi/workflow, media 11.5, max 241 (alcuni "mostri" da rifattorizzare).
- Trigger dominante: **webhook** (229 workflow), con `respondToWebhook` (98) → pattern
  request/response = "external tool" dell'agente vocale.
- Logica custom: **148 workflow** usano nodi `code` JS → debito tecnico diffuso.
- 14 workflow vuoti (0 nodi).

---

## 2. Integrazioni più comuni

Combinando i tipi di credenziali, i tipi di nodo e gli hostname chiamati via HTTP grezzo:

| Servizio | Evidenza (cred / nodi / chiamate HTTP) | Nodo nativo n8n? | Note |
|---|---|---|---|
| **Google Calendar** | 253 credenziali, 54 wf | ✅ | Appuntamenti — l'integrazione #1 in assoluto |
| **yourang (API)** | 248 credenziali, nodo in 85 wf + 40 chiamate HTTP dirette | ✅ (custom) | 40 chiamate vanno ad `api.yourang.ai` via HTTP grezzo → endpoint non coperti dal nodo |
| **Google Sheets** | 140 credenziali, 55 wf | ✅ | Database leggero / liste contatti / log |
| **Email SMTP** | 101 credenziali, 69 wf | ✅ | Notifiche |
| **ActiveCampaign** | 84 credenziali + ~53 chiamate HTTP (`*.api-us1.com`) | ✅ | Email marketing/CRM; usato sia con nodo sia via HTTP |
| **RelatiaCRM** | ~250 chiamate HTTP (`*.relatiacrm.com`) | ❌ | **CRM italiano dominante, tutto via HTTP grezzo** |
| **Spoki (WhatsApp)** | ~115 chiamate HTTP (`api.spoki.com`) | ❌ | **WhatsApp automation, nessun nodo nativo** |
| **GoHighLevel / LeadConnector** | ~122 chiamate HTTP (`leadconnectorhq.com`, `gohighlevel.com`) | ❌ | CRM/funnel marketing |
| **Gmail** | 37 credenziali, 25 wf | ✅ | |
| **Pipedrive** | 16 HTTP + 6 credenziali | ✅ | |
| **Salesforce** | 5 credenziali + HTTP | ✅ | |
| **Facebook / Meta** | 14 HTTP + Lead Ads trigger | ✅ (parziale) | Lead ads / WhatsApp Cloud |
| **HubSpot, Teamleader, Odoo, Outlook, Discord** | code singole/basse | ✅ | Coda lunga CRM |
| **Gestionali verticali** | AlfaDocs (dentisti, 17), eBeautyFull (estetica, 8), Wansport (beach club, 20), OctoTable (ristoranti, 3), SIPortal (VoIP, 5), B4Web, Meraviglia/Wolf on Cloud (9) | ❌ | Integrazioni di settore, sempre via HTTP grezzo |
| **AI/LLM** | OpenAI (4 cred), Anthropic (3 HTTP), nodi LangChain (agent, informationExtractor, summarization) | ✅ | Adozione ancora bassa ma in crescita |

**Takeaway integrazioni**: i servizi **senza nodo nativo** ma ad altissima frequenza sono
**RelatiaCRM, Spoki (WhatsApp) e GoHighLevel**. Insieme valgono ~500 chiamate HTTP grezze.
Sono i candidati #1 a diventare integrazioni native (o nodi/credential dedicati).

---

## 3. Template pattern ricorrenti

Identificati clusterizzando le "firme" dei workflow (insiemi di tipi di nodo) e le coppie
di nodi adiacenti più frequenti.

### Pattern A — "External Tool" dell'agente vocale (il più diffuso)
`webhook` → `code` (parse payload chiamata) → `httpRequest`/`googleCalendar`/`yourang` →
`if`/`switch` → `respondToWebhook`
- Firme: `code,httpRequest,respondToWebhook,webhook` (10 wf), `emailSend,respondToWebhook,webhook` (9), `googleSheets,respondToWebhook,webhook` (8).
- Coppie: `webhook→code` (114), `code→respondToWebhook` (66), `if→respondToWebhook` (68).
- **Significato**: l'agente vocale interroga un sistema esterno in tempo reale e riceve la
  risposta da dire al cliente. È IL mattone fondamentale.

### Pattern B — Gestione appuntamenti (Google Calendar)
`switch` → `googleCalendar` (check/create/update) → `code` → `respondToWebhook`
- Coppie: `switch→googleCalendar` (144), `googleCalendar→code` (140), `if→googleCalendar` (25).
- **Significato**: prenotazione/spostamento/disdetta appuntamenti durante la chiamata.

### Pattern C — Campagna di chiamate outbound
`scheduleTrigger` → `googleSheets` (lista) → `if`/`limit`/`splitOut` → `wait` →
`yourang` (`workflow:execute`)
- Firme: `googleSheets,if,limit,scheduleTrigger,wait,yourang` (4), `httpRequest,if,limit,scheduleTrigger,splitOut,yourang` (3).
- **Significato**: richiamo automatico e a scaglioni di una lista contatti.

### Pattern D — Follow-up a tempo
`webhook`/`yourang` → `wait` → `yourang`/`httpRequest`
- Coppie: `wait→yourang` (104), `yourang→wait` (42), `code,wait,webhook,yourang` (firma, 4).
- **Significato**: sequenze di richiamo/nurturing a intervalli.

### Pattern E — Notifica lead/prenotazione
`webhook` → `emailSend`/`gmail`
- Firme: `emailSend,webhook` (20 wf, la più comune in assoluto), `gmail,webhook` (7).
- Coppie: `webhook→emailSend` (40).

### Pattern F — Sync / push verso CRM
`httpRequest` → `httpRequest` (catene), spesso verso RelatiaCRM/Spoki/ActiveCampaign
- Coppia `httpRequest→httpRequest` = **212** (di gran lunga la più frequente) → orchestrazione
  manuale di API REST esterne.

### Pattern G — Post-call processing
`yourang` (`getTranscript`/`getSummary`) → CRM/Sheet/email
- Operazioni yourang: `getTranscript` (28), `getSummary` (11) → arricchimento dopo la chiamata.

---

## 4. Cosa dovrebbero sviluppare i dev di yourang (piattaforma)

Obiettivo: **eliminare la necessità di ricostruire questi pattern in n8n** portando le
capacità più richieste dentro yourang, così gli strategist configurano invece di programmare.

1. **Integration Hub nativo** per i servizi top: Google Calendar, Google Sheets,
   ActiveCampaign, Gmail/SMTP — coprono >80% dei casi. Connessione OAuth one-click,
   riusabile da tutti gli agenti dell'org.
2. **Connettori CRM mancanti ad alta frequenza**: **RelatiaCRM, Spoki (WhatsApp), GoHighLevel**.
   Oggi ~500 chiamate HTTP grezze; nativizzarli toglie il 40% del lavoro manuale.
3. **Appointment/Calendar tool nativo** (Google Calendar): verifica disponibilità + booking
   come funzione built-in dell'agente, configurabile senza n8n (Pattern A+B, ~253 workflow).
4. **Outbound calling campaign** built-in: importa lista (CSV/Sheet/contact list) → cadence
   con limiti e `wait` → richiamo. Sostituisce il Pattern C ricostruito a mano.
5. **WhatsApp channel nativo** (via Spoki o Meta Cloud API): conferme/promemoria/follow-up.
6. **Post-call automation hooks** nativi: su `call.ended` invia transcript/summary a
   CRM/email/sheet con regole no-code (Pattern G).
7. **Libreria di template in-app** per i pattern A–G, con wizard di configurazione.
8. **Webhook/External-tool builder visuale**: oggi gli strategist scrivono `code` +
   `respondToWebhook` a mano (148 workflow con `code`!). Un builder guidato di "tool esterni"
   per l'agente eliminerebbe la maggior parte di questo codice.

---

## 5. Cosa creare in questo repo (`n8n-nodes-yourang`)

Per chi resta su n8n, il nodo community e i template ufficiali possono alzare di molto la
qualità e ridurre gli errori.

### 5.1 Fix / debito (priorità alta)
- **Risorsa `Action` rimossa — impatto contenuto**: il commit `259c33d` ha rimosso la
  risorsa *Action* (deprecata, fuori produzione). La referenziano ancora 16 workflow ma
  quasi tutti dismessi: **solo 4 sono attivi** (`wedding (CRM)`, `Lucia Fusaro_Call lista`,
  `Absolute freedom LTD_Call lista`, `Facus Drums_NR`, tutti `action:executeSingle`), 9
  inattivi, 3 archiviati. Migrare i 4 attivi all'operazione equivalente (es. `workflow:execute`)
  e chiudere; in subordine un alias deprecato temporaneo.
- **Coprire gli endpoint yourang chiamati via HTTP grezzo**: 40 chiamate vanno direttamente
  ad `api.yourang.ai` invece di passare dal nodo → mappare quegli endpoint in operazioni
  native (così smettono di usare `httpRequest`).

### 5.2 Nuove capacità del nodo
- **Yourang Trigger node** (eventi: `call.ended`, `appointment.booked`, `lead.created`):
  sostituisce il pattern `webhook` + `code` (parse) presente in centinaia di workflow,
  con output già strutturato (niente JS manuale).
- **AI Tool sub-node** (`usableAsTool`): esporre yourang come tool per i nodi Agent LangChain,
  vista l'adozione AI crescente.
- **Operazioni di convenienza** che restituiscono il payload chiamata già parsato
  (caller, intent, slot) per eliminare i nodi `code`.

### 5.3 Libreria di template ufficiali (massimo impatto, basso sforzo)
Pubblicare workflow `.json` importabili, pre-cablati col nodo yourang, uno per pattern:
1. **Voice Agent External Tool** (Pattern A) — scheletro webhook→logica→respondToWebhook.
2. **Appointment Booking – Google Calendar** (Pattern B).
3. **Outbound Calling Campaign – Google Sheets** (Pattern C).
4. **Timed Follow-up Sequence** (Pattern D).
5. **Lead/Booking Notification** (Pattern E).
6. **CRM Sync** (Pattern F) con varianti RelatiaCRM / ActiveCampaign / Spoki.
7. **Post-Call CRM/Sheet Sync** (Pattern G) con transcript+summary.

Gli strategist li importano e configurano solo le credenziali → meno errori, onboarding più
rapido, standardizzazione.

### 5.4 Quick win di qualità
- Diversi template girano con **placeholder non sostituiti** (es. URL letterali
  `inserire_url_sms_1`, `inserire_url_notifica_proprietario`): segnale che mancano template
  guidati/validati. I template ufficiali con campi obbligatori risolvono questo.
- Workflow da **241 nodi**: candidati a refactoring/sub-workflow riusabili.

---

## 6. Priorità consigliate

| # | Azione | Dove | Impatto | Sforzo |
|---|---|---|---|---|
| 1 | Migrare i 4 workflow attivi che usano la risorsa `Action` | repo n8n-nodes | Basso (solo 4 wf) | Basso |
| 2 | Libreria template ufficiali (Pattern A–G) | repo n8n-nodes | Alto | Medio |
| 3 | Yourang Trigger node | repo n8n-nodes | Alto | Medio |
| 4 | Integrazioni native CRM (RelatiaCRM, Spoki, GoHighLevel) | piattaforma yourang | Alto | Alto |
| 5 | Appointment + Outbound campaign nativi | piattaforma yourang | Alto | Alto |
| 6 | External-tool builder no-code | piattaforma yourang | Alto | Alto |
| 7 | AI Tool sub-node | repo n8n-nodes | Medio | Basso |

---

## 7. Task di sviluppo su Linear (team yourang)

Epic: **[YR-228](https://linear.app/reddoak/issue/YR-228)** — Strategist workflow optimization.
Tutte le issue sono in inglese e contengono il piano di sviluppo per i dev.

### Repo `n8n-nodes-yourang` (progetto "n8n Automation")
| Issue | Titolo | Stato |
|---|---|---|
| [YR-229](https://linear.app/reddoak/issue/YR-229) | "Action" resource removed: active workflows migrated | ✅ Done |
| [YR-230](https://linear.app/reddoak/issue/YR-230) | Official template library (Patterns A–G) | High |
| [YR-231](https://linear.app/reddoak/issue/YR-231) | Yourang Trigger node (call.ended, appointment.booked, lead.created) | High |
| [YR-232](https://linear.app/reddoak/issue/YR-232) | Cover missing api.yourang.ai endpoints + AI Tool sub-node | Medium |

### Piattaforma yourang (progetto "yourang")
| Issue | Titolo | Stato |
|---|---|---|
| [YR-233](https://linear.app/reddoak/issue/YR-233) | Native CRM connectors: RelatiaCRM, Spoki (WhatsApp), GoHighLevel | High |
| [YR-234](https://linear.app/reddoak/issue/YR-234) | Native appointment booking + outbound calling campaign | High |
| [YR-235](https://linear.app/reddoak/issue/YR-235) | External tool & AI/MCP tool: già nativi — audit + standardizzazione | High |
| [YR-237](https://linear.app/reddoak/issue/YR-237) | Audit + standardize external tools across all agents (via MCP) | High |

> Nota: external webhook tool e AI tool (MCP) **esistono già nativi** in yourang — vedi il runbook
> operativo in [`docs/yourang-external-tools-agent-plan.md`](./yourang-external-tools-agent-plan.md).
> Lo sviluppo residuo riguarda solo i connettori CRM/MCP dedicati, il sub-node AI Tool n8n e i template.

---

*Metodologia: estrazione via API REST n8n (`/rest/workflows/:id`) di tutti i workflow non
archiviati; aggregazione di tipi di nodo, trigger, coppie di nodi adiacenti dalle connessioni,
hostname dei nodi httpRequest, operazioni del nodo yourang e tipi di credenziale.*
