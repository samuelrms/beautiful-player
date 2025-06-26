# Beautiful Player

Reprodutor de áudio estilo WhatsApp pronto para uso em qualquer framework via Web Component ou função factory.

## Instalação

```bash
npm i beautiful-player
```

Ou via _unpkg_ direto no navegador:

```html
<script type="module" src="https://unpkg.com/beautiful-player/dist/beautiful-player.esm.js"></script>
```

## Uso rápido (HTML)

```html
<beautiful-audio
  src="sample.mp3"
  speeds="1,1.5,2"
  autoplay
  primary-color="#ff006e"
></beautiful-audio>
```

## Uso em frameworks

### Usando os wrappers prontos

Se preferir componentes idiomáticos, importe o wrapper correspondente:

| Framework | Importação | Exemplo |
|-----------|-----------|---------|
| React     | `import { BeautifulAudio } from 'beautiful-player/wrappers/react';` | `<BeautifulAudio src="song.mp3" speeds="1,1.25,1.5" />` |
| Vue 3     | `import { BeautifulAudio } from 'beautiful-player/wrappers/vue';` | `<BeautifulAudio src="song.mp3" speeds="1,1.25,1.5" />` |
| Angular   | `import { BeautifulPlayerModule } from 'beautiful-player/wrappers/beautiful-player.module';` | `<beautiful-audio src="song.mp3"></beautiful-audio>` |

Os wrappers apenas reexportam o Web Component, mas fornecem tipagem/integração mais confortável em cada ecossistema.

### React (sem wrapper)

```jsx
import 'beautiful-player/dist/beautiful-player.esm.js';

function App() {
  return (
    <beautiful-audio
      src="song.mp3"
      speeds="1,1.5,2"
      style={{ width: 350 }}
    />
  );
}
```

### Vue

```vue
<script setup>
import 'beautiful-player/dist/beautiful-player.esm.js'
</script>

<template>
  <beautiful-audio src="song.mp3" speeds="1,1.25,1.5" />
</template>
```

### Angular

No `app.module.ts` habilite `CUSTOM_ELEMENTS_SCHEMA`:

```ts
import 'beautiful-player/dist/beautiful-player.esm.js';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

Depois use no template:

```html
<beautiful-audio src="song.mp3"></beautiful-audio>
```

## Atributos / Props

| Atributo | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `src` | string | — | caminho do arquivo de áudio |
| `speeds` | string | `1,1.5,2` | lista de velocidades separadas por vírgula |
| `autoplay` | boolean | `false` | inicia a reprodução automaticamente |
| `primary-color` | string | `#222375` | cor base do player |

## Opções JS (factory)

```ts
createAudioPlayer(container, {
  src: 'song.mp3',
  speeds: [1, 1.25, 1.5],
  maxVolume: 1,
  icons: { play: '▶️', pause: '⏸️' },
  tooltips: true,
  hideButtons: { download: true }
})
```

## Eventos

O elemento dispara eventos nativos do `<audio>` (`play`, `pause`, `ended`, etc.). Ouça normalmente:

```js
document.querySelector('beautiful-audio').addEventListener('play', () => {})
```

## Build & Contribuição

```bash
npm i
npm run dev   # watch
npm run build # gera dist/
```

Pull requests são bem-vindos!
