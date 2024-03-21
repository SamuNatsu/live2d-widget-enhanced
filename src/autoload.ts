/// Auto load module
import { RemoteCdn, init } from './core';

// Initialize
init({
  api: new RemoteCdn('https://fastly.jsdelivr.net/gh/fghrsh/live2d_api'),
  resource: 'https://fastly.jsdelivr.net/gh/samunatsu/live2d-widget-enhanced@latest/dist'
});
