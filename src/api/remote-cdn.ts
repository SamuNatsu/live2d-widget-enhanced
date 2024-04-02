/// Remote CDN
import { IApi, ModelInfo, TextureInfo } from '@api/interface';

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

  /**
   * Get random integer from range but except one number
   *
   * @param min Min number
   * @param max Max number
   * @param except Except number
   * @returns Random number
   */
  private static randExcept(min: number, max: number, except: number): number {
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

  // Implements
  public get = async (mid: number, tid: number): Promise<string> => {
    await this.loadModelList();

    const target: string =
      this.modelList!.models[mid] instanceof Array
        ? (this.modelList!.models[mid] as string[])[tid]
        : (this.modelList!.models[mid] as string);

    return `${this.cdnUrl}/model/${target}/index.json`;
  };

  public rand = async (mid: number): Promise<ModelInfo> => {
    await this.loadModelList();
    const index: number = RemoteCdn.randExcept(
      0,
      this.modelList!.models.length,
      mid
    );
    return {
      model: {
        id: index,
        message: this.modelList!.messages[index]
      }
    };
  };

  public switch = async (mid: number): Promise<ModelInfo> => {
    await this.loadModelList();
    const index: number = (mid + 1) % this.modelList!.models.length;
    return {
      model: {
        id: index,
        message: this.modelList!.messages[index]
      }
    };
  };

  public randTexture = async (
    mid: number,
    tid: number
  ): Promise<TextureInfo> => {
    await this.loadModelList();
    return {
      textures: {
        id:
          this.modelList!.models[mid] instanceof Array
            ? RemoteCdn.randExcept(0, this.modelList!.models[mid].length, tid)
            : 0
      }
    };
  };

  public switchTexture = async (
    mid: number,
    tid: number
  ): Promise<TextureInfo> => {
    await this.loadModelList();
    return {
      textures: {
        id:
          this.modelList!.models[mid] instanceof Array
            ? (tid + 1) % this.modelList!.models[mid].length
            : 0
      }
    };
  };
}
