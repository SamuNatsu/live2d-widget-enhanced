/// Utils module

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
