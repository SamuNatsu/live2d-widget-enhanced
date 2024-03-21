/// Logger module

export class Logger {
  public static info(msg: string): void {
    console.log(
      `%cL2DWE%c ${msg}`,
      'background:#389ad5;padding:1px 5px;border-radius:3px;color:#fff',
      ''
    );
  }

  public static error(msg: string): void {
    console.log(
      `%cL2DWE%c ${msg}`,
      'background:#ef4041;padding:1px 5px;border-radius:3px;color:#fff',
      ''
    );
  }
}
