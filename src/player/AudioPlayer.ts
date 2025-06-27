import { initPlayer } from './logic';
import css from './styles.css';

export interface AudioPlayerOptions {
  src: string;
  speeds?: number[]; // valores disponíveis
  maxVolume?: number; // 0-1
  icons?: Partial<{
    play: string;
    pause: string;
    download: string;
  }>;
  tooltips?: boolean;
  autoplay?: boolean;
  hideButtons?: Partial<{
    speed: boolean;
    volume: boolean;
    download: boolean;
  }>;
  primaryColor?: string;
}

const DEFAULT_ICONS = {
  play: '►',
  pause: '❚❚',
  download: '⬇'
};

function html(strings: TemplateStringsArray, ...values: any[]) {
  return strings
    .map((s, i) => `${s}${values[i] || ''}`)
    .join('');
}

/**
 * Cria e anexa o player ao container fornecido e devolve API.
 */
export function createAudioPlayer(container: HTMLElement, opts: AudioPlayerOptions) {
  const doc = container.ownerDocument;
  container.innerHTML = '';

  const wrapper = doc.createElement('div');
  wrapper.className = 'bfp-player';
  wrapper.innerHTML = `<audio preload="metadata" ${opts.autoplay ? 'autoplay' : ''}>
      <source src="${opts.src}" />
    </audio>`;
  container.appendChild(wrapper);
  // TODO: adicionar a lógica HTML + CSS e listeners reutilizando código existente

  return {
    play() { (wrapper.querySelector('audio') as HTMLAudioElement).play(); },
    pause() { (wrapper.querySelector('audio') as HTMLAudioElement).pause(); }
  };
}

// Também exportamos classe Web Component para quem preferir tag custom.
export class AudioPlayer extends HTMLElement {
  private opts!: AudioPlayerOptions;
  private shadow!: ShadowRoot;
  private audio!: HTMLAudioElement; // retained for future methods but not used directly

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadow = this.shadowRoot as ShadowRoot;
  }

  connectedCallback() {
    const src = this.getAttribute('src') || '';
    const speedsAttr = this.getAttribute('speeds');
    const speeds = speedsAttr ? speedsAttr.split(',').map(Number) : [1, 1.5, 2];

    // ícones customizados via atributos
    const iconPlay = this.getAttribute('icon-play');
    const iconPause = this.getAttribute('icon-pause');
    const iconDownload = this.getAttribute('icon-download');
    const customIcons: Partial<{ play: string; pause: string; download: string }> = {};
    if (iconPlay) customIcons.play = iconPlay;
    if (iconPause) customIcons.pause = iconPause;
    if (iconDownload) customIcons.download = iconDownload;

    // Parse hide button attributes (ex.: hide-buttons="speed,volume", ou atributos individuais)
    const hideButtons: AudioPlayerOptions['hideButtons'] = {};
    const hideListAttr = this.getAttribute('hide-buttons');
    if (hideListAttr) {
      hideListAttr.split(',').map(s => s.trim()).forEach(k => {
        if (k === 'speed' || k === 'volume' || k === 'download') {
          (hideButtons as any)[k] = true;
        }
      });
    }
    if (this.hasAttribute('hide-speed')) hideButtons.speed = true;
    if (this.hasAttribute('hide-volume')) hideButtons.volume = true;
    if (this.hasAttribute('hide-download')) hideButtons.download = true;

    this.opts = {
      src,
      speeds,
      autoplay: this.hasAttribute('autoplay'),
      primaryColor: this.getAttribute('primary-color') || undefined,
      hideButtons: hideButtons,
      icons: Object.keys(customIcons).length ? customIcons : undefined
    };

    this.render();
  }

  private render() {
    const { src, autoplay } = this.opts;
    const icons = { ...DEFAULT_ICONS, ...this.opts.icons };

    const template = document.createElement('template');
    template.innerHTML = html`
      <style>
        ${css}
        :host {
          --primary: ${this.opts.primaryColor || '#222375'};
        }
      </style>
      <div class="bfp-container">
        <audio ${autoplay ? 'autoplay' : ''}>
          <source src="${src}">
        </audio>

        <button class="bfp-button" data-role="play" data-tooltip="Play/Pause">${icons.play}</button>

        <div class="bfp-progress">
          <canvas class="bfp-wave"></canvas>
        </div>

        <span class="bfp-current" data-role="current">0:00</span>

        <button class="bfp-button" data-role="speed" data-tooltip="Velocidade">${this.opts.speeds?.[0] || 1}x</button>

        <div class="bfp-volume-control">
          <button class="bfp-button" data-role="volume" data-tooltip="Volume">100%</button>
          <div class="bfp-volume-card">
            <input type="range" class="bfp-volume-range" data-role="volume-range" min="0" max="1" step="0.01" value="1" />
          </div>
        </div>

        <a class="bfp-button bfp-download" data-role="download" data-tooltip="Baixar">${icons.download}</a>
      </div>
    `;

    this.shadow.innerHTML = '';
    this.shadow.appendChild(template.content.cloneNode(true));

    this.audio = this.shadow.querySelector('audio') as HTMLAudioElement;

    // Debug: verificar se todos os elementos estão presentes
    console.log('Elementos criados:', {
      play: this.shadow.querySelector('[data-role="play"]'),
      progress: this.shadow.querySelector('.bfp-progress'),
      current: this.shadow.querySelector('[data-role="current"]'),
      speed: this.shadow.querySelector('[data-role="speed"]'),
      volume: this.shadow.querySelector('[data-role="volume"]'),
      download: this.shadow.querySelector('[data-role="download"]')
    });

    // aplica hideButtons removendo elementos
    const { hideButtons } = this.opts;
    if (hideButtons?.speed) this.shadow.querySelector('[data-role="speed"]')?.remove();
    if (hideButtons?.volume) this.shadow.querySelector('[data-role="volume"]')?.remove();
    if (hideButtons?.download) this.shadow.querySelector('[data-role="download"]')?.remove();

    initPlayer(this.shadow, this.opts);
  }
}

if (!customElements.get('beautiful-audio')) {
  customElements.define('beautiful-audio', AudioPlayer);
} 