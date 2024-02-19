# MyChiosco

MyChiosco è una Progressive Web App (PWA) sviluppata in React, progettata per semplificare la prenotazione di piatti presso un chiosco o un ristorante. 
### Librerie/API Utilizzate
MyChiosco sfrutta diverse tecnologie e librerie per garantire un'esperienza ottimale agli utenti:

* **Material-UI**: usa MUI per un design moderno e coerente dell'interfaccia utente, offrendo un aspetto accattivante e una navigazione intuitiva.
* **React Router**: Grazie a React Router, gestisce in modo efficiente il routing dell'applicazione, consentendo agli utenti di spostarsi tra le diverse pagine in modo fluido e senza ricaricare l'intera pagina.
* **Firebase**: Integrando Firebase, MyChiosco offre funzionalità avanzate come l'autenticazione degli utenti, la gestione del database in tempo reale e il supporto per le funzionalità offline, garantendo un'esperienza senza interruzioni anche in assenza di connettività Internet.
### Funzionalità Principali
MyChiosco offre una serie di funzionalità per semplificare il processo di prenotazione e migliorare l'esperienza degli utenti:

* **Prenotazione senza Connessione**: Gli utenti possono aggiungere elementi al carrello e piazzare ordini anche in assenza di connettività Internet. Le modifiche vengono sincronizzate automaticamente con il database Firebase una volta ripristinata la connessione.
* **Gestione Carrello e Ordini**: Gli utenti possono aggiungere elementi al carrello e salvarli per un ordine futuro. Una volta pronti, possono piazzare gli ordini in modo rapido e conveniente.
* **Autenticazione Utenti**: MyChiosco supporta l'autenticazione degli utenti tramite Firebase, consentendo agli utenti di accedere al proprio account e sincronizzare i dati tra dispositivi.
* **Supporto per gli Ospiti**: Anche gli utenti non autenticati possono utilizzare l'app per aggiungere elementi al carrello. Una volta effettuato l'accesso, i dati del carrello vengono automaticamente trasferiti all'account dell'utente.
* **Persistenza dei Dati**: MyChiosco garantisce la persistenza dei dati anche in assenza di connettività Internet. Gli ordini vengono memorizzati localmente e sincronizzati con il database Firebase non appena possibile.
* **Pagina di fallback**: si tratta di una pagina *Offline.html* che viene mostrata in assenza di connettività, nel caso in cui viene effettuato il refresh forzato.
* **Notifiche**: quando si piazza un ordine, viene notificata all'utente una breve descrizione.

### Service Worker
* **Gestione Avanzata della Cache**: Il service worker sfrutta le librerie Workbox per memorizzare in modo intelligente le risorse statiche come file CSS, JavaScript, immagini e font nella cache del browser. Ciò garantisce un caricamento rapido delle pagine e un'esperienza utente fluida, anche in assenza di connessione di rete.
* **Pianificazione delle Risorse Precaricate**: Grazie alla funzione precacheAndRoute, il service worker anticipa le necessità dell'utente memorizzando in anticipo le risorse chiave nella cache al momento del caricamento dell'applicazione. In questo modo, MyChiosco è sempre pronta all'uso, anche quando la connessione internet è debole o assente.
* **Gestione Intelligente delle Richieste di Rete**: Il service worker si occupa di gestire le richieste di rete, fornendo una risposta immediata se la risorsa richiesta è già presente nella cache locale. In caso contrario, il service worker effettua il download della risorsa dalla rete e la memorizza nella cache per un accesso futuro più rapido.
* **Gestione delle Richieste di Navigazione**: Quando l'utente cerca di accedere a una pagina di MyChiosco, il service worker interviene per garantire un'esperienza fluida anche in caso di errore di rete. Se la connessione è assente, il service worker visualizza una pagina offline personalizzata, mantenendo viva l'esperienza utente anche nei momenti più difficili.

L'app è hostata su firebase al seguente link: [[mychiosco.web.app](https://mychiosco.web.app/)]
