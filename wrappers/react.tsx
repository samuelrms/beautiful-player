// @ts-nocheck
import React, { forwardRef } from "react";
// Web component registration (side-effect)
import "beautiful-player/dist/beautiful-player.esm.js";

// Basic typing for custom element attributes
export interface BeautifulAudioProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Audio source URL
   * @example
   * ```html
   * <BeautifulAudio src="https://example.com/audio.mp3" />
   * ```
   */
  src: string;
  /**
   * Available speed values
   * @example
   * ```html
   * <BeautifulAudio speeds="1,1.5,2" />
   * ```
   */
  speeds?: number[];
  /**
   * Autoplay the audio
   * @example
   * ```html
   * <BeautifulAudio autoplay />
   * ```
   */
  autoplay?: boolean;
  /**
   * Primary color for the player
   * @example
   * ```html
   * <BeautifulAudio primaryColor="#ff006e" />
   * ```
   */
  primaryColor?: string;
  /**
   * Hide buttons
   * @example
   * ```html
   * <BeautifulAudio hideButtons="speed,volume" />
   * ```
   */
  hideButtons?: {
    /**
     * Hide speed button
     * @example
     * ```html
     * <BeautifulAudio hideButtons="speed" />
     * ```
     */
    speed?: boolean;
    /**
     * Hide volume button
     * @example
     * ```html
     * <BeautifulAudio hideButtons="volume" />
     * ```
     */
    volume?: boolean;
    /**
     * Hide download button
     * @example
     * ```html
     * <BeautifulAudio hideButtons="download" />
     * ```
     */
    download?: boolean;
  };
  /**
   * Download event handler
   * @example
   * ```html
   * <BeautifulAudio onDownload={(e) => console.log(e.detail.url)} />
   * ```
   */
  onDownload?: (e: CustomEvent<{ url: string }>) => void;
  /**
   * Audio source MIME type (e.g.: "audio/ogg")
   * @example
   * ```html
   * <BeautifulAudio type="audio/ogg" />
   * ```
   */
  type?: string;
  /**
   * Custom icons
   * @example
   * ```html
   * <BeautifulAudio icons="play: '▶', pause: '⏸', download: '⬇'" />
   * ```
   */
  icons?: {
    play?: string;
    pause?: string;
    download?: string;
  };
  /**
   * crossOrigin attribute value for the <audio> element ("anonymous" or "use-credentials")
   * @example
   * ```html
   * <BeautifulAudio crossorigin="anonymous" />
   * ```
   */
  crossOrigin?: "" | "anonymous" | "use-credentials";
  /**
   * Base size (width/height) for control buttons, ex.: 40, "40px", "2.5rem"
   * @example
   * ```html
   * <BeautifulAudio icon-size="40" />
   * ```
   */
  iconSize?: number | string;
  /**
   * Color for button icons/text
   * @example
   * ```html
   * <BeautifulAudio icon-color="#ff006e" />
   * ```
   */
  iconColor?: string;
  /**
   * Tooltips for the player
   * @example
   * ```html
   * <BeautifulAudio tooltips />
   * ```
   */
  tooltips?:
    | boolean
    | { play?: string; speed?: string; volume?: string; download?: string };
}

/**
 * React wrapper for the <beautiful-audio> Web Component.
 * Example:
 *   <BeautifulAudio src="song.mp3" speeds="1,1.5,2" />
 */
export const BeautifulAudio = forwardRef<HTMLElement, BeautifulAudioProps>(
  (props, ref) => {
    const {
      primaryColor,
      hideButtons,
      speeds,
      icons,
      crossOrigin,
      iconSize,
      iconColor,
      tooltips,
      ...rest
    } = props as any;

    // Build attributes to hide buttons as needed
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
      // Strategy: individual attributes (hide-speed, etc.)
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

    if (crossOrigin !== undefined) {
      attrProps.crossorigin = crossOrigin;
    }

    if (iconSize !== undefined) {
      attrProps["icon-size"] = iconSize;
    }

    if (iconColor) {
      attrProps["icon-color"] = iconColor;
    }

    if (tooltips !== undefined) {
      if (typeof tooltips === "boolean") {
        if (!tooltips) attrProps.tooltips = "false";
      } else {
        // assign as property so we can pass React elements/functions
        attrProps.tooltips = tooltips;
      }
    }

    return React.createElement("beautiful-audio", attrProps);
  }
);
