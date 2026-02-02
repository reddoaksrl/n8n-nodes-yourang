# Yourang n8n Node - Workflow Templates

Questa cartella contiene template di workflow n8n pronti all'uso per il nodo Yourang.

## Come Importare i Template

1. Apri n8n nel tuo browser (http://localhost:5678)
2. Clicca su "Workflows" nel menu principale
3. Clicca su "Import from File"
4. Seleziona uno dei file JSON di questa cartella
5. Configura le credenziali Yourang API

## Template Disponibili

### Call History

#### `call-history-get-many.json`
Recupera la cronologia delle chiamate con filtri opzionali.
- **Operazione:** Get Many
- **Filtri:** Status, Type, Sort
- **Use Case:** Monitoraggio chiamate recenti, analisi performance

#### `call-history-get-transcript.json`
Ottiene il trascritto completo di una chiamata specifica.
- **Operazione:** Get Transcript
- **Parametri:** Call ID
- **Use Case:** Analisi conversazioni, quality assurance

### Contact Management

#### `contact-create.json`
Crea un nuovo contatto nel sistema Yourang.
- **Operazione:** Create
- **Campi:** First Name, Phone Number, Last Name, Email, Address
- **Use Case:** Importazione contatti da altri sistemi

#### `contact-get-many.json`
Recupera lista di contatti con filtri e ordinamento.
- **Operazione:** Get Many
- **Filtri:** Search, Sort
- **Use Case:** Sincronizzazione CRM, esportazione dati

#### `contact-update.json`
Aggiorna informazioni di un contatto esistente.
- **Operazione:** Update
- **Parametri:** Contact ID + campi da aggiornare
- **Use Case:** Mantenimento dati aggiornati

#### `contact-advanced-search.json`
Ricerca avanzata contatti con operatori logici OR e AND.
- **Operazione:** Get Many con Advanced Filter
- **Filtri:** Query string complessa (es: `first_name:John|first_name:Jane&email:@gmail.com`)
- **Use Case:** Ricerche complesse, segmentazione clienti

### Action Execution

#### `action-execute-single.json`
Esegue un'azione (chiamata) singola con contesto personalizzato.
- **Operazione:** Execute Single
- **Parametri:** Configuration ID, Phone Number, Custom Context
- **Use Case:** Chiamate personalizzate, reminder appuntamenti

#### `action-execute-batch.json`
Esegue azioni batch su multipli numeri di telefono (max 50).
- **Operazione:** Execute Batch Numbers
- **Parametri:** Configuration ID, Phone Numbers (uno per riga)
- **Use Case:** Campagne marketing, comunicazioni massive

#### `action-get-history.json`
Recupera lo storico delle azioni eseguite.
- **Operazione:** Get Action History
- **Filtri:** Status, Configuration ID, Sort
- **Use Case:** Tracking campagne, analisi risultati

### Complete Workflows

#### `complete-workflow-example.json`
Workflow completo che dimostra l'integrazione di più operazioni.

**Flusso:**
1. **Trigger schedulato** → Si attiva periodicamente
2. **Get New Contacts** → Recupera nuovi contatti
3. **Filter** → Filtra solo contatti con email
4. **Execute Welcome Call** → Esegue chiamata di benvenuto con contesto personalizzato
5. **Wait** → Attende 5 minuti
6. **Get Call Status** → Verifica stato chiamata
7. **Check if Completed** → Controlla se completata
8. **Get Transcript** → Recupera trascritto
9. **Get AI Summary** → Ottiene riassunto AI
10. **Send to CRM** → Invia dati al CRM

**Use Case:** Automazione onboarding clienti, follow-up automatico

## Configurazione Credenziali

Prima di usare i template, configura le credenziali:

1. In n8n, vai su "Credentials" → "New"
2. Cerca "Yourang API"
3. Inserisci:
   - **API Key:** La tua API key di Yourang
   - **Base URL:** `https://developers.yourang.ai/api/v1` (default)

## Personalizzazione Template

Dopo l'import, personalizza:

- **Configuration IDs:** Sostituisci con i tuoi ID configurazione action
- **Phone Numbers:** Usa numeri reali in formato E.164 (+1234567890)
- **Contact IDs:** Usa ID contatti validi dal tuo account
- **Custom Context:** Adatta il contesto alle tue esigenze
- **Filtri:** Modifica i filtri secondo i tuoi criteri

## Best Practices

1. **Usa sempre formato E.164** per i numeri di telefono (+CountryCode + Number)
2. **Testa con pochi contatti** prima di eseguire batch grandi
3. **Monitora action history** per verificare successo esecuzioni
4. **Usa custom context** per personalizzare le chiamate
5. **Implementa error handling** nei workflow di produzione

## Risorse Aggiuntive

- [Yourang API Documentation](https://developers.yourang.ai/)
- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community](https://community.n8n.io/)

## Supporto

Per problemi o domande:
- **Repository:** https://github.com/reddoaksrl/n8n-nodes-yourang
- **Issues:** https://github.com/reddoaksrl/n8n-nodes-yourang/issues
