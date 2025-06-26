// @ts-nocheck
import React, { forwardRef } from "react";
// Web component registration (side-effect)
import "beautiful-player/dist/beautiful-player.esm.js";

// Tipagem básica para atributos do custom element
export interface BeautifulAudioProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  speeds?: string;
  autoplay?: boolean;
  primaryColor?: string;
}

/**
 * React wrapper para o Web Component <beautiful-audio>.
 * Uso:
 *   <BeautifulAudio src="song.mp3" speeds="1,1.5,2" />
 */
export const BeautifulAudio = forwardRef<HTMLElement, BeautifulAudioProps>(
  (props, ref) => {
    const { primaryColor, ...rest } = props as any;
    return React.createElement("beautiful-audio", {
      ...rest,
      ref,
      "primary-color": primaryColor,
    });
  }
);
