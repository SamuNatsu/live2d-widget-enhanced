/// Tools module
import fa_comment from '@fortawesome/fontawesome-free/svgs/solid/comment.svg';
import fa_user_circle from '@fortawesome/fontawesome-free/svgs/solid/circle-user.svg';
import fa_street_view from '@fortawesome/fontawesome-free/svgs/solid/street-view.svg';
import fa_camera_retro from '@fortawesome/fontawesome-free/svgs/solid/camera-retro.svg';
import fa_info_circle from '@fortawesome/fontawesome-free/svgs/solid/circle-info.svg';
import fa_xmark from '@fortawesome/fontawesome-free/svgs/solid/xmark.svg';

import { showMsg } from './message.js';

/** Show hitokoto */
function showHitokoto(): void {
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

/** Tools */
export const tools: Record<string, { icon: string; callback: Function }> = {
  hitokoto: {
    icon: fa_comment,
    callback: showHitokoto
  },
  'switch-model': {
    icon: fa_user_circle,
    callback: (): void => {}
  },
  'switch-texture': {
    icon: fa_street_view,
    callback: (): void => {}
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
      localStorage.setItem('waifu-display', Date.now().toString());

      // Show message
      showMsg('愿你有一天能与重要的人重逢。', 2000, 11);

      // Hide widget
      const waifuEl: HTMLElement = document.querySelector(
        '#waifu'
      ) as HTMLElement;
      const toggleEl: HTMLElement = document.querySelector(
        '#waifu-toggle'
      ) as HTMLElement;

      waifuEl.style.border = '-500px';
      setTimeout((): void => {
        waifuEl.style.display = 'none';
        toggleEl.classList.add('waifu-toggle-active');
      }, 3000);
    }
  }
};
