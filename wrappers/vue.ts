// @ts-nocheck
import 'beautiful-player/dist/beautiful-player.esm.js';
import { defineComponent, h } from 'vue';

export const BeautifulAudio = defineComponent({
    name: 'BeautifulAudio',
    props: {
        /**
         * Audio source URL
         * @example
         * ```html
         * <BeautifulAudio src="https://example.com/audio.mp3" />
         * ```
         */
        src: { type: String, required: true },
        /**
         * Available speed values
         * @example
         * ```html
         * <BeautifulAudio speeds="1,1.5,2" />
         * ```
         */
        speeds: { type: String, default: undefined },
        /**
         * Autoplay the audio
         * @example
         * ```html
         * <BeautifulAudio autoplay />
         * ```
         */
        autoplay: { type: Boolean, default: false },
        /**
         * Primary color for the player
         * @example
         * ```html
         * <BeautifulAudio primaryColor="#ff006e" />
         * ```
         */
        primaryColor: { type: String, default: undefined },
        /**
         * Hide buttons
         * @example
         * ```html
         * <BeautifulAudio hideButtons="speed,volume" />
         * ```
         */
        hideButtons: {
            type: Object as () => { speed?: boolean; volume?: boolean; download?: boolean },
            default: () => ({}),
        },
        /**
         * Audio source MIME type (e.g.: "audio/ogg")
         * @example
         * ```html
         * <BeautifulAudio type="audio/ogg" />
         * ```
         */
        type: { type: String, default: undefined },
        /**
         * crossOrigin attribute value for the <audio> element ("anonymous" or "use-credentials")
         * @example
         * ```html
         * <BeautifulAudio crossorigin="anonymous" />
         * ```
         */
        crossOrigin: { type: String as () => '' | 'anonymous' | 'use-credentials', default: undefined },
        /**
         * Base size (width/height) for control buttons, ex.: 40, "40px", "2.5rem"
         * @example
         * ```html
         * <BeautifulAudio icon-size="40" />
         * ```
         */
        iconSize: { type: [String, Number], default: undefined },
        /**
         * Color for button icons/text
         * @example
         * ```html
         * <BeautifulAudio icon-color="#ff006e" />
         * ```
         */
        iconColor: { type: String, default: undefined },
        /**
         * Tooltips for the player
         * @example
         * ```html
         * <BeautifulAudio tooltips="play: 'Play', speed: 'Speed', volume: 'Volume', download: 'Download'" />
         * ```
         */
        tooltips: { type: [Boolean, Object], default: undefined },
    },
    mounted() {
        const { primaryColor, hideButtons } = this.$props as any;
        if (primaryColor) this.$el.setAttribute('primary-color', primaryColor);

        if (hideButtons) {
            if (hideButtons.speed) this.$el.setAttribute('hide-speed', '');
            if (hideButtons.volume) this.$el.setAttribute('hide-volume', '');
            if (hideButtons.download) this.$el.setAttribute('hide-download', '');
            const list = [
                hideButtons.speed ? 'speed' : null,
                hideButtons.volume ? 'volume' : null,
                hideButtons.download ? 'download' : null,
            ].filter(Boolean).join(',');
            if (list) this.$el.setAttribute('hide-buttons', list);
        }
    },
    render() {
        return h('beautiful-audio', {
            ...this.$attrs,
            src: this.src,
            speeds: this.speeds,
            autoplay: this.autoplay,
            'primary-color': this.primaryColor,
            type: this.type,
            crossorigin: this.crossOrigin,
            'icon-size': this.iconSize,
            'icon-color': this.iconColor,
            tooltips: this.tooltips,
        });
    }
}); 