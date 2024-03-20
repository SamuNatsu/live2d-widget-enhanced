/// Auto load module
import { RemoteCdn, init } from './core';

// Initialize
init({
  resource:
    'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest',
  api: new RemoteCdn('https://fastly.jsdelivr.net/gh/fghrsh/live2d_api'),
  tips: 'https://fastly.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/waifu-tips.json'
});
