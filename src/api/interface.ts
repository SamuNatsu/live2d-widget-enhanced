/// API interface

/** Model info */
export type ModelInfo = {
  model: {
    id: number;
    message: string;
  };
};

/** Texture info */
export type TextureInfo = {
  textures: {
    id: number;
  };
};

/** API interface */
export interface IApi {
  /**
   * Get model & texture by IDs
   *
   * @param mid Model ID
   * @param tid Texture ID
   * @returns Model JSON file URL
   */
  get(mid: number, tid: number): string | Promise<string>;

  /**
   * Get random model info
   *
   * @param mid Current model ID
   * @returns Model info
   */
  rand(mid: number): ModelInfo | Promise<ModelInfo>;

  /**
   * Get next model info
   *
   * @param mid Current model ID
   * @returns Model info
   */
  switch(mid: number): ModelInfo | Promise<ModelInfo>;

  /**
   * Get random texture info
   *
   * @param mid Current model ID
   * @param tid Current texture ID
   * @returns Texture info
   */
  randTexture(mid: number, tid: number): TextureInfo | Promise<TextureInfo>;

  /**
   * Get next texture info
   *
   * @param mid Current model ID
   * @param tid Current texture ID
   * @returns Texture info
   */
  switchTexture(mid: number, tid: number): TextureInfo | Promise<TextureInfo>;
}
