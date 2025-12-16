<div align="center">
This project is forked from <b>star-history/star-history</b> and upgraded. It will not merge code back to the original project.

The project updates the chart implementation （[@visactor/vchart](https://www.visactor.com/vchart)) and introduces MongoDB for data caching to reduce GitHub API calls and improve performance.
Added a dark theme.


# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com), **provides missing data statistics and visualization capabilities for GitHub repositories, such as star history chart functionality.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **THIS** is a **`live`** chart created with the following HTML code: 👇

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

## ✨ Features

- Based on [VChart](https://github.com/VisActor/VChart).
- Support viewing detailed data
- **One-click** generation of **high-quality** chart images;
- Support **multiple chart view** modes, **`based on date or timeline`**;
- **Embed** **real-time charts** into **`GitHub readme or other websites`** **(like the example we embedded at the top)**;
- And **various** useful **functions**:
  - Toggle **repository visibility**;
  - **Shortcut** to input repository name;
  - **Quick share** to **`social networks`**;
  - **Support** input **multiple repositories**;
  - ...more features waiting for you to **discover!**

## 🌠 Screenshots

<a href="https://gitdata.xuanhun520.com"> ![20251216184515_rec_](https://github.com/user-attachments/assets/12b605f4-5857-484a-b1fc-a241c6ca3a23)

</a>



## 🏗 Development

**`Star-history`** is built using a **modern tech stack**: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### Install dependencies

```shell
pnpm i
```

### Start Development

- **Main website** is the homepage of gitdata, containing most **useful features and blogs** about **`VisActor open source`**.

  ```shell
  pnpm dev
  ```

  The website will be served at http://localhost:3000.

- **API Server** is an **`experimental feature`**. It's mainly used to **generate chart `SVG` or `PNG`** image files that can be embedded into **`GitHub readme`**.

  #### Prerequisites for API Server

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (for caching repository data)

  #### Install MongoDB Community Server

  **Note:** After changing the password, remember to update the connection string in your `.env` file or environment variables.

  **Set Environment Variables:**

  MongoDB configuration can be modified according to your actual situation.

  ```shell
  # Set MongoDB connection string
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  Or create a `.env` file in the `server` directory:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### Start API Server

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  The API server will be running on http://localhost:8080 (or https://localhost:8080 if HTTPS is enabled).

  #### Token

  The backend service requires your own GitHub token, placed in the `token.env` file.

  ### Enable HTTPS Support

  To enable HTTPS for the frontend:

  1. **Generate SSL certificates** (for development):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     This will create self-signed certificates in the `certs/` directory.

  2. **For Frontend (Vite)**:

     The Vite dev server will automatically use HTTPS if certificates are found in `certs/` directory, or you can specify custom paths:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## Future Plans

- Add more editing and annotation features
- View and edit VChart code, export to VChart official editor
- Generate star history animated videos (GIF)
- More GitHub data statistics and analysis features

## Star History

<a href="https://gitdata.xuanhun520.com/#xuanhun/github-data-analysis-&Date">
<picture >
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=xuanhun/github-data-analysis-&type=Date&theme=dark" />
  <source  media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=xuanhun/github-data-analysis-&type=Date&theme=light" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=xuanhun/github-data-analysis-&type=Date&theme=dark" />
</picture>
</a>
