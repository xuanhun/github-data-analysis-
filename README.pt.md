<div align="center">

> ⚠️ **Nota de tradução:** Este documento foi traduzido por IA. Se encontrar algum erro, por favor indique. Obrigado!

Este projeto é um fork de <b>star-history/star-history</b> e foi aprimorado. Não fará merge do código de volta ao projeto original.

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com), **fornece capacidades de estatísticas e visualização de dados ausentes para repositórios GitHub, como a funcionalidade de gráfico de histórico de estrelas.**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date" />
</picture>

👆 **ESTE** é um gráfico **`ao vivo`** criado com o seguinte código HTML: 👇

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

## ✨ Recursos

- Baseado em [VChart](https://github.com/VisActor/VChart).
- Suporte para visualizar dados detalhados
- Geração **com um clique** de imagens de gráficos **de alta qualidade**;
- Suporte para **múltiplos modos de visualização** de gráficos, **`baseados em data ou linha do tempo`**;
- **Incorporar** **gráficos em tempo real** em **`GitHub readme ou outros sites`** **(como o exemplo que incorporamos no topo)**;
- E **várias** **funções** úteis:
  - Alternar **visibilidade do repositório**;
  - **Atalho** para inserir o nome do repositório;
  - **Compartilhamento rápido** para **`redes sociais`**;
  - **Suporte** para inserir **múltiplos repositórios**;
  - ...mais recursos esperando para você **descobrir!**

## 🌠 Capturas de tela

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 Desenvolvimento

**`Star-history`** é construído usando uma **pilha tecnológica moderna**: **`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`**.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/)

### Instalar dependências

```shell
pnpm i
```

### Iniciar desenvolvimento

- **Site principal** é a página inicial do gitdata, contendo a maioria das **funcionalidades úteis e blogs** sobre **`VisActor open source`**.

  ```shell
  pnpm dev
  ```

  O site será servido em http://localhost:3000.

- **Servidor API** é uma **`funcionalidade experimental`**. É usado principalmente para **gerar arquivos de imagem de gráficos `SVG` ou `PNG`** que podem ser incorporados em **`GitHub readme`**.

  #### Pré-requisitos para o servidor API

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (para cache de dados do repositório)

  #### Instalar MongoDB Community Server

  **Nota:** Após alterar a senha, lembre-se de atualizar a string de conexão no seu arquivo `.env` ou variáveis de ambiente.

  **Definir variáveis de ambiente:**

  A configuração do MongoDB pode ser modificada de acordo com sua situação real.

  ```shell
  # Definir string de conexão MongoDB
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  Ou criar um arquivo `.env` no diretório `server`:

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### Iniciar servidor API

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  O servidor API estará em execução em http://localhost:8080 (ou https://localhost:8080 se HTTPS estiver habilitado).

  #### Token

  O serviço backend requer seu próprio token GitHub, colocado no arquivo `token.env`.

  ### Habilitar suporte HTTPS

  Para habilitar HTTPS para o frontend:

  1. **Gerar certificados SSL** (para desenvolvimento):

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     Isso criará certificados autoassinados no diretório `certs/`.

  2. **Para Frontend (Vite)**:

     O servidor de desenvolvimento Vite usará automaticamente HTTPS se certificados forem encontrados no diretório `certs/`, ou você pode especificar caminhos personalizados:

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## Planos futuros

- Adicionar mais recursos de edição e anotação
- Visualizar e editar código VChart, exportar para o editor oficial VChart
- Gerar vídeos animados do histórico de estrelas (GIF)
- Mais estatísticas e recursos de análise de dados do GitHub
