/// Message module
import { sample } from './utils';

/** Timeout ID */
let timeoutID: number | null = null;

/**
 * Show message
 *
 * @param text Message text
 * @param duration Message duration
 * @param priority Message priority
 */
export function showMsg(
  text: string | string[],
  duration: number,
  priority: number
): void {
  // Check priority
  const oldPriority: number = parseInt(
    sessionStorage.getItem('waifu-text') ?? Number.MIN_SAFE_INTEGER.toString()
  );
  if (oldPriority > priority) {
    return;
  }

  // Clear timeout
  if (timeoutID !== null) {
    clearTimeout(timeoutID);
    timeoutID = null;
  }

  // Select text
  const selText: string = text instanceof Array ? sample(text) : text;

  // Set priority
  sessionStorage.setItem('waifu-text', priority.toString());

  // Set tip
  const el: HTMLElement = document.querySelector('#waifu-tips') as HTMLElement;
  el.innerHTML = selText;
  el.classList.add('waifu-tips-active');

  // Set duration
  timeoutID = setTimeout((): void => {
    sessionStorage.removeItem('waifu-text');
    el.classList.remove('waifu-tips-active');
  }, duration);
}
