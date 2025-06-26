// @ts-nocheck
import 'beautiful-player/dist/beautiful-player.esm.js';
import { defineComponent, h } from 'vue';

export const BeautifulAudio = defineComponent({
    name: 'BeautifulAudio',
    props: {
        src: { type: String, required: true },
        speeds: { type: String, default: '1,1.5,2' },
        autoplay: Boolean,
        primaryColor: String
    },
    setup(props, { attrs }) {
        return () =>
            h('beautiful-audio', {
                ...attrs,
                src: props.src,
                speeds: props.speeds,
                autoplay: props.autoplay,
                'primary-color': props.primaryColor
            });
    }
}); 