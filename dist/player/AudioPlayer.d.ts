export interface AudioPlayerOptions {
    src: string;
    speeds?: number[];
    maxVolume?: number;
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
/**
 * Cria e anexa o player ao container fornecido e devolve API.
 */
export declare function createAudioPlayer(container: HTMLElement, opts: AudioPlayerOptions): {
    play(): void;
    pause(): void;
};
export declare class AudioPlayer extends HTMLElement {
    private opts;
    private shadow;
    private audio;
    constructor();
    connectedCallback(): void;
    private render;
}
