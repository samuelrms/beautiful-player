import { downloadSvg, pauseSvg, playSvg } from '../icons/general';
import { volumeHighSvg, volumeLowSvg, volumeMediumSvg, volumeMuteSvg } from '../icons/volume';
import { initPlayer } from './logic';
import css from './styles.css';

export interface AudioPlayerOptions {
  /**
   * Audio source URL
   * @example
   * ```html
   * <beautiful-audio src="https://example.com/audio.mp3" />
   * ```
   */
  src: string;
  /**
   * Available speed values
   * @example
   * ```html
   * <beautiful-audio speeds="1,1.5,2" />
   * ```
   */
  speeds?: number[];
  /** 
   * Maximum volume value
   * @example
   * ```html
   * <beautiful-audio max-volume="1" />
   * ```
   */
  maxVolume?: number;
  /**
   * Custom icons
   * @example
   * ```html
   * <beautiful-audio icons="play: '▶', pause: '⏸', download: '⬇'" />
   * ```
   */
  icons?: Partial<{
    play: string;
    pause: string;
    download: string;
    volumeMute: string;
    volumeLow: string;
    volumeMedium: string;
    volumeHigh: string;
  }>;
  /**
   * Show tooltips for buttons
   * @example
   * ```html
   * <beautiful-audio tooltips />
   * ```
   * @example
   * ```html  
   * <beautiful-audio tooltips='{"play":"<em>Play</em>", "download":"<strong>Save</strong>"}' />
   * ```
   */
  tooltips?: boolean | Partial<{ play: TooltipContent; speed: TooltipContent; volume: TooltipContent; download: TooltipContent }>;
  /**
   * Autoplay the audio
   * @example
   * ```html
   * <beautiful-audio autoplay />
   * ```
   */
  autoplay?: boolean;
  /**
   * Hide buttons
   * @example
   * ```html
   * <beautiful-audio hide-buttons="speed,volume" />
   * ```
   */
  hideButtons?: Partial<{
    speed: boolean;
    volume: boolean;
    download: boolean;
  }>;
  /**
   * Primary color for the player
   * @example
   * ```html
   * <beautiful-audio primary-color="#ff006e" />
   * ```
   */
  primaryColor?: string;
  /**
   * Audio source MIME type, e.g.: "audio/ogg"
   * @example
   * ```html
   * <beautiful-audio type="audio/ogg" />
   * ```
   */
  type?: string;
  /**
   * crossOrigin attribute value for the <audio> element ("anonymous" or "use-credentials")
   * @example
   * ```html
   * <beautiful-audio crossorigin="anonymous" />
   * ```
   */
  crossOrigin?: '' | 'anonymous' | 'use-credentials';
  /**
   * Base size (width/height) for control buttons, ex.: 40, "40px", "2.5rem"
   * @example
   * ```html
   * <beautiful-audio icon-size="40" />
   * ```
   */
  iconSize?: number | string;
  /** 
   * Player explicit width (CSS length)
   * @example
   * ```html
   * <beautiful-audio width="100px" />
   * ```
   */
  width?: number | string;
  /** 
   * Player explicit height (CSS length)
   * @example
   * ```html
   * <beautiful-audio height="100px" />
   * ```
   */
  height?: number | string;
  /** 
   * Color for button icons/text
   * @example
   * ```html
   * <beautiful-audio icon-color="#ff006e" />
   * ```
   */
  iconColor?: string;
}

type TooltipContent = string | HTMLElement | (() => string | HTMLElement);

const DEFAULT_ICONS = {
  play: playSvg,
  pause: pauseSvg,
  download: downloadSvg,
  volumeMute: volumeMuteSvg,
  volumeLow: volumeLowSvg,
  volumeMedium: volumeMediumSvg,
  volumeHigh: volumeHighSvg
};

function html(strings: TemplateStringsArray, ...values: any[]) {
  return strings
    .map((s, i) => `${s}${values[i] || ''}`)
    .join('');
}

/**
 * Creates and attaches the player to the provided container and returns a simple API.
 */
export function createAudioPlayer(container: HTMLElement, opts: AudioPlayerOptions) {
  const doc = container.ownerDocument;
  container.innerHTML = '';

  const wrapper = doc.createElement('div');
  wrapper.className = 'bfp-player';
  wrapper.innerHTML = `<audio preload="metadata" ${opts.autoplay ? 'autoplay' : ''} ${opts.crossOrigin !== undefined ? `crossorigin="${opts.crossOrigin}"` : ''}>
      <source src="${opts.src}" ${opts.type ? `type="${opts.type}"` : ''} />
    </audio>`;
  container.appendChild(wrapper);
  // TODO: add full HTML + CSS logic and listeners reusing existing code

  return {
    play() { (wrapper.querySelector('audio') as HTMLAudioElement).play(); },
    pause() { (wrapper.querySelector('audio') as HTMLAudioElement).pause(); }
  };
}

// We also export a Web Component class for anyone who prefers using a custom tag.
export class AudioPlayer extends HTMLElement {
  private opts!: AudioPlayerOptions;
  private shadow!: ShadowRoot;
  private audio!: HTMLAudioElement; // retained for future methods but not used directly
  private _audioAttrs = '';

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadow = this.shadowRoot as ShadowRoot;
  }

  connectedCallback() {
    const src = this.getAttribute('src') || '';
    const speedsAttr = this.getAttribute('speeds');
    const mimeTypeAttr = this.getAttribute('type') || this.getAttribute('mime-type');
    const crossAttr = this.getAttribute('crossorigin') as '' | 'anonymous' | 'use-credentials' | null;
    const iconSizeAttr = this.getAttribute('icon-size');
    const widthAttr = this.getAttribute('width');
    const heightAttr = this.getAttribute('height');
    const iconColorAttr = this.getAttribute('icon-color');
    const speeds = speedsAttr ? speedsAttr.split(',').map(Number) : [1, 1.5, 2];

    // custom icons via attributes
    const iconPlay = this.getAttribute('icon-play');
    const iconPause = this.getAttribute('icon-pause');
    const iconDownload = this.getAttribute('icon-download');
    const customIcons: Partial<{ play: string; pause: string; download: string }> = {};
    if (iconPlay) customIcons.play = iconPlay;
    if (iconPause) customIcons.pause = iconPause;
    if (iconDownload) customIcons.download = iconDownload;

    // Parse hide button attributes (e.g.: hide-buttons="speed,volume" or individual attributes)
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

    let tooltipsOpt: any = true;
    const tooltipsAttr = this.getAttribute('tooltips');
    if (tooltipsAttr !== null) {
      if (tooltipsAttr === 'false') tooltipsOpt = false;
      else if (tooltipsAttr.startsWith('{')) {
        try { tooltipsOpt = JSON.parse(tooltipsAttr); } catch { }
      }
    }
    if ((this as any).tooltips !== undefined) {
      tooltipsOpt = (this as any).tooltips;
    }

    this.opts = {
      src,
      speeds,
      autoplay: this.hasAttribute('autoplay'),
      primaryColor: this.getAttribute('primary-color') || undefined,
      hideButtons: hideButtons,
      icons: Object.keys(customIcons).length ? customIcons : undefined,
      type: mimeTypeAttr || undefined,
      crossOrigin: crossAttr || undefined,
      iconSize: iconSizeAttr ? (isNaN(Number(iconSizeAttr)) ? iconSizeAttr : Number(iconSizeAttr)) : undefined,
      width: widthAttr ? (isNaN(Number(widthAttr)) ? widthAttr : Number(widthAttr)) : undefined,
      height: heightAttr ? (isNaN(Number(heightAttr)) ? heightAttr : Number(heightAttr)) : undefined,
      iconColor: iconColorAttr || undefined,
      tooltips: tooltipsOpt
    };

    // Collect attributes to forward to <audio>
    const reserved = new Set([
      'src', 'speeds', 'icon-play', 'icon-pause', 'icon-download', 'hide-buttons', 'hide-speed', 'hide-volume', 'hide-download', 'primary-color', 'type', 'crossorigin', 'autoplay', 'icon-size', 'width', 'height', 'icon-color'
    ]);
    this._audioAttrs = Array.from(this.attributes)
      .filter(a => !reserved.has(a.name))
      .map(a => `${a.name}="${a.value}"`) // escape maybe
      .join(' ');

    this.render();
  }

  private render() {
    const { src, autoplay, width, height } = this.opts;
    const icons = { ...DEFAULT_ICONS, ...this.opts.icons };

    const template = document.createElement('template');
    template.innerHTML = html`
      <style>
        ${css}
        :host {
          --primary: ${this.opts.primaryColor || '#222375'};
          --icon-color: ${this.opts.iconColor || 'var(--primary)'};
          ${this.opts.iconSize ? `--btn-size: ${typeof this.opts.iconSize === 'number' ? `${this.opts.iconSize}px` : this.opts.iconSize};` : ''}
          ${width ? `width: ${typeof width === 'number' ? `${width}px` : width};` : ''}
          ${height ? `height: ${typeof height === 'number' ? `${height}px` : height};` : ''}
        }
      </style>
      <div class="bfp-container">
        <audio ${autoplay ? 'autoplay' : ''} ${this.opts.crossOrigin !== undefined ? `crossorigin="${this.opts.crossOrigin}"` : ''} ${width ? `width="${typeof width === 'number' ? width : width}"` : ''} ${height ? `height="${typeof height === 'number' ? height : height}"` : ''} ${this._audioAttrs}>
          <source src="${src}" ${this.opts.type ? `type="${this.opts.type}"` : ''}>
        </audio>

        <button class="bfp-button" data-role="play" data-tooltip="Play/Pause">${icons.play}</button>

        <div class="bfp-progress">
          <canvas class="bfp-wave"></canvas>
        </div>

        <span class="bfp-current" data-role="current">0:00</span>

        <button class="bfp-button" data-role="speed" data-tooltip="Speed">${this.opts.speeds?.[0] || 1}x</button>

        <div class="bfp-volume-control">
          <button class="bfp-button" data-role="volume" data-tooltip="Volume">${icons.volumeHigh}</button>
          <div class="bfp-volume-card">
            <input type="range" class="bfp-volume-range" data-role="volume-range" min="0" max="1" step="0.01" value="1" />
          </div>
        </div>

        <a class="bfp-button bfp-download" data-role="download" data-tooltip="Download">${icons.download}</a>
      </div>
    `;

    this.shadow.innerHTML = '';
    this.shadow.appendChild(template.content.cloneNode(true));

    this.audio = this.shadow.querySelector('audio') as HTMLAudioElement;

    // Debug: log whether all expected elements exist
    // console.log('Created elements:', {
    //   play: this.shadow.querySelector('[data-role="play"]'),
    //   progress: this.shadow.querySelector('.bfp-progress'),
    //   current: this.shadow.querySelector('[data-role="current"]'),
    //   speed: this.shadow.querySelector('[data-role="speed"]'),
    //   volume: this.shadow.querySelector('[data-role="volume"]'),
    //   download: this.shadow.querySelector('[data-role="download"]')
    // });

    // apply hideButtons by removing elements
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