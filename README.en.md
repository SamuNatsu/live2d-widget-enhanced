# Live2D Widget Enhanced

[中文](README.md)

![](https://forthebadge.com/images/badges/made-with-typescript.svg)
![](https://forthebadge.com/images/badges/built-with-love.svg)
![](https://forthebadge.com/images/badges/uses-html.svg)
![](https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg)

Enhanced Live2d widget for web modification based on [live2d-widget](https://github.com/stevenjoezhang/live2d-widget/blob/master/src/model.js)

## Features

1. Fully coded in TypeScript, easy for developing and maintaining
2. Provide abstract interface for model loading API, makes you easy to implement, instead of developing under FGHRSH's API and CDN format
3. Fully compatible with API and CDN provided by FGHRSH
4. Simplify widget customization, a configuration object is all
5. Easter egg [WebsiteAsteroids](http://www.websiteasteroids.com) was omitted, because nobody notices it, no help info, and nobody knows how to play

You can check out the demo: [Demo](https://samunatsu.github.io/live2d-widget-enhanced/)

## Simplest usage - CDN

Add codes below into `head` or `body` element: 

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
|`resource`|`?string`|-|组件资源目录，若未指定则以 `core.min.js` 所在目录作为资源目录|
|`api`|`IApi`|-|API 接口对象|
|`tips`|`string\|object`|-|`waifu-tips.json` 文件路径。若提供的是一个对象，则直接使用该对象作为 `waifu-tips.json` 内容|
|`titleSeparator`|`string`|` - `|标题分隔符，用于将文章标题中的站点名称去除，只提取文章标题|
|`tools`|`?object`|-|自定义组件工具栏|
|`defaultModel`|`number`|`0`|默认模型 ID|
|`defaultTexture`|`number`|`0`|默认贴图 ID|

### API 对象

核心提供了 PHP 风格的 API 对象封装以及 CDN 风格的 API 对象封装，你可以通过如下代码来创建对象：

```js
// PHP API
new l2dwe.RemoteApi('https://live2d.fghrsh.net/api');

// CDN API
new l2dwe.RemoteCdn('https://fastly.jsdelivr.net/gh/fghrsh/live2d_api');
```

如果使用以上两种 API 对象，则请删掉在 URL 末尾的 `/`。

如果你想使用自己的风格 API，那么可以参考 [interface.ts](./src/api/interface.ts) 接口定义来编写。

## 更多

更多内容可以参考：  
https://nocilol.me/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02  
https://github.com/xiazeyu/live2d-widget.js  
https://github.com/summerscar/live2dDemo

关于后端 API 模型：  
https://github.com/xiazeyu/live2d-widget-models  
https://github.com/xiaoski/live2d_models_collection

除此之外，还有桌面版本：  
https://github.com/amorist/platelet  
https://github.com/akiroz/Live2D-Widget  
https://github.com/zenghongtu/PPet  
https://github.com/LikeNeko/L2dPetForMac

以及 Wallpaper Engine：  
https://github.com/guansss/nep-live2d

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
