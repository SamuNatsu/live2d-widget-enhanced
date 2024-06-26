/// Model class
import { IApi, ModelInfo, TextureInfo } from '@api/interface';
import { Logger } from '@core/logger';
import { showMsg } from '@core/message';

/** Model class */
export class Model {
  private static instance?: Model;

  /**
   * Get singleton
   *
   * @param api API interface for constructor
   * @returns Model singleton
   */
  public static getInstance(api?: IApi): Model {
    if (api !== undefined) {
      Model.instance = new Model(api);
      Logger.info('模型单例初始化完毕');
    }
    if (Model.instance === undefined) {
      throw Error('模型单例未初始化');
    }
    return Model.instance;
  }

  /**
   * Constructor
   *
   * @param api API interface
   */
  private constructor(private api: IApi) {}

  /**
   * Load model
   *
   * @param mid Model ID
   * @param tid Texture ID
   * @param msg Tips message
   */
  public async loadModel(
    mid: number,
    tid: number,
    msg?: string
  ): Promise<void> {
    // Set storage
    localStorage.setItem('l2dwe-model-id', mid.toString());
    localStorage.setItem('l2dwe-texture-id', tid.toString());

    // Show message
    if (msg !== undefined) {
      showMsg(msg, 4000, 10);
    }

    // Load model
    loadlive2d('live2d', await this.api.get(mid, tid));
    Logger.info(`模型 ${mid}-${tid} 加载完成`);
  }

  /**
   * Load random model
   */
  public async loadRandModel() {
    // Load storage
    const mid: number = parseInt(localStorage.getItem('l2dwe-model-id')!);

    // Load model info
    const info: ModelInfo = await this.api.rand(mid);

    // Load model
    await this.loadModel(info.model.id, 0, info.model.message);
  }

  /**
   * Load next model
   */
  public async loadNextModel() {
    // Load storage
    const mid: number = parseInt(localStorage.getItem('l2dwe-model-id')!);

    // Load model info
    const info: ModelInfo = await this.api.switch(mid);

    // Load model
    await this.loadModel(info.model.id, 0, info.model.message);
  }

  /**
   * Load random texture
   */
  public async loadRandTexture() {
    // Load storage
    const mid: number = parseInt(localStorage.getItem('l2dwe-model-id')!);
    const tid: number = parseInt(localStorage.getItem('l2dwe-texture-id')!);

    // Load texture info
    const info: TextureInfo = await this.api.randTexture(mid, tid);

    // Load model
    await this.loadModel(
      mid,
      info.textures.id,
      info.textures.id === 0 && tid === 0
        ? '我还没有其他衣服呢！'
        : '我的新衣服好看嘛？'
    );
  }

  /**
   * Load next texture
   */
  public async loadNextTexture() {
    // Load storage
    const mid: number = parseInt(localStorage.getItem('l2dwe-model-id')!);
    const tid: number = parseInt(localStorage.getItem('l2dwe-texture-id')!);

    // Load texture info
    const info: TextureInfo = await this.api.switchTexture(mid, tid);

    // Load model
    await this.loadModel(
      mid,
      info.textures.id,
      info.textures.id === 0 && tid === 0
        ? '我还没有其他衣服呢！'
        : '我的新衣服好看嘛？'
    );
  }
}
