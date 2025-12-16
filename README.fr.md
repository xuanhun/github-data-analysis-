<div align="center">

> ⚠️ **Note de traduction:** Ce document a été traduit par IA. Si vous trouvez des erreurs, veuillez les signaler. Merci!

Ce projet est un fork de <b>star-history/star-history</b> et a été amélioré. Il ne fusionnera pas le code vers le projet original.

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com), **fournit des capacités de statistiques et de visualisation de données manquantes pour les dépôts GitHub, telles que la fonctionnalité de graphique d'historique des étoiles.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **CE** graphique **`en direct`** a été créé avec le code HTML suivant : 👇

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

## ✨ Fonctionnalités

- Basé sur [VChart](https://github.com/VisActor/VChart).
- Support pour voir les données détaillées
- Génération **en un clic** d'images de graphiques **de haute qualité**;
- Support pour **plusieurs modes d'affichage** de graphiques, **`basés sur la date ou la chronologie`**;
- **Intégrer** **des graphiques en temps réel** dans **`GitHub readme ou d'autres sites web`** **(comme l'exemple que nous avons intégré en haut)**;
- Et **diverses** **fonctions** utiles:
  - Basculer la **visibilité du dépôt**;
  - **Raccourci** pour saisir le nom du dépôt;
  - **Partage rapide** vers **`les réseaux sociaux`**;
  - **Support** pour saisir **plusieurs dépôts**;
  - ...plus de fonctionnalités vous attendent pour les **découvrir!**

## 🌠 Captures d'écran

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 Développement

**`Star-history`** est construit en utilisant une **pile technologique moderne**: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### Prérequis

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### Installer les dépendances

```shell
pnpm i
```

### Démarrer le développement

- **Site web principal** est la page d'accueil de gitdata, contenant la plupart des **fonctionnalités utiles et des blogs** sur **`VisActor open source`**.

  ```shell
  pnpm dev
  ```

  Le site web sera servi sur http://localhost:3000.

- **Serveur API** est une **`fonctionnalité expérimentale`**. Il est principalement utilisé pour **générer des fichiers d'image de graphiques `SVG` ou `PNG`** qui peuvent être intégrés dans **`GitHub readme`**.

  #### Prérequis pour le serveur API

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (pour mettre en cache les données du dépôt)

  #### Installer MongoDB Community Server

  **Note:** Après avoir changé le mot de passe, n'oubliez pas de mettre à jour la chaîne de connexion dans votre fichier `.env` ou variables d'environnement.

  **Définir les variables d'environnement:**

  La configuration MongoDB peut être modifiée selon votre situation réelle.

  ```shell
  # Définir la chaîne de connexion MongoDB
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  Ou créer un fichier `.env` dans le répertoire `server`:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### Démarrer le serveur API

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  Le serveur API fonctionnera sur http://localhost:8080 (ou https://localhost:8080 si HTTPS est activé).

  #### Token

  Le service backend nécessite votre propre token GitHub, placé dans le fichier `token.env`.

  ### Activer le support HTTPS

  Pour activer HTTPS pour le frontend:

  1. **Générer des certificats SSL** (pour le développement):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     Cela créera des certificats auto-signés dans le répertoire `certs/`.

  2. **Pour Frontend (Vite)**:

     Le serveur de développement Vite utilisera automatiquement HTTPS si des certificats sont trouvés dans le répertoire `certs/`, ou vous pouvez spécifier des chemins personnalisés:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## Plans futurs

- Ajouter plus de fonctionnalités d'édition et d'annotation
- Voir et éditer le code VChart, exporter vers l'éditeur officiel VChart
- Générer des vidéos animées de l'historique des étoiles (GIF)
- Plus de statistiques et fonctionnalités d'analyse de données GitHub
