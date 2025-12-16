<div align="center">

> ⚠️ **Nota sulla traduzione:** Questo documento è stato tradotto da IA. Se trovate errori, per favore segnalateli. Grazie!

Questo progetto è un fork di <b>star-history/star-history</b> ed è stato migliorato. Non unirà il codice al progetto originale.

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com), **fornisce capacità di statistiche e visualizzazione dati mancanti per i repository GitHub, come la funzionalità del grafico della cronologia delle stelle.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **QUESTO** è un grafico **`in tempo reale`** creato con il seguente codice HTML: 👇

<div align="left">

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>
```

</div>

</div>

---

## ✨ Funzionalità

- Basato su [VChart](https://github.com/VisActor/VChart).
- Supporto per visualizzare dati dettagliati
- Generazione **con un clic** di immagini di grafici **di alta qualità**;
- Supporto per **molteplici modalità di visualizzazione** dei grafici, **`basate su data o timeline`**;
- **Incorporare** **grafici in tempo reale** in **`GitHub readme o altri siti web`** **(come l'esempio che abbiamo incorporato in alto)**;
- E **varie** **funzioni** utili:
  - Attiva/disattiva **visibilità del repository**;
  - **Scorciatoia** per inserire il nome del repository;
  - **Condivisione rapida** su **`social network`**;
  - **Supporto** per inserire **più repository**;
  - ...altre funzionalità che aspettano di essere **scoperte!**

## 🌠 Screenshot

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 Sviluppo

**`Star-history`** è costruito utilizzando uno **stack tecnologico moderno**: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### Prerequisiti

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### Installare le dipendenze

```shell
pnpm i
```

### Iniziare lo sviluppo

- **Sito web principale** è la homepage di gitdata, contenente la maggior parte delle **funzionalità utili e blog** su **`VisActor open source`**.

  ```shell
  pnpm dev
  ```

  Il sito web sarà servito su http://localhost:3000.

- **Server API** è una **`funzionalità sperimentale`**. È utilizzato principalmente per **generare file di immagini di grafici `SVG` o `PNG`** che possono essere incorporati in **`GitHub readme`**.

  #### Prerequisiti per il server API

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (per memorizzare nella cache i dati del repository)

  #### Installare MongoDB Community Server

  **Nota:** Dopo aver cambiato la password, ricorda di aggiornare la stringa di connessione nel tuo file `.env` o variabili d'ambiente.

  **Impostare le variabili d'ambiente:**

  La configurazione MongoDB può essere modificata in base alla tua situazione reale.

  ```shell
  # Impostare la stringa di connessione MongoDB
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  Oppure creare un file `.env` nella directory `server`:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### Avviare il server API

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  Il server API sarà in esecuzione su http://localhost:8080 (o https://localhost:8080 se HTTPS è abilitato).

  #### Token

  Il servizio backend richiede il tuo token GitHub personale, posizionato nel file `token.env`.

  ### Abilitare il supporto HTTPS

  Per abilitare HTTPS per il frontend:

  1. **Generare certificati SSL** (per sviluppo):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     Questo creerà certificati autofirmati nella directory `certs/`.

  2. **Per Frontend (Vite)**:

     Il server di sviluppo Vite utilizzerà automaticamente HTTPS se i certificati vengono trovati nella directory `certs/`, oppure puoi specificare percorsi personalizzati:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## Piani futuri

- Aggiungere più funzionalità di modifica e annotazione
- Visualizzare e modificare il codice VChart, esportare nell'editor ufficiale VChart
- Generare video animati della cronologia delle stelle (GIF)
- Più statistiche e funzionalità di analisi dei dati GitHub
