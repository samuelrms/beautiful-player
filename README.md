# Beautiful Player

![Beautiful Player screenshot](https://github.com/samuelrms/beautiful-player/blob/main/docs/photo_demo.png?raw=true)

![Beautiful Player demo](https://github.com/samuelrms/beautiful-player/blob/main/docs/video_demo.gif?raw=true)

---

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
| `speeds`
