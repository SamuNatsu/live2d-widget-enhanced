/// Options module
import { IApi } from '@api/interface';
import { Tips } from '@core/tips';
import { Tool } from '@core/tools';

// Types
export interface WidgetInitOptions {
  api: IApi;
  defaultModel?: number;
  defaultTexture?: number;
  resource?:
    | string
    | {
        css?: string;
        live2d?: string;
        tips?: string | Tips;
      };
  target?:
    | string
    | {
        css?: string;
        live2d?: string;
        toggle?: string;
        waifu?: string;
      };
  titleSeparator?: (title: string) => string;
  tools?: Record<string, Tool>;
}
