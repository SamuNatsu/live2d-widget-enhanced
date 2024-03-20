/// Core module
import { IApi } from './api/interface';
import { Model } from './model';
import {
  ExternalResourceType,
  loadExternalResource,
  prettyLog,
  sample
} from './utils';
import { version } from '../package.json';
import { showMsg } from './message';
import { tools } from './tools';

// Types
export type Tips = {
  mouseover: {
    selector: string;
    text: string[];
  }[];
  click: {
    selector: string;
    text: string[];
  }[];
  seasons: {
    date: string;
    text: string[];
  }[];
  time: {
    hour: string;
    text: string;
  }[];
  message: {
    default: string[];
    console: string;
    copy: string;
    visibilitychange: string[];
  };
};
export type WidgetInitOptions = {
  resource?: string;
  api: IApi;
  tips: string | Tips;
  titleSeparator?: string;
  tools?: Record<
    string,
    {
      icon: string;
      callback: Function;
    }
  >;
  defaultModel?: number;
  defaultTexture?: number;
};

/**
 * Initialize widget
 *
 * @param opt Widget initialize options
 */
export async function init(opt: WidgetInitOptions): Promise<void> {
  // Info
  console.log(`
    く__,.ヘヽ.        /  ,ー､ 〉
              ＼ ', !-─‐-i  /  /´
              ／｀ｰ'       L/／｀ヽ､
            /   ／,   /|   ,   ,       ',
          ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
          ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
            !,/7 '0'     ´0iソ|    |
            |.从"    _     ,,,, / |./    |
            ﾚ'| i＞.､,,__  _,.イ /   .i   |
              ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
                | |/i 〈|/   i  ,.ﾍ |  i  |
                .|/ /  ｉ：    ﾍ!    ＼  |
                kヽ>､ﾊ    _,.ﾍ､    /､!
                !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
                ﾚ'ヽL__|___i,___,ンﾚ|ノ
                    ﾄ-,/  |___./
                    'ｰ'    !_,.:
    加强版 Live2D 看板娘组件 | Live2D Widget Enhanced`);
  prettyLog(`Version: ${version}`);
  prettyLog('Github: https://github.com/SamuNatsu/live2d-widget-enhanced');

  // Get resource URL
  const resource: string = ((): string => {
    // If resource given
    if (opt.resource !== undefined) {
      return opt.resource;
    }

    // Parse current resource
    const curUrl: string = (document.currentScript as HTMLScriptElement).src;
    return curUrl.substring(0, curUrl.lastIndexOf('/'));
  })();

  // Load external resources
  await Promise.all([
    loadExternalResource(
      resource + '/live2d.min.js',
      ExternalResourceType.Script
    ),
    loadExternalResource(resource + '/waifu.css', ExternalResourceType.Style)
  ]);

  // Create toggle element
  document.body.insertAdjacentHTML(
    'beforeend',
    '<div id="waifu-toggle"><span>看板娘</span></div>'
  );
  const toggleEl: HTMLDivElement = document.querySelector('#waifu-toggle')!;

  // Set toggle event listeners
  toggleEl.addEventListener('click', (): void => {
    toggleEl.classList.remove('waifu-toggle-active');

    if (toggleEl.getAttribute('first-time')) {
      // If first time toggle
      startup(opt);
      toggleEl.removeAttribute('first-time');
    } else {
      localStorage.removeItem('waifu-display');

      const el: HTMLElement = document.querySelector('#waifu')!;
      el.style.display = '';
      setTimeout((): void => {
        el.style.bottom = '0';
      }, 0);
    }
  });

  // Set first-time attribute
  const lastTime: number = parseInt(
    localStorage.getItem('waifu-display') ?? '0'
  );
  if (Date.now() - lastTime < 86400000) {
    toggleEl.setAttribute('first-time', '');
    setTimeout((): void => {
      toggleEl.classList.add('waifu-toggle-active');
    });
  } else {
    startup(opt);
  }
}

function startup(opt: WidgetInitOptions): void {
  // Create model instance
  const model: Model = new Model(opt.api);

  // Reset storages
  localStorage.removeItem('waifu-display');
  sessionStorage.removeItem('waifu-text');

  // Inject DOM
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="waifu"><div id="waifu-tips"></div><canvas id="live2d" width="800" height="800"></canvas><div id="waifu-tool"></div></div>`
  );
  setTimeout((): void => {
    document.querySelector<HTMLDivElement>('#waifu')!.style.bottom = '0';
  }, 0);

  // Register tools
  if (opt.tools === undefined) {
    opt.tools = tools;
  }
  opt.tools['switch-model'].callback = (): Promise<void> =>
    model.loadNextModel();
  opt.tools['switch-texture'].callback = (): Promise<void> =>
    model.loadNextTexture();
  for (const tool of Object.keys(opt.tools)) {
    const { icon, callback } = opt.tools[tool];
    document
      .querySelector('#waifu-tool')!
      .insertAdjacentHTML(
        'beforeend',
        `<span id="waifu-tool-${tool}">${icon}</span>`
      );
    document
      .querySelector(`#waifu-tool-${tool}`)!
      .addEventListener('click', (): void => callback());
  }

  // Get model ID & texture ID
  const mid: number = parseInt(
    localStorage.getItem('modelId') ?? opt.defaultModel?.toString() ?? '0'
  );
  const tid: number = parseInt(
    localStorage.getItem('modelTexturesId') ??
      opt.defaultTexture?.toString() ??
      '0'
  );

  // Load model
  model.loadModel(mid, tid);

  // Load tips
  if (typeof opt.tips === 'object') {
    regEvListeners(opt, opt.tips);
  } else {
    fetch(opt.tips)
      .then((res: Response): Promise<Tips> => res.json())
      .then((tips: Tips): void => regEvListeners(opt, tips));
  }
}

function regEvListeners(opt: WidgetInitOptions, data: Tips): void {
  // User action detect
  let userAction: boolean = false;
  let userActionTimer: number | null = null;
  let messagePool: string[] = data.message.default;

  window.addEventListener('mousemove', (): void => {
    userAction = true;
  });
  window.addEventListener('keydown', (): void => {
    userAction = true;
  });

  setInterval((): void => {
    if (userAction) {
      userAction = false;
      clearInterval(userActionTimer!);
      userActionTimer = null;
    } else if (userActionTimer === null) {
      userActionTimer = setInterval((): void => {
        showMsg(messagePool, 6000, 9);
      }, 20000);
    }
  });

  // Register mouse over event listener
  let lastHoverElement: string;
  window.addEventListener('mouseover', (ev: MouseEvent): void => {
    const el: HTMLElement = ev.target as HTMLElement;

    for (const { selector, text } of data.mouseover) {
      // If selector not match
      if (el.closest(selector) === null) {
        continue;
      }

      // Check & update last hover element
      if (lastHoverElement === selector) {
        return;
      }
      lastHoverElement = selector;

      // Show message
      let showText: string = sample(text);
      showText = showText.replace('{text}', el.innerText);
      showMsg(showText, 4000, 8);
      return;
    }
  });

  // Register click event lisener
  window.addEventListener('click', (ev: MouseEvent): void => {
    const el: HTMLElement = ev.target as HTMLElement;

    for (const { selector, text } of data.click) {
      // If selector not match
      if (el.closest(selector) === null) {
        continue;
      }

      // Show message
      let showText: string = sample(text);
      showText = showText.replace('{text}', el.innerText);
      showMsg(showText, 4000, 8);
      return;
    }
  });

  // On open console
  const devtools: Function = (): void => {};
  console.log('%c', devtools);
  devtools.toString = (): string => {
    showMsg(data.message.console, 6000, 9);
    return '';
  };

  // On copy
  window.addEventListener('copy', (): void => {
    showMsg(data.message.copy, 6000, 9);
  });

  // On visibility change
  window.addEventListener('visibilitychange', (): void => {
    showMsg(data.message.visibilitychange, 6000, 9);
  });

  // Show basic message
  showMsg(getWelcomeMsg(opt, data.time), 7000, 11);

  // Show season message
  data.seasons.forEach(({ date, text }): void => {
    const now: Date = new Date();
    const after: string = date.split('-')[0];
    const before: string = date.split('-')[1] ?? after;

    if (
      parseInt(after.split('/')[0]) <= now.getMonth() + 1 &&
      now.getMonth() + 1 <= parseInt(before.split('/')[0]) &&
      parseInt(after.split('/')[1]) <= now.getDate() &&
      now.getDate() <= parseInt(before.split('/')[1])
    ) {
      let selText: string = sample(text);
      selText = selText.replace('{year}', now.getFullYear().toString());
      messagePool.push(selText);
    }
  });
}

function getWelcomeMsg(opt: WidgetInitOptions, time: Tips['time']): string {
  // If is index
  if (location.pathname === '/') {
    for (let { hour, text } of time) {
      const now: Date = new Date();
      const after: number = parseInt(hour.split('-')[0]);
      const before: number = parseInt(hour.split('-')[1] ?? after);

      if (after <= now.getHours() && now.getHours() <= before) {
        return text;
      }
    }
  }

  // Basic text
  const text: string = `欢迎阅读<span>「${
    document.title.split(opt.titleSeparator ?? ' - ')[0]
  }」</span>`;

  // If has referer
  if (document.referrer !== '') {
    const referrer: URL = new URL(document.referrer);
    const domain: string = referrer.hostname.split('.')[1];
    const domains: Record<string, string> = {
      baidu: '百度',
      bing: '必应',
      google: '谷歌',
      so: '360 搜索',
      sogou: '搜狗'
    };

    // If referer is host
    if (location.hostname === referrer.hostname) {
      return text;
    }

    // If known domain
    if (domain in domains) {
      return `Hello！来自 <span>${domains[domain]}</span> 的朋友<br>${text}`;
    } else {
      return `Hello！来自 <span>${referrer.hostname}</span> 的朋友<br>${text}`;
    }
  }

  // Fallback
  return text;
}

// Re-export
export * from './api/remote-api';
export * from './api/remote-cdn';
export * from './message';
