/// Remote CDN
import { randExcept } from '../utils';
import { IApi, ModelInfo, TextureInfo } from './interface';

/** Model list */
export type ModelList = {
  models: (string | string[])[];
  messages: string[];
};

/** Remote CDN */
export class RemoteCdn implements IApi {
  private modelList?: ModelList;

  /**
   * Constructor
   *
   * @param cdnUrl CDN Url
   */
  public constructor(private cdnUrl: string) {}

  /**
   * Load model list
   */
  private async loadModelList(): Promise<void> {
    if (this.modelList === undefined) {
      const res: Response = await fetch(`${this.cdnUrl}/model_list.json`);
      this.modelList = await res.json();
    }
  }

  // Implements
  public async get(mid: number, tid: number): Promise<string> {
    await this.loadModelList();

    const target: string =
      this.modelList!.models[mid] instanceof Array
        ? (this.modelList!.models[mid] as string[])[tid]
        : (this.modelList!.models[mid] as string);

    return `${this.cdnUrl}/model/${target}/index.json`;
  }

  public async rand(mid: number): Promise<ModelInfo> {
    await this.loadModelList();
    const index: number = randExcept(0, this.modelList!.models.length, mid);
    return {
      model: {
        id: index,
        message: this.modelList!.messages[index]
      }
    };
  }

  public async switch(mid: number): Promise<ModelInfo> {
    await this.loadModelList();
    const index: number = (mid + 1) % this.modelList!.models.length;
    return {
      model: {
        id: index,
        message: this.modelList!.messages[index]
      }
    };
  }

  public async randTexture(mid: number, tid: number): Promise<TextureInfo> {
    await this.loadModelList();
    return {
      textures: {
        id:
          this.modelList!.models[mid] instanceof Array
            ? randExcept(0, this.modelList!.models[mid].length, tid)
            : 0
      }
    };
  }

  public async switchTexture(mid: number, tid: number): Promise<TextureInfo> {
    await this.loadModelList();
    return {
      textures: {
        id:
          this.modelList!.models[mid] instanceof Array
            ? (tid + 1) % this.modelList!.models[mid].length
            : 0
      }
    };
  }
}
