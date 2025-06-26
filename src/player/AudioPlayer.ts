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

        this.opts = {
            src,
            speeds,
            autoplay: this.hasAttribute('autoplay'),
            primaryColor: this.getAttribute('primary-color') || undefined
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
          --primary: ${this.opts.primaryColor || 'var(--primary, #222375)'};
        }
      </style>
      <div class="bfp-container">
        <audio ${autoplay ? 'autoplay' : ''}>
          <source src="${src}">
        </audio>
        <button class="bfp-button" data-role="play">${icons.play}</button>
        <div class="bfp-progress"><canvas class="bfp-wave"></canvas></div>
        <span class="bfp-time-total" data-role="duration">0:00</span>
      </div>
    `;

        this.shadow.innerHTML = '';
        this.shadow.appendChild(template.content.cloneNode(true));

        this.audio = this.shadow.querySelector('audio') as HTMLAudioElement;
        initPlayer(this.shadow, this.opts);
    }
}

if (!customElements.get('beautiful-audio')) {
    customElements.define('beautiful-audio', AudioPlayer);
} 