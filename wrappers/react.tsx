// @ts-nocheck
import React, { forwardRef } from "react";
// Web component registration (side-effect)
import "beautiful-player/dist/beautiful-player.esm.js";

// Tipagem básica para atributos do custom element
export interface BeautifulAudioProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  speeds?: number[];
  autoplay?: boolean;
  primaryColor?: string;
  hideButtons?: {
    speed?: boolean;
    volume?: boolean;
    download?: boolean;
  };
  onDownload?: (e: CustomEvent<{ url: string }>) => void;
  icons?: {
    play?: string;
    pause?: string;
    download?: string;
  };
}

/**
 * React wrapper para o Web Component <beautiful-audio>.
 * Uso:
 *   <BeautifulAudio src="song.mp3" speeds="1,1.5,2" />
 */
export const BeautifulAudio = forwardRef<HTMLElement, BeautifulAudioProps>(
  (props, ref) => {
    const { primaryColor, hideButtons, speeds, icons, ...rest } = props as any;

    // Constrói atributos para ocultar botões
    const attrProps: any = {
      ...rest,
      ref,
      "primary-color": primaryColor,
    };

    // speeds array -> attribute string
    if (Array.isArray(speeds)) {
      attrProps.speeds = speeds.join(",");
    } else if (typeof speeds === "string") {
      attrProps.speeds = speeds;
    }

    if (hideButtons) {
      // estratégia: atributos individuais (hide-speed etc.)
      if (hideButtons.speed) attrProps["hide-speed"] = "";
      if (hideButtons.volume) attrProps["hide-volume"] = "";
      if (hideButtons.download) attrProps["hide-download"] = "";
      // também suporta lista única
      const list = [
        hideButtons.speed ? "speed" : null,
        hideButtons.volume ? "volume" : null,
        hideButtons.download ? "download" : null,
      ]
        .filter(Boolean)
        .join(",");
      if (list) attrProps["hide-buttons"] = list;
    }

    // icon attributes
    if (icons) {
      if (icons.play) attrProps["icon-play"] = icons.play;
      if (icons.pause) attrProps["icon-pause"] = icons.pause;
      if (icons.download) attrProps["icon-download"] = icons.download;
    }

    return React.createElement("beautiful-audio", attrProps);
  }
);
