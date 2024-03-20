/// Type define

// Load Live2D
declare function loadlive2d(elementId: string, jsonUrl: string): void;

// Live2D framework
declare const Live2D: any;

// Font awesome types
declare module '*.svg' {
  const content: string;
  export default content;
}