# Beautiful Player

[![npm](https://img.shields.io/npm/v/beautiful-player?color=%23222375)](https://www.npmjs.com/package/beautiful-player)
Custom-made WhatsApp-style **audio player** delivered as a **Web Component** with first-class wrappers for **React**, **Vue 3** and **Angular**.

> **Roadmap** · upcoming modules  
> • Video player 📹  • Voice recorder 🎙  • Stories / playlists 📚

---

## 1 · Installation

```bash
npm i beautiful-player
```

CDN (no build-step):

```html
<script type="module" src="https://unpkg.com/beautiful-player/dist/beautiful-player.esm.js"></script>
```

---

## 2 · Web Component usage

### Full example

```html
<beautiful-audio
  src="song.mp3"
  speeds="0.75,1,1.25,1.5"
  primary-color="#ff006e"
  icon-play="▶" icon-pause="⏸" icon-download="⬇"
  hide-buttons="volume"
  autoplay
></beautiful-audio>
```

### Attributes (Web Component)

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | string | — | Audio URL |
| `type` | string | — | MIME hint, e.g. `audio/ogg` |
| `speeds` | string | `1,1.5,2` | Comma-separated playback rates |
| `autoplay` | boolean | `false` | Start playback on load |
| `primary-color` | string | `#222375` | Brand color (background) |
| `icon-size` | string \| number | `48` | Base icon/button size (w = h) |
| `icon-color` | string | `--primary` | Icon/text color |
| `width` / `height` | string \| number | — | Explicit player box size |
| `hide-buttons` | string | — | CSV `speed,volume,download` |
| `hide-speed` / `hide-volume` / `hide-download` | boolean | — | Individual flags |
| `icon-play` / `icon-pause` / `icon-download` | string | built-in SVGs | Override any icon (SVG/text) |
| `tooltips` | boolean \| JSON | `true` | `false` to disable or JSON object to override (HTML allowed) |
| `crossorigin` | "anonymous" \| "use-credentials" | — | Enable CORS for wave visualizer |

### Events

All native `<audio>` events bubble. Extra **`download`** event:

```js
document.querySelector('beautiful-audio')
  .addEventListener('download', e => {
    console.log(e.detail.url)   // audio file
    // e.preventDefault()       // cancel native download
  })
```

#### Custom tooltip example

```html
<beautiful-audio
  src="song.mp3"
  icon-size="40"
  tooltips='{"play":"<strong>Play</strong>","download":"<em>Save file</em>"}'>
</beautiful-audio>
```

---

## 3 · Official wrappers

| Framework | Import | Quick example |
|-----------|--------|---------------|
| **React** | `import { BeautifulAudio } from 'beautiful-player/wrappers/react'` | `<BeautifulAudio src="song.mp3" speeds={[1,1.5,2]} />` |
| **Vue 3** | `import { BeautifulAudio } from 'beautiful-player/wrappers/vue'` | `<BeautifulAudio :src="'song.mp3'" :speeds="[1,1.5,2]" />` |
| **Angular** | `import { BeautifulPlayerModule } from 'beautiful-player/wrappers/beautiful-player.module'` | `<beautiful-audio src="song.mp3"></beautiful-audio>` |

### Common props (wrappers)

| Prop | Type | Notes |
|------|------|-------|
| `src` | string | required |
| `type` | string | MIME hint |
| `speeds` | number[] | `[1,1.5,2]` default |
| `autoplay` | boolean | — |
| `primaryColor` / `iconColor` | string | CSS colors |
| `iconSize` | number \| string | px / rem etc. |
| `width` / `height` | number \| string | player size |
| `hideButtons` | `{ speed?, volume?, download? }` | booleans |
| `icons` | `{ play?, pause?, download?, volumeMute?.. }` | SVG/string |
| `tooltips` | `boolean` \| `{ play?: Tooltip }` | Tooltip can be **React element** / Vue slot / HTMLElement / string |
| `onDownload` | `(e) => void` | CustomEvent detail `{url}` |

---

## 4 · Framework guides

### 4.1 React

```tsx
import { BeautifulAudio } from 'beautiful-player/wrappers/react';

export default function Demo() {
  return (
    <BeautifulAudio
      src="song.mp3"
      speeds={[1,1.25,1.5]}
      primaryColor="#222375"
      iconColor="#ff006e"
      iconSize={40}
      hideButtons={{ volume:true }}
      icons={{ play:'▶', pause:'⏸', download:'⬇' }}
      tooltips={{ play: <strong>Play</strong>, download: 'Save file' }}
      onDownload={e => console.log(e.detail.url)}
    />
  );
}
```

### 4.2 Vue 3 (`script setup`)

```vue
<script setup lang="ts">
import { BeautifulAudio } from 'beautiful-player/wrappers/vue';
function handleDl(e:any){ console.log(e.detail.url) }
</script>

<template>
  <BeautifulAudio
    src="song.mp3"
    :speeds="[1,1.5,2]"
    :hideButtons="{ download:true }"
    :icons="{ play:'▶' }"
    :tooltips="{ volume:'Volume', download:'<em>Save</em>' }"
    @download="handleDl"
  />
</template>
```

### 4.3 Angular

```ts
// app.module.ts
import { BeautifulPlayerModule } from 'beautiful-player/wrappers/beautiful-player.module';
import 'beautiful-player/dist/beautiful-player.esm.js';

@NgModule({
  imports: [BrowserModule, BeautifulPlayerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

```html
<beautiful-audio
  src="song.mp3"
  icon-size="40"
  icon-color="#ff006e"
  tooltips='{"download":"Save"}'
  hide-speed
  (download)="onDl($event)"></beautiful-audio>
```

```ts
onDl(e: CustomEvent<{url:string}>){ console.log(e.detail.url); }
```

---

## 5 · Factory API (optional)

```ts
import { createAudioPlayer } from 'beautiful-player';

const api = createAudioPlayer(document.querySelector('#box'), {
  src: 'song.mp3',
  speeds: [1,1.5,2],
  hideButtons: { speed:true },
  icons: { play:'▶' },
  onDownload: url => console.log(url)
});
// api.play(), api.pause() available
```

---

## 6 · Visual customization

The player lives in **Shadow DOM**. You can:

1. Change `primary-color`.  
2. Swap icons via attributes/props.  
3. Override internals with `::part(*)` (coming soon).

---

## 7 · Roadmap

* ✅ Audio player
* ⏳ Video player
* ⏳ Voice recorder
* ⏳ Stories / playlist

Pull requests & feedback welcome!

## 8 · Why choose **Beautiful Player**?

| Feature | Beautiful Player | Typical audio widgets |
|---------|------------------|-----------------------|
| **Framework-agnostic** | ✅ Web Component + wrappers for React, Vue 3, Angular | ❌ separate builds / rewrites |
| **Styles 100 % encapsulated** | ✅ Shadow DOM (`:host`) — zero leakage | ❌ needs global CSS overrides |
| **Size** | < 15 kB gz (ESM) | 30–100 kB |
| **Customizable icons** | Any SVG / text via props / exported constants | Limited / compile-time only |
| **Dynamic tooltips** | Text, HTML, even React/Vue elements | Rarely supported |
| **Wave visualizer** | ✅ Interactive bars with Web Audio API | Usually absent |
| **TypeScript first** | ✅ Full typings for core + wrappers | Often missing |
| **No external deps** | Only vanilla TS → zero runtime dep | Many pull heavy libs |
| **Accessible** | Keyboard shortcuts, ARIA labels | Not guaranteed |
| **Extensible** | Factory API & CSS variables for theming | Hard-wired UI |

Beautiful Player lets you drop a modern, beautiful audio player in ANY tech stack, skin it with your brand color, swap icons, control every tooltip and still ship a tiny, dependency-free bundle. 🚀

---
