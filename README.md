# Live2D Widget Enhanced

![](https://forthebadge.com/images/badges/made-with-typescript.svg)
![](https://forthebadge.com/images/badges/built-with-love.svg)
![](https://forthebadge.com/images/badges/uses-html.svg)
![](https://forthebadge.com/images/badges/ctrl-c-ctrl-v.svg)

基于 [live2d-widget](https://github.com/stevenjoezhang/live2d-widget) 修改的加强版看板娘 Web 组件

## 特性

1. 完全使用 TypeScript 编写，便于开发与维护
2. 将模型加载 API 抽象成接口，使得用户可以自行实现和适配，而不需要严格遵守 FGHRSH 的 API 和 CDN 部署规范
3. 兼容 FGHRSH 提供的 API 和 CDN
4. 简化了组件定制，可以通过传入简单的配置对象来配置组件
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
|`api`|`IApi`|-|API 接口对象|
|`defaultModel`|`number`|`0`|默认模型 ID|
|`defaultTexture`|`number`|`0`|默认贴图 ID|
|`resource`|`?(string\|object)`|-|组件资源目录|
|`target`|`?(string\|object)`|-|组件注入目标位置|
|`titleSeparator`|`(title: string) => string`|`(title) => title.split(' - ')[0]`|标题处理器|
|`tools`|`?object`|-|自定义组件工具栏|

### API 接口对象

核心提供了 PHP 风格的 API 对象封装以及 CDN 风格的 API 对象封装，你可以通过如下代码来创建对象：

```js
// PHP API
new l2dwe.RemoteApi('https://live2d.fghrsh.net/api');

// CDN API
new l2dwe.RemoteCdn('https://fastly.jsdelivr.net/gh/fghrsh/live2d_api');
```

如果使用以上两种 API 对象，则请删掉在 URL 末尾的 `/`。

如果你想使用自己的风格 API，那么可以参考 [interface.ts](./src/api/interface.ts) 接口定义来编写。

### 组件资源目录

组件资源目录配置可以接受一个字符串或者一个对象或者 `undefined`。

若配置为 `undefined`，则以相对于核心 JS 库的位置加载组件资源，假设你的核心 JS 库从以下位置加载，则将自动加载同目录下的资源：

```txt
-+- core.min.js
 +- live2d.min.js
 +- waifu.css
 `- waifu-tips.json
```

若配置为字符串，则从字符串所示的 URL 目录处加载组件资源，假设你提供了一个 URL 为 `https://cdn.example.com`，则将加载如下链接的资源：

```txt
https://cdn.example.com/live2d.min.js
https://cdn.example.com/waifu.css
https://cdn.example.com/waifu-tips.json
```

若配置为对象，则可以进一步细致定义组件资源来源：

```ts
resources: {
  css?: string;
  live2d?: string;
  tips?: string | Tips;
};
```

对于这三个子配置，你可以传入字符串 URL 或者 `undefined`，代表的含义和上面的两种加载方法相同。

对于 `tips` 配置，你还可以手动传入一个 `Tips` 对象来代替外部资源引入。

### 组件注入目标位置

组件注入目标位置可以接受一个字符串或者一个对象或者 `undefined`。

若配置为 `undefined`，则 HTML 组件将被注入到 `body` 元素内部末尾，脚本和 CSS 将被注入到 `head` 元素末尾。

若配置为字符串，则将其认为是一个 CSS 选择器，组件将被注入到该选择器指向的元素内部末尾。

若配置为对象，则可以进一步细致定义组件注入目标位置：

```ts
target: {
  css?: string;
  live2d?: string;
  toggle?: string;
  waifu?: string;
};
```

对于这四个子配置，你可以传入字符串选择器或者 `undefined`，代表的含义和上面的两种加载方法相同。

其中 `css` 为组件的 CSS，`live2d` 为 Live2D 核心脚本语句， `toggle` 为切换组件显示的侧边小按钮，`waifu` 为看板娘本体。

### 标题处理器

你可以提供一个标题处理器来将 `document.title` 获得的标题处理成文章名字。

默认情况下使用的标题处理器可以用于格式为 `%文章名% - %站点名%` 的站点：

```js
(title) => title.split(' - ')[0]
```

假如你的标题格式是 `%文章名% | %站点名%`，那么你需要提供如下自定义处理器来获取文章名：

```js
(title) => title.split(' | ')[0]
```

### 自定义组件工具栏

与 [live2d-widget](https://github.com/stevenjoezhang/live2d-widget) 的自定义组件工具栏类似，通过提供一个对象来将你需要的小工具合并到默认工具栏中。

一个小例子：

```js
{
  test: {
    icon: '<svg>...</svg>',
    callback: (): void => {
      console.log('test');
    }
  }
}
```

你需要给你的自定义工具提供一个 SVG 图标字符串和一个回调函数。

### Waifu Tips 扩展内容

为了功能的需要，l2dwe 对 `waifu-tips.json` 的格式进行了拓展，可以兼容原 `waifu-tips.json` 的格式。

具体的来讲，是将 `click` 和 `mouseover` 两个事件选择器定义中增加了 `subselector` 这个选项：

```ts
export interface Tips {
  click: {
    selector: string;
    subselector?: string;  // New
    text: string | string[];
  }[];
  mouseover: {
    selector: string;
    subselector?: string;  // New
    text: string | string[];
  }[];
  message: {
    console: string | string[];
    copy: string | string[];
    default: string | string[];
    visibilitychange: string | string[];
  };
  seasons: {
    date: string;
    text: string | string[];
  }[];
  time: {
    hour: string;
    text: string | string[];
  }[];
}
```

有时候只使用 `selector` 获取元素的 `innerText` 可能会把元素子元素中你不想一起显示的内容一起输出，如：

```html
<div class="text">
  <span>Test</span>
  <svg>...</svg>
</div>
```

当你想将整个 `.text` 元素作为触发器时，内部的部分 SVG 代码也会被输出。

通过 `subselector` 你可以进一步指定你需要获取到的 `innerText` 来自哪个子元素。

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

感谢 [live2d-widget](https://github.com/stevenjoezhang/live2d-widget) 作为本项目的基础

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
