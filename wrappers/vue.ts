// @ts-nocheck
import 'beautiful-player/dist/beautiful-player.esm.js';
import { defineComponent, h } from 'vue';

export const BeautifulAudio = defineComponent({
    name: 'BeautifulAudio',
    props: {
        src: { type: String, required: true },
        speeds: { type: String, default: undefined },
        autoplay: { type: Boolean, default: false },
        primaryColor: { type: String, default: undefined },
        hideButtons: {
            type: Object as () => { speed?: boolean; volume?: boolean; download?: boolean },
            default: () => ({}),
        },
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
        });
    }
}); 