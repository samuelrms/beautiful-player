# Beautiful Player

[![npm](https://img.shields.io/npm/v/beautiful-player?color=%23222375)](https://www.npmjs.com/package/beautiful-player)  
Player de áudio totalmente customizável distribuído como **Web Component** com wrappers prontos para **React**, **Vue 3** e **Angular**.

> **Roadmap** · próximos módulos  
> • Vídeo player 📹  • Voice recorder 🎙  • Stories/playlist 📚

---

## 1 · Instalação

```bash
npm i beautiful-player
```

Ou via CDN (sem build-step):

```html
<script type="module" src="https://unpkg.com/beautiful-player/dist/beautiful-player.esm.js"></script>
```

---

## 2 · Uso como Web Component

### Exemplo completo

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

### Atributos (HTML)

| Atributo | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `src` | `string` | — | URL do arquivo de áudio |
| `speeds` | `string` | `1,1.5,2` | Velocidades separadas por vírgula |
| `autoplay` | `boolean` | `false` | Reproduz ao carregar |
| `primary-color` | `string` | `#222375` | Cor base do player |
| `hide-buttons` | `string` | — | CSV `speed,volume,download` |
| `hide-speed` / `hide-volume` / `hide-download` | `boolean` | — | Flags individuais de ocultação |
| `icon-play` / `icon-pause` / `icon-download` | `string` | símbolos padrão | Ícones customizados |
| `tooltips` | `boolean` | `true` | Exibe tooltips dos botões |

### Eventos

O elemento propaga todos os eventos nativos do `<audio>` (`play`, `pause`, `ended`, `timeupdate` …).  
Evento extra **`download`**:

```js
document.querySelector('beautiful-audio')
  .addEventListener('download', e => {
    console.log(e.detail.url)   // arquivo clicado
    // e.preventDefault()      // cancela download nativo se quiser
  })
```

---

## 3 · Wrappers Oficiais

| Framework | Importação | Exemplo rápido |
|-----------|------------|----------------|
| **React** | `import { BeautifulAudio } from 'beautiful-player/wrappers/react'` | `<BeautifulAudio src="song.mp3" speeds={[1,1.5,2]} />` |
| **Vue 3** | `import { BeautifulAudio } from 'beautiful-player/wrappers/vue'` | `<BeautifulAudio :src="'song.mp3'" :speeds="[1,1.5,2]" />` |
| **Angular** | `import { BeautifulPlayerModule } from 'beautiful-player/wrappers/beautiful-player.module'` | `<beautiful-audio src="song.mp3"></beautiful-audio>` |

### Props comuns (wrappers)

| Prop | Tipo | Descrição |
|------|------|-----------|
| `src` | `string` | URL do áudio |
| `speeds` | `number[]` | Array de velocidades (o wrapper converte para atributo) |
| `primaryColor` | `string` | Cor primária |
| `hideButtons` | `{ speed? volume? download? }` | Ocultar botões |
| `icons` | `{ play? pause? download? }` | Ícones customizados |
| `onDownload` | `(e: CustomEvent<{url:string}>)` | Callback do evento `download` |
| `autoplay`, `style`, … | Qualquer prop nativa de `<div>` |

---

## 4 · Passo a passo por framework

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
<!-- template -->
<beautiful-audio
  src="song.mp3"
  hide-speed
  (download)="onDl($event)"
></beautiful-audio>
```

```ts
onDl(e: CustomEvent<{url:string}>){ console.log(e.detail.url); }
```

---

## 5 · API de Fábrica JS (opcional)

```ts
import { createAudioPlayer } from 'beautiful-player';

const api = createAudioPlayer(document.querySelector('#box'), {
  src: 'song.mp3',
  speeds: [1,1.5,2],
  hideButtons: { speed:true },
  icons: { play:'▶' },
  onDownload: url => console.log(url)
});
// api.play(), api.pause() disponíveis
```

---

## 6 · Personalização visual

O player usa **CSS Shadow DOM**. Para temas avançados, você pode:

1. Alterar `primary-color` (atributo).  
2. Alterar ícones via atributos ou props.  
3. Sobrepor CSS internos via `::part(*)` (próxima versão) — _em breve_.

---

## 7 · Roadmap

* ✅ Audio player
* ⏳ Video player
* ⏳ Voice recorder
* ⏳ Stories / playlist

Contribuições e sugestões são bem-vindas!
