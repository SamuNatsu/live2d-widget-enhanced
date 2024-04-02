/// Tips module
import { inRange, parseDuration, randSelect } from '@/utils';
import { showMsg } from '@core/message';
import { Logger } from '@core/logger';

// Types
export interface Tips {
  click: {
    selector: string;
    subselector?: string;
    text: string | string[];
  }[];
  mouseover: {
    selector: string;
    subselector?: string;
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

/**
 * Register tips event listeners
 *
 * @param tips Tips
 */
export function regTipsEvListeners(tips: Tips): void {
  // Idle message pool
  const idleMsgPool: string[] = Array.isArray(tips.message.default)
    ? tips.message.default
    : [tips.message.default];

  // Append season messages
  tips.seasons.forEach(({ date, text }): void => {
    const now: Date = new Date();
    const [from, to] = parseDuration(date);

    if (
      inRange(now.getMonth() + 1, from[0], to[0]) &&
      inRange(now.getDate(), from[1], to[1])
    ) {
      idleMsgPool.push(
        randSelect(text)
          .replace('{year}', now.getFullYear().toString())
          .replace('{month}', (now.getMonth() + 1).toString())
          .replace('{date}', now.getDate().toString())
      );
    }
  });

  // User action detect
  let userActionDetected: boolean = false;
  let showIdleMsgIntervalId: number | null = null;

  addEventListener('mousemove', (): void => {
    userActionDetected = true;
  });
  addEventListener('keydown', (): void => {
    userActionDetected = true;
  });

  setInterval((): void => {
    // If user has action
    if (userActionDetected) {
      userActionDetected = false;
      clearInterval(showIdleMsgIntervalId!);
      showIdleMsgIntervalId = null;
      return;
    }

    // If show idle message loop not start
    if (showIdleMsgIntervalId === null) {
      showIdleMsgIntervalId = setInterval((): void => {
        showMsg(idleMsgPool, 6000, 9);
      }, 20000);
    }
  }, 1000);

  // Register click event lisener
  addEventListener('click', (ev: MouseEvent): void => {
    const el: HTMLElement = ev.target as HTMLElement;
    for (const { selector, subselector, text } of tips.click) {
      // If selector not match
      if (el.closest(selector) === null) {
        continue;
      }

      // Get replace content
      const elText: string =
        subselector === undefined
          ? el.innerText
          : el.querySelector<HTMLElement>(subselector)!.innerText;

      // Show message
      showMsg(randSelect(text).replace('{text}', elText), 4000, 8);
      return;
    }
  });

  // Register mouse over event listeners
  let delayFlag: boolean = false;

  addEventListener('mouseover', (ev: MouseEvent): void => {
    // If delay flag
    if (delayFlag) {
      return;
    }

    // Find match
    const el: HTMLElement = ev.target as HTMLElement;
    for (const { selector, subselector, text } of tips.mouseover) {
      // If selector not match
      if (el.closest(selector) === null) {
        continue;
      }

      // Get replace content
      const elText: string =
        subselector === undefined
          ? el.innerText
          : el.querySelector<HTMLElement>(subselector)!.innerText;

      // Show message
      showMsg(randSelect(text).replace('{text}', elText), 4000, 8);

      // Set delay
      delayFlag = true;
      setTimeout((): void => {
        delayFlag = false;
      }, 2000);
      return;
    }
  });

  // On open console
  const devtools: Function = (): void => {};
  devtools.toString = (): string => {
    showMsg(tips.message.console, 6000, 9);
    return '';
  };
  Logger.info('注入控制台钩子%c', devtools);

  // On copy
  addEventListener('copy', (): void => {
    showMsg(tips.message.copy, 6000, 9);
  });

  // On visibility change
  addEventListener('visibilitychange', (): void => {
    showMsg(tips.message.visibilitychange, 6000, 9);
  });
}
