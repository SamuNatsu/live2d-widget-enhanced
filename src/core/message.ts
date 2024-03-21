/// Message module
import { sample } from '../utils';

/** Timeout ID */
let timeoutId: number | null = null;

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
    sessionStorage.getItem('l2dwe-msg-priority')!
  );
  if (oldPriority > priority) {
    return;
  }

  // Clear timeout
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  // Select text
  const selText: string = Array.isArray(text) ? sample(text) : text;

  // Set priority
  sessionStorage.setItem('l2dwe-msg-priority', priority.toString());

  // Set tip
  const el: HTMLElement = document.querySelector('#waifu-tips')!;
  el.innerHTML = selText;
  el.classList.add('waifu-tips-active');

  // Set duration
  timeoutId = setTimeout((): void => {
    sessionStorage.removeItem('l2dwe-msg-priority');
    el.classList.remove('waifu-tips-active');
  }, duration);
}
