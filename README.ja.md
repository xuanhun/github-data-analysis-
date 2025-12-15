<div align="center">

> ⚠️ **翻訳に関する注意:** このドキュメントはAIによって翻訳されました。誤りを見つけた場合は、お知らせください。ありがとうございます！

このプロジェクトは <b>star-history/star-history</b> からフォークされ、改良されました。元のプロジェクトにコードをマージしません。

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com)、**GitHubリポジトリに不足しているデータ統計と可視化機能を提供します。スター履歴チャート機能など。**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date" />
</picture>

👆 **これ**は、次のHTMLコードで作成された**`ライブ`**チャートです：👇

<div align="left">

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date" />
</picture>
```

</div>

</div>

---

## ✨ 機能

- [VChart](https://github.com/VisActor/VChart)をベースにしています。
- 詳細データの表示をサポート
- **ワンクリック**で**高品質**なチャート画像を生成;
- **日付またはタイムライン**に基づいた**複数のチャート表示モード**をサポート;
- **`GitHub readmeやその他のウェブサイト`**に**リアルタイムチャート**を**埋め込む**（上部に埋め込んだ例のように）;
- そして**様々な**便利な**機能**：
  - **リポジトリの表示/非表示**を切り替え;
  - リポジトリ名を入力する**ショートカット**;
  - **`ソーシャルネットワーク`**への**クイック共有**;
  - **複数のリポジトリ**の入力を**サポート**;
  - ...さらに多くの機能が**発見**を待っています！

## 🌠 スクリーンショット

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 開発

**`Star-history`**は**モダンな技術スタック**を使用して構築されています：**`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**。

### 前提条件

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### 依存関係のインストール

```shell
pnpm i
```

### 開発を開始

- **メインウェブサイト**はgitdataのホームページで、**`VisActorオープンソース`**に関するほとんどの**便利な機能とブログ**が含まれています。

  ```shell
  pnpm dev
  ```

  ウェブサイトは http://localhost:3000 で提供されます。

- **APIサーバー**は**`実験的な機能`**です。主に**`GitHub readme`**に埋め込むことができるチャート**`SVG`または`PNG`**画像ファイルを**生成**するために使用されます。

  #### APIサーバーの前提条件

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community)（リポジトリデータのキャッシュ用）

  #### MongoDB Community Serverのインストール

  **注意：** パスワードを変更した後、`.env`ファイルまたは環境変数の接続文字列を更新することを忘れないでください。

  **環境変数の設定：**

  MongoDBの設定は、実際の状況に応じて変更できます。

  ```shell
  # MongoDB接続文字列を設定
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  または、`server`ディレクトリに`.env`ファイルを作成します：

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### APIサーバーの起動

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  APIサーバーは http://localhost:8080 で実行されます（HTTPSが有効な場合は https://localhost:8080）。

  #### トークン

  バックエンドサービスには、`token.env`ファイルに配置された独自のGitHubトークンが必要です。

  ### HTTPSサポートを有効にする

  フロントエンドでHTTPSを有効にするには：

  1. **SSL証明書を生成**（開発用）：

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     これにより、`certs/`ディレクトリに自己署名証明書が作成されます。

  2. **フロントエンド（Vite）の場合**：

     `certs/`ディレクトリに証明書ファイルが見つかった場合、Vite開発サーバーは自動的にHTTPSを使用します。または、カスタムパスを指定できます：

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## 今後の計画

- より多くの編集と注釈機能を追加
- VChartコードの表示と編集、VChart公式エディターへのエクスポート
- スター履歴のアニメーションビデオ（GIF）の生成
- より多くのGitHubデータ統計と分析機能
