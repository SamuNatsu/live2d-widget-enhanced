/// Core module
import { version } from '../../package.json';

import { inRange, parseDuration, randSelect } from '@/utils';
import { Logger } from '@core/logger';
import { showMsg } from '@core/message';
import { Model } from '@core/model';
import { WidgetInitOptions } from '@core/options';
import { Tips, regTipsEvListeners } from '@core/tips';
import { Tool, getDefaultTools } from '@core/tools';

export const init = async (opt: WidgetInitOptions): Promise<void> => {
  // Print welcome
  printWelcome();

  // Inject resources
  await injectResources(opt);

  // Print info
  Logger.info(`Version: ${version}`);
  Logger.info('Github: https://github.com/SamuNatsu/live2d-widget-enhanced');

  // Inject toggle
  injectToggle(opt);
};

function printWelcome(): void {
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
}

async function injectResources(opt: WidgetInitOptions): Promise<void> {
  // Get css path
  const css: string = ((): string => {
    // If resource directory given
    if (typeof opt.resource === 'string') {
      return opt.resource + '/waifu.css';
    }

    // If file path given
    if (
      typeof opt.resource === 'object' &&
      typeof opt.resource.css === 'string'
    ) {
      return opt.resource.css;
    }

    // Use local
    const curUrl: string = (document.currentScript as HTMLScriptElement).src;
    return curUrl.substring(0, curUrl.lastIndexOf('/')) + '/waifu.css';
  })();

  // Get live2d path
  const live2d: string = ((): string => {
    // If resource directory given
    if (typeof opt.resource === 'string') {
      return opt.resource + '/live2d.min.js';
    }

    // If file path given
    if (
      typeof opt.resource === 'object' &&
      typeof opt.resource.live2d === 'string'
    ) {
      return opt.resource.live2d;
    }

    // Use local
    const curUrl: string = (document.currentScript as HTMLScriptElement).src;
    return curUrl.substring(0, curUrl.lastIndexOf('/')) + '/live2d.min.js';
  })();

  // Get css inject target
  const cssTarget: string = ((): string => {
    // If main target given
    if (typeof opt.target === 'string') {
      return opt.target;
    }

    // If css target given
    if (typeof opt.target === 'object' && typeof opt.target.css === 'string') {
      return opt.target.css;
    }

    // Fallback
    return 'head';
  })();

  // Get live2d inject target
  const live2dTarget: string = ((): string => {
    // If main target given
    if (typeof opt.target === 'string') {
      return opt.target;
    }

    // If live2d target given
    if (
      typeof opt.target === 'object' &&
      typeof opt.target.live2d === 'string'
    ) {
      return opt.target.live2d;
    }

    // Fallback
    return 'head';
  })();

  // Inject resources
  await Promise.all([
    new Promise((resolve, reject): void => {
      // Create element
      const el: HTMLLinkElement = document.createElement('link');
      el.href = css;
      el.rel = 'stylesheet';

      // Set callbacks
      el.onload = resolve;
      el.onerror = (ev: string | Event): void => {
        Logger.error('Fail to load style sheet');
        reject(ev);
      };

      // Insert into DOM
      document.querySelector(cssTarget)!.appendChild(el);
    }),
    new Promise((resolve, reject): void => {
      // Create element
      const el: HTMLScriptElement = document.createElement('script');
      el.async = true;
      el.src = live2d;

      // Set callbacks
      el.onload = resolve;
      el.onerror = (ev: string | Event): void => {
        Logger.error('Fail to load live2d core');
        reject(ev);
      };

      // Insert into DOM
      document.querySelector(live2dTarget)!.appendChild(el);
    })
  ]);
}

function injectToggle(opt: WidgetInitOptions): void {
  // Get inject target
  const target: string = ((): string => {
    // If main target given
    if (typeof opt.target === 'string') {
      return opt.target;
    }

    // If toggle target given
    if (
      typeof opt.target === 'object' &&
      typeof opt.target.toggle === 'string'
    ) {
      return opt.target.toggle;
    }

    // Fallback
    return 'body';
  })();

  // Create element
  document
    .querySelector(target)!
    .insertAdjacentHTML(
      'beforeend',
      '<div id="waifu-toggle"><span>看板娘</span></div>'
    );
  const el: HTMLElement = document.querySelector('#waifu-toggle')!;

  // Set click listener
  el.addEventListener('click', (): void => {
    // Deactive element
    el.classList.remove('waifu-toggle-active');

    // Check is first time use
    if (el.getAttribute('first-time') !== null) {
      // Remove first time mark
      el.removeAttribute('fitst-time');

      // Inject waifu
      injectWaifu(opt);
    } else {
      // Clear quit time storage
      localStorage.removeItem('l2dwe-quit-time');

      // Show waifu with transition
      const waifuEl: HTMLElement = document.querySelector('#waifu')!;
      waifuEl.style.display = '';
      setTimeout((): void => {
        waifuEl.style.bottom = '0';
      }, 0);
    }
  });

  // Check first time
  const quitTime: number = parseInt(localStorage.getItem('l2dwe-quit-time')!);
  if (Date.now() - quitTime < 86400000) {
    // Mark as first time
    el.setAttribute('first-time', '');

    // Show toggle
    setTimeout((): void => {
      el.classList.add('waifu-toggle-active');
    });
  } else {
    // Inject waifu
    injectWaifu(opt);
  }
}

function injectWaifu(opt: WidgetInitOptions): void {
  // Create model instance
  const model: Model = Model.getInstance(opt.api);

  // Reset storages
  localStorage.removeItem('l2dwe-quit-time');
  sessionStorage.removeItem('l2dwe-msg-priority');

  // Get inject target
  const target: string = ((): string => {
    // If main target given
    if (typeof opt.target === 'string') {
      return opt.target;
    }

    // If waifu target given
    if (
      typeof opt.target === 'object' &&
      typeof opt.target.waifu === 'string'
    ) {
      return opt.target.waifu;
    }

    // Fallback
    return 'body';
  })();

  // Inject into DOM
  document
    .querySelector(target)!
    .insertAdjacentHTML(
      'beforeend',
      `<div id="waifu"><div id="waifu-tips"></div><canvas id="live2d" width="800" height="800"></canvas><div id="waifu-tool"></div></div>`
    );
  setTimeout((): void => {
    document.querySelector<HTMLElement>('#waifu')!.style.bottom = '0';
  }, 0);

  // Register tools
  registerTools(opt);

  // Get model ID & texture ID
  const mid: number = parseInt(
    localStorage.getItem('l2dwe-model-id') ??
      opt.defaultModel?.toString() ??
      '0'
  );
  const tid: number = parseInt(
    localStorage.getItem('l2dwe-texture-id') ??
      opt.defaultTexture?.toString() ??
      '0'
  );

  // Load model
  model.loadModel(mid, tid);

  // Load tips
  loadTips(opt);
}

function registerTools(opt: WidgetInitOptions): void {
  // Merge tools
  const tools: Record<string, Tool> = getDefaultTools();
  if (opt.tools !== undefined) {
    for (const i of Object.keys(opt.tools)) {
      tools[i] = opt.tools[i];
    }
  }

  // Inject into DOM
  for (const tool of Object.keys(tools)) {
    const { icon, callback } = tools[tool];
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
}

async function loadTips(opt: WidgetInitOptions): Promise<void> {
  // Get tips
  const tips: Tips = await (async (): Promise<Tips> => {
    // If resource directory given
    if (typeof opt.resource === 'string') {
      return fetch(opt.resource + '/waifu-tips.json')
        .then((res: Response): Promise<Tips> => res.json())
        .catch((err: unknown): never => {
          Logger.error('Fail to load tips');
          throw err;
        });
    }

    // If file path given
    if (
      typeof opt.resource === 'object' &&
      typeof opt.resource.tips === 'string'
    ) {
      return fetch(opt.resource.tips)
        .then((res: Response): Promise<Tips> => res.json())
        .catch((err: unknown): never => {
          Logger.error('Fail to load tips');
          throw err;
        });
    }

    // If raw data given
    if (
      typeof opt.resource === 'object' &&
      typeof opt.resource.tips === 'object'
    ) {
      return opt.resource.tips;
    }

    // Use local
    const curUrl: string = (document.currentScript as HTMLScriptElement).src;
    const tipsUrl: string =
      curUrl.substring(0, curUrl.lastIndexOf('/')) + '/waifu-tips.json';
    return fetch(tipsUrl)
      .then((res: Response): Promise<Tips> => res.json())
      .catch((err: unknown): never => {
        Logger.error('Fail to load tips');
        throw err;
      });
  })();

  // Register tips event listeners
  regTipsEvListeners(tips);

  // Show welcome
  showMsg(getWelcomeMsg(opt, tips), 7000, 11);
}

function getWelcomeMsg(opt: WidgetInitOptions, tips: Tips): string {
  // If is index
  if (location.pathname === '/') {
    for (let { hour, text } of tips.time) {
      const now: Date = new Date();
      const [from, to] = parseDuration(hour);

      if (inRange(now.getHours(), from[0], to[0])) {
        return randSelect(text);
      }
    }
  }

  // Title separator
  const separator =
    opt.titleSeparator ?? ((title: string): string => title.split(' - ')[0]);

  // Basic text
  const text: string = `欢迎阅读<span>「${separator(document.title)}」</span>`;

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
export * from '@api/remote-api';
export * from '@api/remote-cdn';
export * from '@core/message';
export * from '@core/model';
