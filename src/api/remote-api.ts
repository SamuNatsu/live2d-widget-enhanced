/// Remote API
import { IApi, ModelInfo, TextureInfo } from '@api/interface';

/** Remote API */
export class RemoteApi implements IApi {
  /** Constructor */
  public constructor(private apiUrl: string) {}

  // Implements
  public get = (mid: number, tid: number): string => {
    return `${this.apiUrl}/get/?id=${mid}-${tid}`;
  };

  public rand = async (mid: number): Promise<ModelInfo> => {
    return fetch(`${this.apiUrl}/rand?id=${mid}`).then(
      (res: Response): Promise<ModelInfo> => res.json()
    );
  };

  public switch = async (mid: number): Promise<ModelInfo> => {
    return fetch(`${this.apiUrl}/switch?id=${mid}`).then(
      (res: Response): Promise<ModelInfo> => res.json()
    );
  };

  public randTexture = async (
    mid: number,
    tid: number
  ): Promise<TextureInfo> => {
    return fetch(`${this.apiUrl}/rand_textures?id=${mid}-${tid}`).then(
      (res: Response): Promise<TextureInfo> => res.json()
    );
  };

  public switchTexture = async (
    mid: number,
    tid: number
  ): Promise<TextureInfo> => {
    return fetch(`${this.apiUrl}/switch_textures?id=${mid}-${tid}`).then(
      (res: Response): Promise<TextureInfo> => res.json()
    );
  };
}
