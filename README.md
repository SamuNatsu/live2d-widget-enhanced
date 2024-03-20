# Live2D Widget Enhanced

[English](README.en.md)

![](https://forthebadge.com/images/badges/made-with-typescript.svg)
![](https://forthebadge.com/images/badges/built-with-love.svg)
![](https://forthebadge.com/images/badges/uses-html.svg)
![](https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg)

基于 [live2d-widget](https://github.com/stevenjoezhang/live2d-widget/blob/master/src/model.js) 修改的加强版看板娘 Web 组件

## 特性

1. 完全使用 TypeScript 编写，便于开发与维护
2. 将模型加载 API 抽象成接口，使得用户可以自行实现和适配，而不需要严格遵守 FGHRSH 的 API 和 CDN 部署规范
3. 兼容 FGHRSH 提供的 API 和 CDN
4. 提供了大量客户端 API，使得用户不需要 Node 环境定制源代码，仅通过客户端 JS 也能实现灵活强大的功能
5. 去掉了 [WebsiteAsteroids](http://www.websiteasteroids.com) 彩蛋，因为几乎没人玩它，且在看板娘中它不会显示帮助信息，也没人知道怎么操作

你可以查看示例网页：[Demo](https://samunatsu.github.io/live2d-widget-enhanced/)

## 最简使用 - CDN

在 HTML 页面的 `head` 或 `body` 元素中插入以下代码即可加载看板娘：

```html
<script src="https://fastly.jsdelivr.net/gh/samunatsu/live2d-widget-enhanced@latest/dist/autoload.min.js"></script>
```

如果您的站点使用了 PJAX 等技术，由于看板娘不需要刷新，所以您需要将这段代码 **放到刷新区域之外** 以免重复执行。

使用该方法将使用我们提供的默认参数来加载看板娘，虽然无脑，但是你几乎没有调整和配置空间，且考虑到 jsdelivr 在中国大陆的访问不稳定，您的看板娘组件加载可能很慢。

## 最简使用 - 自机部署

1. 将仓库中 `dist` 文件夹放到您的站点目录里，你可以随意给它改名
2. 将 [最简使用 - CDN](#最简使用---cdn) 中的代码修改成：

```html
<script src="<URL>/autoload.min.js"></script>
```

其中 `URL` 替换为你的站点中的对应路径，你需要保证 `<URL>/autoload.min.js` 可以访问到你所部署的 `autoload.min.js`。

3. 其余操作和注意事项与 [最简使用 - CDN](#最简使用---cdn) 一致

## 自定义配置使用

由于最简方法使用的配置您几乎不能修改，所以我们更推荐您使用自定义配置。

您需要先加载核心 JS 库，可以选择使用 CDN 加载：

```html
<script src="https://fastly.jsdelivr.net/gh/samunatsu/live2d-widget-enhanced@latest/dist/core.min.js"></script>
```

也可以使用自机部署加载，详细操作和 [最简使用 - 自机部署](#最简使用---自机部署) 类似：

```html
<script src="<URL>/core.min.js"></script>
```

核心加载完成后，你只需要使用如下代码就可以配置并启动看板娘了：

```js
// const opt = {...}

l2dwe.init(opt);
```

其中 `opt` 为启动配置对象，参数如下：

|选项|类型|默认值|说明|
|:---|:---:|:---:|:---|
|`api`|`IApi`|`l2dwe.ApiFactory.default()`|API 接口对象|
|`target`|`string`|-|一个选择器字符串，指定组件将要替换的元素。若不指定则组件将注入到 `body` 元素中|
|`tips`|`string\|object`|-|`waifu-tips.json` 文件路径。若提供的是一个对象，则直接使用该对象作为 `waifu-tips.json` 内容|

## 以下是原始 README.md

## 配置

你可以对照 `autoload.js` 的源码查看可选的配置项目。`autoload.js` 会自动加载三个文件：`waifu.css`，`live2d.min.js` 和 `waifu-tips.js`。`waifu-tips.js` 会创建 `initWidget` 函数，这就是加载看板娘的主函数。`initWidget` 函数接收一个 Object 类型的参数，作为看板娘的配置。以下是配置选项：

| 选项 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| `waifuPath` | `string` | `https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.json` | 看板娘资源路径，可自行修改 |
| `apiPath` | `string` | `https://live2d.fghrsh.net/api/` | API 路径，可选参数 |
| `cdnPath` | `string` | `https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/` | CDN 路径，可选参数 |
| `tools` | `string[]` | 见 `autoload.js` | 加载的小工具按钮，可选参数 |

其中，`apiPath` 和 `cdnPath` 两个参数设置其中一项即可。`apiPath` 是后端 API 的 URL，可以自行搭建，并增加模型（需要修改的内容比较多，此处不再赘述），可以参考 [live2d_api](https://github.com/fghrsh/live2d_api)。而 `cdnPath` 则是通过 jsDelivr 这样的 CDN 服务加载资源，更加稳定。

## 自定义

如果以上「配置」部分提供的选项还不足以满足你的需求，那么你可以自己进行修改。本仓库的目录结构如下：

- `src/waifu-tips.js` 包含了按钮和对话框的逻辑；
- `waifu-tips.js` 是由 `src/waifu-tips.js` 自动打包生成的，不建议直接修改；
- `waifu-tips.json` 中定义了触发条件（`selector`，CSS 选择器）和触发时显示的文字（`text`）；
- `waifu.css` 是看板娘的样式表。

`waifu-tips.json` 中默认的 CSS 选择器规则是对 Hexo 的 [NexT 主题](http://github.com/next-theme/hexo-theme-next) 有效的，为了适用于你自己的网页，可能需要自行修改，或增加新内容。  
**警告：`waifu-tips.json` 中的内容可能不适合所有年龄段，或不宜在工作期间访问。在使用时，请自行确保它们是合适的。**

要在本地部署本项目的开发测试环境，你需要安装 Node.js 和 npm，然后执行以下命令：

```bash
git clone https://github.com/stevenjoezhang/live2d-widget.git
npm install
npm run build
```

如果有任何疑问，欢迎提 Issue。如果有任何修改建议，欢迎提 Pull Request。

## 鸣谢

感谢 [live2d-widget](https://github.com/stevenjoezhang/live2d-widget/blob/master/src/model.js) 作为本项目的基础

感谢 [jsDelivr](https://www.jsdelivr.com) 提供的 CDN 服务。

感谢 [一言](https://hitokoto.cn) 提供的语句接口。

## 许可证

本项目使用 GPL 3.0 开源许可：  
http://www.gnu.org/licenses/gpl-3.0.html

Live2D 官方网站：  
https://www.live2d.com/en/  

Live2D 官方仓库：  
https://live2d.github.io

Live2D Cubism Core 基于协议 Live2D Proprietary Software License 提供：
https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html

Live2D Cubism Components 基于协议 Live2D Open Software License 提供： 
http://www.live2d.com/eula/live2d-open-software-license-agreement_en.html

Live2D 相关条款确实禁止修改，但是对 `live2d.min.js` 的混淆不会视为非法修改：
https://community.live2d.com/discussion/140/webgl-developer-licence-and-javascript-question

**本仓库并不包含任何模型，用作展示的所有 Live2D 模型、图片、动作数据等版权均属于其原作者，仅供研究学习，不得用于商业用途。**
