/// Utils module

/**
 * Print pretty log
 *
 * @param msg Log message
 */
export function prettyLog(msg: string): void {
  console.log(
    `%cLive2D%c ${msg}`,
    'background:#389ad5;padding:1px 5px;border-radius:3px;color:#fff',
    ''
  );
}

/**
 * Random select an element from array
 *
 * @param arr Input array
 * @returns Output element
 */
export function sample(arr: any[]): any {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get random integer from range but except one number
 *
 * @param min Min number
 * @param max Max number
 * @param except Except number
 * @returns Random number
 */
export function randExcept(min: number, max: number, except: number): number {
  min = Math.floor(min);
  max = Math.floor(max);
  except = Math.floor(except);

  if (max - min === 1 && except === min) {
    return except;
  }

  while (true) {
    const ret: number = Math.floor(Math.random() * (max - min)) + min;
    if (ret !== except) {
      return ret;
    }
  }
}

/**
 * External resource type
 */
export enum ExternalResourceType {
  Script,
  Style
}

/**
 * Load external resource
 *
 * @param url Resource URL
 * @param type Resource type
 */
export async function loadExternalResource(
  url: string,
  type: ExternalResourceType
): Promise<void> {
  return new Promise((res, rej): void => {
    switch (type) {
      case ExternalResourceType.Script: {
        // Create element
        const el: HTMLScriptElement = document.createElement('script');
        el.src = url;

        // Set callbacks
        el.onload = (): void => res();
        el.onerror = (): void => rej();

        // Add to DOM
        document.head.appendChild(el);
      }
      case ExternalResourceType.Style: {
        // Create element
        const el: HTMLLinkElement = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = url;

        // Set callbacks
        el.onload = (): void => res();
        el.onerror = (): void => rej();

        // Add to DOM
        document.head.append(el);
      }
    }
  });
}
