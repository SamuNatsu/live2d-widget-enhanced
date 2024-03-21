/// Auto load module
import { RemoteCdn, init } from './core';
import { Logger } from './core/logger';

// Check context
function isSupportContext(): boolean {
  const el: HTMLCanvasElement = document.createElement('canvas');
  return el.getContext('2d') !== null;
}

// Initialize
if (screen.width < 768) {
  Logger.info('由于宽度限制，组件已停用');
} else if (!isSupportContext()) {
  Logger.info('由于 Canvas 不支持，组件已停用');
} else {
  init({
    api: new RemoteCdn('https://fastly.jsdelivr.net/gh/fghrsh/live2d_api'),
    resource:
      'https://fastly.jsdelivr.net/gh/samunatsu/live2d-widget-enhanced@latest/dist'
  });
}
