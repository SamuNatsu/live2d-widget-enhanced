/// Global type define

// Load Live2D
declare function loadlive2d(canvasId: string, jsonUrl: string): void;

// Live2D framework
declare const Live2D: any;

// Font awesome SVGs
declare module '*.svg' {
  const content: string;
  export default content;
}
