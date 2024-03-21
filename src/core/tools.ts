/// Tools module
import fa_comment from '@fortawesome/fontawesome-free/svgs/solid/comment.svg';
import fa_user_circle from '@fortawesome/fontawesome-free/svgs/solid/circle-user.svg';
import fa_street_view from '@fortawesome/fontawesome-free/svgs/solid/street-view.svg';
import fa_camera_retro from '@fortawesome/fontawesome-free/svgs/solid/camera-retro.svg';
import fa_info_circle from '@fortawesome/fontawesome-free/svgs/solid/circle-info.svg';
import fa_xmark from '@fortawesome/fontawesome-free/svgs/solid/xmark.svg';

import { showMsg } from './message';
import { Model } from './model';

// Types
export interface Tool {
  icon: string;
  callback: Function;
}

// Defualt tools
const defaultTools: Record<string, Tool> = {
  hitokoto: {
    icon: fa_comment,
    callback: (): void => {
      fetch('https://v1.hitokoto.cn')
        .then((res: Response): Promise<any> => res.json())
        .then((ret: any): void => {
          const text: string = `这句一言来自 <span>「${ret.from}」</span>，是 <span>${ret.creator}</span> 在 hitokoto.cn 投稿的。`;

          showMsg(ret.hitokoto, 6000, 9);
          setTimeout((): void => {
            showMsg(text, 4000, 9);
          }, 6000);
        });
    }
  },
  'switch-model': {
    icon: fa_user_circle,
    callback: (): void => {
      Model.getInstance().loadNextModel();
    }
  },
  'switch-texture': {
    icon: fa_street_view,
    callback: (): void => {
      Model.getInstance().loadNextTexture();
    }
  },
  photo: {
    icon: fa_camera_retro,
    callback: (): void => {
      showMsg('照好了嘛，是不是很可爱呢？', 6000, 9);
      Live2D.captureName = 'photo.png';
      Live2D.captureFrame = true;
    }
  },
  info: {
    icon: fa_info_circle,
    callback: (): void => {
      open('https://github.com/SamuNatsu/live2d-widget-enhanced');
    }
  },
  quit: {
    icon: fa_xmark,
    callback: (): void => {
      // Store time
      localStorage.setItem('l2dwe-quit-time', Date.now().toString());

      // Show message
      showMsg('愿你有一天能与重要的人重逢。', 2000, 11);

      // Hide widget
      const waifuEl: HTMLElement = document.querySelector('#waifu')!;
      const toggleEl: HTMLElement = document.querySelector('#waifu-toggle')!;

      waifuEl.style.border = '-500px';
      setTimeout((): void => {
        waifuEl.style.display = 'none';
        toggleEl.classList.add('waifu-toggle-active');
      }, 3000);
    }
  }
};

// Get default tools
export function getDefaultTools(): Record<string, Tool> {
  const ret: Record<string, Tool> = {};
  for (const i of Object.keys(defaultTools)) {
    ret[i] = { ...defaultTools[i] };
  }
  return ret;
}
