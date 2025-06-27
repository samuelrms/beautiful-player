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

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | string | — | Audio URL |
| `speeds` | string | `1,1.5,2` | Comma-separated playback rates |
| `autoplay` | boolean | `false` | Start on load |
| `primary-color` | string | `#222375` | Brand color |
| `hide-buttons` | string | — | CSV `speed,volume,download` |
| `hide-speed / hide-volume / hide-download` | boolean | — | Individual flags |
| `icon-play / icon-pause / icon-download` | string | defaults | Custom icons |
| `tooltips` | boolean | `true` | Show button tooltips |

### Events

All native `<audio>` events bubble. Extra **`download`** event:

```js
document.querySelector('beautiful-audio')
  .addEventListener('download', e => {
    console.log(e.detail.url)   // audio file
    // e.preventDefault()       // cancel native download
  })
```

---

## 3 · Official wrappers

| Framework | Import | Quick example |
|-----------|--------|---------------|
| **React** | `import { BeautifulAudio } from 'beautiful-player/wrappers/react'` | `<BeautifulAudio src="song.mp3" speeds={[1,1.5,2]} />` |
| **Vue 3** | `import { BeautifulAudio } from 'beautiful-player/wrappers/vue'` | `<BeautifulAudio :src="'song.mp3'" :speeds="[1,1.5,2]" />` |
| **Angular** | `import { BeautifulPlayerModule } from 'beautiful-player/wrappers/beautiful-player.module'` | `<beautiful-audio src="song.mp3"></beautiful-audio>` |

### Common props (wrappers)

| Prop | Type | Description |
|------|------|-------------|
| `src` | string | Audio URL |
| `speeds` | number[] | Array of rates (auto-converted) |
| `primaryColor` | string | Brand color |
| `hideButtons` | object | Hide controls `{ speed?, volume?, download? }` |
| `icons` | object | Custom icons `{ play?, pause?, download? }` |
| `onDownload` | function | Receives `CustomEvent<{url:string}>` |
| Any native div prop (`style`, …) |

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
      icons={{ play:'▶', pause:'⏸', download:'⬇' }}
      hideButtons={{ volume:true }}
      primaryColor="#222375"
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
<beautiful-audio src="song.mp3" hide-speed (download)="onDl($event)"></beautiful-audio>
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
