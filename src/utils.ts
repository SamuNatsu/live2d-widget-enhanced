/// Utils module

/**
 * Random select an element
 *
 * @param obj Input object
 * @returns Random selected element when `obj` is an array, otherwise return back `obj`
 */
export function randSelect<T>(obj: T | T[]): T {
  return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
}

/**
 * Parse date duration from string
 *
 * @param str Duration string
 * @returns From `[0][0]`/`[0][1]` to `[1][0]`/`[1][1]`
 */
export function parseDuration(
  str: string
): [[number, number], [number, number]] {
  const from: string = str.split('-')[0];
  const to: string = str.split('-')[1] ?? from;

  return [
    [parseInt(from.split('/')[0]), parseInt(from.split('/')[1])],
    [parseInt(to.split('/')[0]), parseInt(to.split('/')[1])]
  ];
}

/**
 * Test a value is in given range
 *
 * @param val Value to be tested
 * @param min Min value
 * @param max Max value
 */
export function inRange(val: number, min: number, max: number): boolean {
  return min <= val && val <= max;
}
