# Beautiful Player

![Beautiful Player screenshot](https://github.com/samuelrms/beautiful-player/blob/main/docs/photo_demo.png?raw=true)

![Beautiful Player demo](https://github.com/samuelrms/beautiful-player/blob/main/docs/video_demo.gif?raw=true)

---

[![npm](https://img.shields.io/npm/v/beautiful-player?color=%23222375)](https://www.npmjs.com/package/beautiful-player)
Custom-made **audio player** delivered as a **Web Component** with first-class wrappers for **React**, **Vue 3** and **Angular**.

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

## 4 · Common Props (Wrappers)

All wrappers (React, Vue, Angular) accept the same set of props/attributes. Only the syntax changes according to the framework.

| Prop         | Type                                 | Default      | Description / Example |
|--------------|--------------------------------------|--------------|----------------------|
| `src`        | string                               | —            | Audio URL (required) |
| `type`       | string                               | —            | MIME hint, e.g. `audio/ogg` |
| `speeds`     | number[]                             | `[1,1.5,2]`  | Playback rates: `[1,1.25,1.5]` |
| `autoplay`   | boolean                              | `false`      | Start playback on load |
| `primaryColor` | string                             | `#222375`    | Brand color (background) |
| `iconColor`  | string                               | `--primary`  | Icon/text color |
| `iconSize`   | number \| string                    | `48`         | Icon/button size (px/rem) |
| `width`/`height` | number \| string                 | —            | Player box size |
| `hideButtons`| `{ speed?, volume?, download? }`     | —            | Hide controls |
| `icons`      | `{ play?, pause?, download?, volumeMute?, ... }` | built-in SVGs | Custom icons (SVG, string, or imported) |
| `tooltips`   | boolean \| object                   | `true`       | `false` disables, object allows per-button (text, HTML, React element, HTMLElement, or function) |
| `onDownload` | function                             | —            | Receives `CustomEvent<{url:string}>` |
| Any native audio prop | —                           | —            | e.g. `controls`, `loop`, `preload` |

**Example (React):**

```tsx
<BeautifulAudio
  src="song.mp3"
  speeds={[1, 1.25, 1.5]}
  type="audio/ogg"
  primaryColor="#222375"
  iconColor="#ff006e"
  iconSize={40}
  width={400}
  height={80}
  hideButtons={{ volume: true }}
  icons={{ play: <MyPlayIcon />, pause: '<svg>...</svg>', download: '⬇' }}
  tooltips={{ play: <strong>Play</strong>, download: 'Save file', volume: () => <span>🔊</span> }}
  controls
  preload="auto"
  onDownload={e => console.log(e.detail.url)}
/>
```

**Example (Vue):**

```vue
<BeautifulAudio
  src="song.mp3"
  :speeds="[1,1.5,2]"
  icon-color="#ff006e"
  icon-size="40"
  :icons="{ play: '<svg>...</svg>' }"
  :tooltips="{ volume: 'Volume', download: '<em>Salvar</em>' }"
  controls
  preload="auto"
  @download="handleDl"
/>
```

**Example (Angular):**

```html
<beautiful-audio
  src="song.mp3"
  icon-size="40"
  icon-color="#ff006e"
  tooltips='{"download":"Save"}'
  hide-speed
  controls
  preload="auto"
  (download)="onDl($event)"></beautiful-audio>
```

**Notes:**

- All wrappers forward any unknown prop/attribute to the underlying `<audio>` element.
- You can use any SVG, string, or imported icon for the `icons` prop.
- Tooltips accept text, HTML, React/Vue elements, HTMLElements, or functions returning any of these.
- For advanced theming, use CSS variables (`--primary`, `--icon-color`, `--btn-size`) or `::part` selectors (coming soon).

## 🤝 Contributing

All contributions are welcome — from bug reports and feature requests to pull requests or documentation improvements!

**How to contribute:**

- **Open an issue:** Found a bug, have a question, or want to suggest a feature? [Open an issue](../../issues).
- **Fork & PR:** Fork the repo, create a branch, and submit a pull request. We review quickly!
- **Improve docs:** Even typo fixes or better examples are valuable.
- **Show your work:** Share your use case or integration in Discussions or via an issue.

**Where to find us:**

- **NPM profile:** [samuelramos.dev on npm](https://www.npmjs.com/settings/samuelramos.dev/profile)
- **GitHub:** [github.com/samuelrms/beautiful-player](https://github.com/samuelrms/beautiful-player)

**Why contribute?**

- Help shape a modern, framework-agnostic audio player for everyone.
- Get your name in the contributors list.
- Make open source better for the next dev!
