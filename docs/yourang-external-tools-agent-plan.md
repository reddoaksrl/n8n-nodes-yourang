# Piano operativo — Agente AI: External Tools & AI/MCP Tools su yourang

> Brief eseguibile per l'agente AI con accesso all'MCP `yourang-admin`.
> Obiettivo: standardizzare/creare gli **external webhook tool** degli agenti vocali e
> decidere dove serve l'**AI tool** (MCP) e dove serve sviluppo.
> Basato sull'analisi dei 314 workflow n8n + ispezione reale degli agenti (es. GEA SPORT).

---

## 0. TL;DR — serve sviluppo?

| Capacità | Stato piattaforma | Serve sviluppo? |
|---|---|---|
| **External webhook tool** (agente chiama un URL durante la chiamata) | ✅ Già nativo: modello `ExternalTool` con `parameter_routing`, `auth`, sync ElevenLabs, UI, API e MCP (`create_external_tool`) | ❌ **No** — è configurazione |
| **Built-in tool** (reservation, order, transfer, knowledge base, end call) | ✅ Già nativi e configurabili (`configure_builtin_tool`) | ❌ **No** — è configurazione |
| **AI tool / tool dinamici LLM-powered** | ✅ Già nativo: `McpServerConfig` (1:1 per agente, JSON-RPC 2.0, discovery `tools/list`, `tools/call`) | ❌ **No per USARLO**; ✅ **Sì** solo se va costruito un *server MCP/connettore* specifico (es. RelatiaCRM-as-MCP) |
| **Yourang come AI Tool dentro n8n** (sub-node `usableAsTool`) | ❌ Non esiste nel nodo community | ✅ **Sì** — sviluppo nel repo `n8n-nodes-yourang` (issue YR-232) |

**Conclusione**: il grosso del lavoro (creare/sistemare external tool e abilitare AI tool via MCP)
è **eseguibile dall'agente AI in autonomia via MCP, senza sviluppo**. Lo sviluppo serve solo per
(a) il sub-node AI Tool in n8n e (b) eventuali server MCP/connettori dedicati.

---

## 1. Contesto e problema (dai dati reali)

Gli strategist creano già external tool, ma con qualità incostante. Esempio GEA SPORT / agente "Linda":

| Tool | URL | Stato | Problema |
|---|---|---|---|
| `geasport_email` | `automations.wolfoncloud.com/webhook/…` (n8n) | ✅ 3 usi, 0 errori | OK — pattern corretto |
| `geasport_siti` | n8n webhook (GET) | ❌ 6 errori | `routing=body` su metodo GET; workflow n8n con "Unused Respond to Webhook node" |
| `centri-estivi` | `https://www.geasport.eu/centri-estivi/` | ❌ disabilitato | URL = **pagina web**, non un endpoint; nessun parametro; "scraping magico" inesistente |
| `servizi-scolastici` | `https://www.geasport.eu/scuole/` | ❌ disabilitato | idem |
| `corsi-sportivi` | `https://www.geasport.eu/scuole/` | ❌ disabilitato | idem |
| `attività educative` | `https://www.geasport.eu/scuole/` | ❌ disabilitato | idem |

Pattern di errore ricorrenti da correggere ovunque:
1. **URL = pagina web** invece di un endpoint API/webhook che risponde JSON.
2. **Metodo/routing incoerenti** (GET con parametri nel body).
3. **Conoscenza statica** infilata nella `description` del tool (va in Knowledge Base / prompt).
4. **Capacità native ricostruite via webhook** (es. info statiche → usare `search_knowledge_base`;
   prenotazioni → `make_reservation`; trasferimenti → `transfer_to_*`).
5. **Backend n8n fragile** (workflow che ritorna 500).

---

## 2. Schema di riferimento (come creare un external tool)

`create_external_tool(organization_id, agent_id, name, description, url, method, parameters_schema, auth?, parameter_routing?)`

Campi e convenzioni (dal modello `ExternalTool`):
- **name** (`tool_name`): snake_case, univoco per org, ≤100 char, parlante (`push_lead_crm`, non `tool1`).
- **description**: SOLO *quando/perché* l'AI deve chiamarlo + cosa restituisce. Niente testo informativo statico.
- **url**: endpoint che risponde **JSON** (webhook n8n o API). **Mai** una pagina web. HTTPS in produzione. Supporta placeholder `{param}` nel path.
- **method**: coerente con il routing (GET/DELETE → `query`/`path`; POST/PUT/PATCH → `body`).
- **parameters_schema**: JSON Schema stile OpenAI; `required` solo i campi davvero necessari; ogni proprietà con `description` chiara (l'AI la usa per popolare i valori).
- **parameter_routing**: `{ "<param>": { "location": "path|query|body|header", "name"?: "<nomeRemoto>" } }`.
- **auth** (`auth_method` + `auth_config`, cifrato a riposo):
  - `none`
  - `bearer`: `{ "token": "…" }`
  - `api_key`: `{ "key": "…", "header_name": "X-API-Key" }`
  - `basic`: `{ "username": "…", "password": "…" }`
  - `custom_header`: `{ "header_name": "X-Custom", "value": "…" }`
- **timeout_seconds**: 1–30 (default 10).

**Regola d'oro**: dopo `create`/`update` → **`test_external_tool`** con argomenti realistici → abilitare solo se `success=true` e `response_status` 2xx.

---

## 3. Gerarchia decisionale (cosa usare per ogni capacità)

Per ogni esigenza dell'agente, scegliere nell'ordine:

1. **Built-in tool** se esiste → `configure_builtin_tool`
   - Info aziendali/statiche → `search_knowledge_base` (+ popolare la KB).
   - Prenotazioni/appuntamenti → `make_reservation` (con `reservation_types` per multi-calendario).
   - Ordini → `place_order`. Trasferimenti → `transfer_to_phone` / `transfer_to_operator`. Fine chiamata → `end_the_call`.
2. **External webhook tool** se serve un'azione/lettura su sistema esterno non coperta dai built-in
   (push lead su CRM, invio riepilogo, lookup contatto, disponibilità custom, WhatsApp via Spoki…).
3. **AI tool (MCP)** se serve un **set dinamico** di tool da un sistema esterno (es. CRM con molte
   operazioni) o tool LLM-backed → `McpServerConfig` (oggi via UI/API; verificare disponibilità tool MCP nell'MCP admin).

Mappa dai pattern n8n → destinazione consigliata:

| Pattern n8n | Destinazione yourang |
|---|---|
| A — External Tool (webhook→logica→respond) | **External tool** che punta al webhook n8n *oppure* direttamente all'API |
| B — Appuntamenti Google Calendar | **Built-in `make_reservation`** (con reservation_types→calendari) |
| E — Notifica lead/booking via email | **External tool** "summary email" (come `geasport_email`) |
| F/G — Sync CRM / post-call | **External tool** push, o **MCP** se il CRM ha molte operazioni |
| Info statiche sito/azienda | **Built-in `search_knowledge_base`** (NON external tool su pagina web) |

---

## 4. Procedura che l'agente AI deve eseguire (runbook)

### Fase 0 — Scope & dry-run (nessuna scrittura)
1. `list_organizations` → selezionare gli org target (default: tutti gli org con agenti attivi; oppure lista fornita).
2. Per ogni org: `list_agents` → per ogni agente attivo: `list_agent_tools`.
3. Produrre un **report di audit** (solo lettura) classificando ogni external tool esistente:
   - ✅ OK (usato, 0/bassi errori, URL endpoint, routing coerente)
   - ⚠️ Da correggere (routing/metodo errati, descrizione gonfia, backend in errore)
   - ❌ Da rimuovere/sostituire (URL = pagina web, capacità coperta da built-in, mai usato + errori)
   - 🔧 Built-in da abilitare al posto del tool (es. KB, reservation)
4. **Fermarsi e far validare il report** prima di qualsiasi scrittura.

### Fase 1 — Standardizzazione (per agente, dopo ok)
Per ogni tool nel piano approvato:
1. Se va **convertito in built-in**: `configure_builtin_tool` (abilita + configura) e disabilitare l'external ridondante.
2. Se va **corretto**: `update` con metodo/`parameter_routing`/`description`/`auth` corretti.
3. Se va **creato**: `create_external_tool` secondo §2.
4. **Sempre** `test_external_tool` con argomenti realistici.
5. Abilitare (`is_enabled=true`) **solo** se il test passa; altrimenti lasciare disabilitato e loggare il motivo.
6. Non toccare i tool ✅ già funzionanti (idempotenza).

### Fase 2 — AI tool (MCP) dove serve
- Identificare gli agenti il cui CRM/sistema espone molte operazioni (es. RelatiaCRM, GoHighLevel):
  candidati a **un server MCP** invece di N external tool.
- Se esiste già un server MCP per quel sistema → configurarlo (`McpServerConfig`).
- Se **non** esiste → **non è config, è sviluppo**: aprire issue per costruire il connettore MCP (vedi §6).

### Fase 3 — Report finale
Per ogni org/agente: tabella before/after, test eseguiti, tool abilitati/disabilitati, voci che richiedono sviluppo.

---

## 5. Guardrail di sicurezza (produzione clienti)
- **Mai abilitare un tool senza test verde.** Mai abilitare puntando a una pagina web.
- **Non disabilitare** un tool con `usage_count > 0` e `error_count` basso senza conferma.
- **Dry-run obbligatorio** (Fase 0) prima di scrivere.
- Rispettare le difese backend: niente URL loopback/IP privati; HTTPS in produzione; `auth` cifrata.
- Una org/agente per volta, con log; idempotenza (riconoscere tool già conformi e saltarli).
- Le credenziali in `auth_config` non vanno mai loggate (il backend le cifra e le redige).

---

## 6. Dove serve davvero sviluppo (da tracciare a parte)
1. **Connettori/Server MCP dedicati** per i CRM ad alto volume senza API "AI-friendly":
   RelatiaCRM (~250 chiamate), Spoki/WhatsApp (~115), GoHighLevel (~122). → abilitano il path "AI tool" nativo.
   (Collegato a YR-233.)
2. **Sub-node AI Tool in `n8n-nodes-yourang`** (`usableAsTool`) per esporre yourang agli Agent LangChain in n8n. (YR-232.)
3. **Template/preset di external tool** ufficiali (catalogo riusabile) che l'agente AI applica per categoria
   di business (ristorante, estetica, sport, immobiliare…). (Collegato a YR-230/YR-235.)

---

## 7. Definition of Done
- Report di audit prodotto e approvato (Fase 0).
- Per gli agenti in scope: 0 external tool abilitati che puntano a pagine web; 0 con routing/metodo incoerenti;
  capacità statiche migrate su Knowledge Base; prenotazioni su `make_reservation` dove applicabile.
- Ogni tool abilitato ha un `test_external_tool` verde recente.
- Elenco esplicito delle voci che richiedono sviluppo (server MCP / sub-node / template).
