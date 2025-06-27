# Beautiful Player v0.1.5

Reprodutor de áudio inspirado no WhatsApp, fornecido como **Web Component** com wrappers prontos para **React**, **Vue 3** e **Angular**.

---

## 1 · Instalação

```bash
npm i beautiful-player
```

Ou, sem build-step, carregue direto do CDN:

```html
<script type="module" src="https://unpkg.com/beautiful-player/dist/beautiful-player.esm.js"></script>
```

---

## 2 · Uso como Web Component (HTML puro)

```html
<!-- exemplo completo -->
<beautiful-audio
  src="song.mp3"                 
  speeds="1,1.25,1.5"
  primary-color="#ff006e"
  hide-buttons="speed,volume"   
  icon-play="▶" icon-pause="⏸" icon-download="⬇"
  autoplay
></beautiful-audio>
```

Atributos disponíveis:

| Atributo (WC) | Tipo | Padrão | Descrição |
|---------------|------|--------|-----------|
| `src` | `string` | — | Caminho/URL do áudio |
| `speeds` | `string` | `1,1.5,2` | Lista de velocidades separadas por vírgula |
| `autoplay` | `boolean` | `false` | Reproduz ao carregar |
| `primary-color` | `string` | `#222375` | Cor base do player |
| `hide-buttons` | `string` | — | CSV com `speed,volume,download` |
| `hide-speed` / `hide-volume` / `hide-download` | `boolean` | — | Alternativa granular a `hide-buttons` |
| `icon-play` / `icon-pause` / `icon-download` | `string` | (símbolos padrão) | Ícones customizados |

### Eventos nativos + `download`

O elemento propaga todos os eventos do `<audio>` e emite **`download`** ao clicar no botão:

```js
audioEl.addEventListener('download', (e)=>{
  console.log(e.detail.url)       // url do arquivo
  // e.preventDefault()  // cancela o download nativo
})
```

---

## 3 · React

Wrapper tipado em `beautiful-player/wrappers/react`.

```tsx
import { BeautifulAudio } from 'beautiful-player/wrappers/react';

export default function Demo() {
  return (
    <BeautifulAudio
      src="song.mp3"
      speeds={[1,1.25,1.5]}          // ← array (o wrapper converte)
      primaryColor="#222375"
      hideButtons={{ volume:true }}
      icons={{ play:'▶', pause:'⏸', download:'⬇' }}
      autoplay
      onDownload={(e)=>{
        e.preventDefault();          // opcional
        console.log('download', e.detail.url);
      }}
      style={{ width: 340 }}
    />
  );
}
```

Prop-types do wrapper:

```ts
interface BeautifulAudioProps {
  src: string;
  speeds?: number[];          // array!
  autoplay?: boolean;
  primaryColor?: string;
  hideButtons?: { speed?:boolean; volume?:boolean; download?:boolean };
  icons?: { play?:string; pause?:string; download?:string };
  onDownload?: (e: CustomEvent<{url:string}>)=>void;
  ...nativeDivProps
}
```

---

## 4 · Vue 3

```ts
import { BeautifulAudio } from 'beautiful-player/wrappers/vue';
```

```vue
<template>
  <BeautifulAudio
    src="song.mp3"
    :speeds="[1,1.25,1.5]"
    :hideButtons="{ speed:true, download:true }"
    :icons="{ play:'▶' }"
    @download="onDl"
  />
</template>
<script setup lang="ts">
function onDl(e:any){
  // e.preventDefault()
  console.log(e.detail.url)
}
</script>
```

---

## 5 · Angular

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
<!-- app.component.html -->
<beautiful-audio
  src="song.mp3"
  primary-color="#222375"
  hide-speed
  (download)="handleDownload($event)">
</beautiful-audio>
```

```ts
handleDownload(e: CustomEvent<{url:string}>){
  // e.preventDefault();
  console.log(e.detail.url);
}
```

---

## 6 · Factory JS (opcional)

```ts
import { createAudioPlayer } from 'beautiful-player';

createAudioPlayer(document.getElementById('box'), {
  src: 'song.mp3',
  speeds: [1,1.5,2],
  primaryColor: '#ff006e',
  hideButtons: { download: true },
  icons: { play:'▶' },
  tooltips: true,
  maxVolume: 1,
  onDownload: (url)=>console.log(url)
});
```

---

## 7 · Build / Desenvolvimento

```bash
npm i
npm run dev   # rollup ‑w
npm run build # gera dist/
```

Contribuições são bem-vindas!
