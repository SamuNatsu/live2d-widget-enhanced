/// Options module
import { IApi } from '../api/interface';
import { Tool } from './tools';

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

export interface Tips {
  click: {
    selector: string;
    text: string[];
  }[];
  message: {
    console: string;
    copy: string;
    default: string[];
    visibilitychange: string[];
  };
  mouseover: {
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
}
