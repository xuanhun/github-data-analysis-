<div align="center">
本项目 从 <b>star-history/star-history</b>  fork,进行升级改造。不再向原项目合并代码。
项目更新了图表实现方式，并引入 MongoDB 进行数据缓存，以减少对 GitHub API 的调用次数，提升性能。
新增了暗色主题。

# :sparkles: gitdata analysis :sparkles:

[**gitdata.xuanhun520.com**](https://gitdata.xuanhun520.com)，**为 GitHub 仓库提供缺失的数据统计与可视化能力，比如 star 历史图表功能。**

<picture>
  <source media="(prefers-color-scheme: dark) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light) and (max-width: 800px)" srcset="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
  <img style="width: 800px; height: 533px;" alt="Star History Chart" src="https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date" />
</picture>

👆 **这是一个**实时**图表，使用以下 HTML 代码创建：👇

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




## ✨ 功能特性

- 基于[VChart](https://github.com/VisActor/VChart)。
- 支持查看明细数据
- **一键生成** **高质量** 的图表图片；
- 支持 **多种图表视图** 模式，**`基于日期或时间线`**；
- **嵌入** **实时图表** 到 **`GitHub readme 或其他网站`** **（就像我们在顶部嵌入的这个示例）**；
- 以及 **各种** 实用的 **功能**：
  - 切换 **仓库可见性**；
  - **快捷键** 输入仓库名称；
  - **快速分享** 到 **`社交网络`**；
  - **支持** 输入 **多个仓库**；
  - ...更多功能等你来 **发现！**

## 🌠 截图展示

<a href="https://gitdata.xuanhun520.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>



## 🏗 开发指南

**`Star-history`** 使用 **现代技术栈** 构建：**`Vue`** + **`Vite`** + **`TailwindCSS`** + **`@Visactor/VChart`** 。

### 前置要求

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)
- [mongodb](https://www.mongodb.com/)

### 安装依赖

```shell
pnpm i
```

### 开始开发

- **主网站** 是 gitdata 的主页，包含大多数 **实用功能和关于**`VisActor开源`**的博客**。

  ```shell
  pnpm dev
  ```

  网站将在 http://localhost:3000 提供服务。

- **API Server** 是一个**实验性功能**，主要用于生成可以嵌入到 **`GitHub readme`** 的图表 **`SVG`** 或 **`PNG`** 图片文件。

  #### API Server 前置要求

  - [MongoDB Community Server](https://www.mongodb.com/try/download/community) (用于缓存仓库数据)

  #### 安装 MongoDB Community Server

  **注意：** 修改密码后，记得更新 `.env` 文件或环境变量中的连接字符串。

  **设置环境变量：**
  mongo 配置可以根据实际情况进行修改

  ```shell
  # 设置 MongoDB 连接字符串
  export MONGODB_URI="mongodb://[username]:[password]@localhost:27017/gitdata"
  export MONGODB_DB_NAME="gitdata"
  export MONGODB_COLLECTION_NAME="repo_cache"
  ```

  或在 `server` 目录下创建 `.env` 文件：

  ```env
  MONGODB_URI=mongodb://xuanhun:xuanhun@localhost:27017/gitdata
  MONGODB_DB_NAME=gitdata
  MONGODB_COLLECTION_NAME=repo_cache
  ```

  #### 启动 API Server

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  API 服务器将在 http://localhost:8080 运行（如果启用了 HTTPS，则为 https://localhost:8080）。

  #### token
  后端服务需要提供你自己的github token，放置在token.env 文件中

  ### 启用 HTTPS 支持

  要为前端 HTTPS：

  1. **生成 SSL 证书**（用于开发环境）：

     ```shell
     ./scripts/generate-ssl-cert.sh
     ```

     这将在 `certs/` 目录中创建自签名证书。

  2. **对于前端（Vite）**：

     如果 `certs/` 目录中存在证书文件，Vite 开发服务器将自动使用 HTTPS，或者您可以指定自定义路径：

     ```shell
     export SSL_CERT_PATH=/path/to/cert.crt
     export SSL_KEY_PATH=/path/to/key.key
     pnpm dev
     ```

## 未来计划
  -- 添加更多的编辑和标注功能
  -- 查看和编辑VChart 代码，导出到VChart 官方编辑器
  -- 生成star 历史动态视频（gif）
  -- 更多的github 数据统计和分析功能

    

