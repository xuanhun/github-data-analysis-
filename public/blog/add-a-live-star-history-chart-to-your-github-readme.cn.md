# 免责声明

> 重要声明：本应用基于 [star-history/star-history](https://github.com/star-history/star-history) 改造升级，我们将持续加入更多数据分析能力，感谢原作者！本文档也在原仓库文档的基础上进行改写与完善。

新的仓库地址：[github-data-analysis-](https://github.com/xuanhun/github-data-analysis-)

新项目更新了图表实现方式，加入mongodb 进行数据缓存，以减少对 GitHub API 的调用次数，提升性能。
加入了dark 主题
---

# 在 GitHub README 中加入实时的 Star 历史图

<img width="1974" height="1580" alt="image" src="https://github.com/user-attachments/assets/412dc876-731f-4ac7-8320-7a4a25b38633" />

我们支持把实时的 Star 历史图嵌入到你的 GitHub README 中。上图是我们自己的项目 [GitHub 数据分析](https://github.com/xuanhun/github-data-analysis-) 的截图。

这个功能非常好用：在站点页面查询仓库后，会生成一段代码片段，你只需要把它复制到你的 README（或任何站点/博客）即可。

<img width="1302" height="903" alt="image" src="https://github.com/user-attachments/assets/74ae1e8b-98c7-4811-a16d-cdf959f820e2" />

下面介绍该功能的设计背景与具体用法。

## 使用 `<iframe />` 方式嵌入

在调研常见的网页嵌入实现后，我们选择使用 `<iframe />` 作为嵌入容器：它无需后端即可展示原始图表，并且可以与实时数据交互。

由于 GitHub API 对匿名调用有严格限流，我们需要用户提供自己生成的 Token 来提升限额。

### `iframe` 嵌入的使用步骤

1. 打开 [gitdata.xuanhun520.com](https://gitdata.xuanhun520.com/) 并查询目标仓库；
2. 点击图表下方的 `Embed` 按钮；
3. 输入你的个人访问 Token；

  <img width="745" height="596" alt="image" src="https://github.com/user-attachments/assets/945002e1-3661-452e-82b7-e720e0dda80d" />

4. 点击 `Copy` 按钮，把代码粘贴到你的站点或博客即可；

## 使用 SVG 静态图片嵌入（用于 README）

`iframe` 嵌入很强大，但也有两点限制：

1. GitHub 的 Markdown 风格不允许渲染 `<iframe />`，因此无法直接把交互图嵌到 README；
2. 需要提供个人 Token。虽然我们不在服务器端存储 Token，但在网页源码中仍可看到它，这在公共场景下并不理想。

因此，我们提供了基于图片链接的 SVG 方案，适合在公共页面（例如仓库 README）中展示最新星图。

### 在 GitHub README 中添加图表的步骤

1. 打开 [gitdata.xuanhun520.com](https://gitdata.xuanhun520.com) 并查询仓库；
2. 滚动到操作按钮下方的图片嵌入区域；

   <img width="1513" height="610" alt="image" src="https://github.com/user-attachments/assets/22dde4e3-1720-4083-af59-e53309dcd393" />

3. 点击 `Copy` 按钮；
4. 将代码粘贴到你的仓库 README 中；
5. 搞定 😎

示例链接（按日期模式展示）：

```
https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark
```

## 结论

我们提供两种把实时星图嵌入网页的方式：

- 如果你希望在私有网络页面中放置可自适应且可交互的图表，请使用 `<iframe />` 嵌入；
- 如果你希望在公共页面（例如 GitHub README）中展示最新的星图，请使用 SVG 图片链接方式，例如：

```
https://gitdata.xuanhun520.com/api/starimg?repos=visactor/vchart&type=Date&theme=dark
```

---

## 未来计划

- 加入更多数据分析能力，例如：仓库 forks 历史图、贡献者活动图等；
- 加入用户认证功能，以支持私有仓库的分析；
- 加入更多可视化形式，例如信息图，动态图表等