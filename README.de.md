<div align="center">

> ⚠️ **Übersetzungshinweis:** Dieses Dokument wurde von KI übersetzt. Falls Sie Fehler finden, bitte melden Sie diese. Vielen Dank!

Dieses Projekt ist ein Fork von <b>star-history/star-history</b> und wurde verbessert. Es wird keinen Code zurück zum ursprünglichen Projekt zusammenführen.
Das Projekt aktualisiert die Diagramm-Implementierung und führt MongoDB für das Daten-Caching ein, um GitHub-API-Aufrufe zu reduzieren und die Leistung zu verbessern.
Ein dunkles Thema wurde hinzugefügt.

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com), **bietet fehlende Datenstatistiken und Visualisierungsfunktionen für GitHub-Repositories, wie z.B. die Funktionalität für Star-Historie-Diagramme.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **DIESES** ist ein **`Live`**-Diagramm, das mit dem folgenden HTML-Code erstellt wurde: 👇

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

## ✨ Funktionen

- Basierend auf [VChart](https://github.com/VisActor/VChart).
- Unterstützung zum Anzeigen detaillierter Daten
- **Ein-Klick**-Generierung von **hochwertigen** Diagrammbildern;
- Unterstützung für **mehrere Diagrammansichtsmodi**, **`basierend auf Datum oder Zeitachse`**;
- **Einbetten** von **Echtzeit-Diagrammen** in **`GitHub readme oder andere Websites`** **(wie das Beispiel, das wir oben eingebettet haben)**;
- Und **verschiedene** nützliche **Funktionen**:
  - **Repository-Sichtbarkeit** umschalten;
  - **Tastenkürzel** zum Eingeben des Repository-Namens;
  - **Schnelles Teilen** auf **`soziale Netzwerke`**;
  - **Unterstützung** für die Eingabe **mehrerer Repositories**;
  - ...weitere Funktionen warten darauf, von Ihnen **entdeckt zu werden!**

## 🌠 Screenshots

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 Entwicklung

**`Star-history`** wird mit einem **modernen Tech-Stack** erstellt: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### Voraussetzungen

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### Abhängigkeiten installieren

```shell
pnpm i
```

### Entwicklung starten

- **Hauptwebsite** ist die Startseite von gitdata und enthält die meisten **nützlichen Funktionen und Blogs** über **`VisActor Open Source`**.

  ```shell
  pnpm dev
  ```

  Die Website wird unter http://localhost:3000 bereitgestellt.

- **API-Server** ist eine **`experimentelle Funktion`**. Er wird hauptsächlich verwendet, um **Diagramm-`SVG`- oder `PNG`-Bilddateien** zu generieren, die in **`GitHub readme`** eingebettet werden können.

  #### Voraussetzungen für den API-Server

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (zum Zwischenspeichern von Repository-Daten)

  #### MongoDB Community Server installieren

  **Hinweis:** Nach dem Ändern des Passworts denken Sie daran, die Verbindungszeichenfolge in Ihrer `.env`-Datei oder Umgebungsvariablen zu aktualisieren.

  **Umgebungsvariablen festlegen:**

  Die MongoDB-Konfiguration kann entsprechend Ihrer tatsächlichen Situation geändert werden.

  ```shell
  # MongoDB-Verbindungszeichenfolge festlegen
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  Oder erstellen Sie eine `.env`-Datei im Verzeichnis `server`:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### API-Server starten

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  Der API-Server läuft unter http://localhost:8080 (oder https://localhost:8080, wenn HTTPS aktiviert ist).

  #### Token

  Der Backend-Service benötigt Ihr eigenes GitHub-Token, das in der Datei `token.env` platziert wird.

  ### HTTPS-Unterstützung aktivieren

  Um HTTPS für das Frontend zu aktivieren:

  1. **SSL-Zertifikate generieren** (für Entwicklung):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     Dies erstellt selbstsignierte Zertifikate im Verzeichnis `certs/`.

  2. **Für Frontend (Vite)**:

     Der Vite-Entwicklungsserver verwendet automatisch HTTPS, wenn Zertifikate im Verzeichnis `certs/` gefunden werden, oder Sie können benutzerdefinierte Pfade angeben:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## Zukünftige Pläne

- Weitere Bearbeitungs- und Annotationsfunktionen hinzufügen
- VChart-Code anzeigen und bearbeiten, Export zum offiziellen VChart-Editor
- Animierte Videos der Star-Historie generieren (GIF)
- Weitere GitHub-Datenstatistiken und Analysefunktionen
