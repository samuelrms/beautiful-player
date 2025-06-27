# Beautiful Player

![Beautiful Player screenshot](https://github.com/samuelrms/beautiful-player/blob/main/docs/photo_demo.png?raw=true)

![Beautiful Player demo](https://github.com/samuelrms/beautiful-player/blob/main/docs/video_demo.gif?raw=true)

---

[![npm](https://img.shields.io/npm/v/beautiful-player?color=%23222375)](https://www.npmjs.com/package/beautiful-player)
Player de áudio customizável, entregue como **Web Component** com wrappers prontos para **React**, **Vue 3** e **Angular**.

> **Roadmap** · próximos módulos  
> • Vídeo player 📹  • Voice recorder 🎙  • Stories/playlist 📚

---

## 1 · Instalação

```bash
npm i beautiful-player
```

CDN (sem build-step):

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

### Atributos (Web Component)

| Atributo | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `src` | string | — | URL do áudio |
| `type` | string | — | MIME hint, ex: `audio/ogg` |
| `speeds` | string | `1,1.5,2` | Velocidades separadas por vírgula |
| `autoplay` | boolean | `false` | Reproduz ao carregar |
| `primary-color` | string | `#222375` | Cor base do player |
| `icon-size` | string \| number | `48` | Tamanho base dos botões (w = h) |
| `icon-color` | string | `--primary` | Cor dos ícones/texto |
| `width` / `height` | string \| number | — | Tamanho explícito do player |
| `hide-buttons` | string | — | CSV `speed,volume,download` |
| `hide-speed` / `hide-volume` / `hide-download` | boolean | — | Flags individuais |
| `icon-play` / `icon-pause` / `icon-download` | string | SVGs internos | Sobrescreve qualquer ícone (SVG/texto) |
| `tooltips` | boolean \| JSON | `true` | `false` desativa, objeto JSON permite customizar (aceita HTML) |
| `crossorigin` | "anonymous" \| "use-credentials" | — | Habilita CORS para visualizador de ondas |

### Eventos

Todos os eventos nativos do `<audio>` são propagados. Evento extra **`download`**:

```js
document.querySelector('beautiful-audio')
  .addEventListener('download', e => {
    console.log(e.detail.url)   // arquivo de áudio
    // e.preventDefault()      // cancela download nativo
  })
```

#### Exemplo de tooltip customizado

```html
<beautiful-audio
  src="song.mp3"
  icon-size="40"
  tooltips='{"play":"<strong>Play</strong>","download":"<em>Salvar arquivo</em>"}'>
</beautiful-audio>
```

---

## 3 · Wrappers oficiais

| Framework | Importação | Exemplo rápido |
|-----------|------------|----------------|
| **React** | `import { BeautifulAudio } from 'beautiful-player/wrappers/react'` | `<BeautifulAudio src="song.mp3" speeds={[1,1.5,2]} />` |
| **Vue 3** | `import { BeautifulAudio } from 'beautiful-player/wrappers/vue'` | `<BeautifulAudio :src="'song.mp3'" :speeds="[1,1.5,2]" />` |
| **Angular** | `import { BeautifulPlayerModule } from 'beautiful-player/wrappers/beautiful-player.module'` | `<beautiful-audio src="song.mp3"></beautiful-audio>` |

---

## 4 · Props comuns (Wrappers)

Todos os wrappers (React, Vue, Angular) aceitam o mesmo conjunto de props/atributos. Só muda a sintaxe conforme o framework.

| Prop         | Tipo                                 | Padrão      | Descrição / Exemplo |
|--------------|--------------------------------------|-------------|---------------------|
| `src`        | string                               | —           | URL do áudio (obrigatório) |
| `type`       | string                               | —           | MIME hint, ex: `audio/ogg` |
| `speeds`     | number[]                             | `[1,1.5,2]` | Velocidades: `[1,1.25,1.5]` |
| `autoplay`   | boolean                              | `false`     | Reproduz ao carregar |
| `primaryColor` | string                             | `#222375`   | Cor base (fundo) |
| `iconColor`  | string                               | `--primary` | Cor dos ícones/texto |
| `iconSize`   | number \| string                    | `48`        | Tamanho dos ícones/botões (px/rem) |
| `width`/`height` | number \| string                 | —           | Tamanho do player |
| `hideButtons`| `{ speed?, volume?, download? }`     | —           | Ocultar controles |
| `icons`      | `{ play?, pause?, download?, volumeMute?, ... }` | SVGs internos | Ícones customizados (SVG, texto ou importado) |
| `tooltips`   | boolean \| objeto                   | `true`      | `false` desativa, objeto permite por botão (texto, HTML, React element, HTMLElement ou função) |
| `onDownload` | function                             | —           | Recebe `CustomEvent<{url:string}>` |
| Qualquer prop nativa do audio | —                  | —           | ex: `controls`, `loop`, `preload` |

**Exemplo (React):**

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
  tooltips={{ play: <strong>Play</strong>, download: 'Salvar', volume: () => <span>🔊</span> }}
  controls
  preload="auto"
  onDownload={e => console.log(e.detail.url)}
/>
```

**Exemplo (Vue):**

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

**Exemplo (Angular):**

```html
<beautiful-audio
  src="song.mp3"
  icon-size="40"
  icon-color="#ff006e"
  tooltips='{"download":"Salvar"}'
  hide-speed
  controls
  preload="auto"
  (download)="onDl($event)"></beautiful-audio>
```

**Notas:**

- Todos os wrappers repassam qualquer prop/atributo desconhecido para o `<audio>` interno.
- Você pode usar qualquer SVG, string ou ícone importado na prop `icons`.
- Tooltips aceitam texto, HTML, React/Vue elements, HTMLElements ou funções que retornem qualquer um desses.
- Para temas avançados, use variáveis CSS (`--primary`, `--icon-color`, `--btn-size`) ou seletores `::part` (em breve).

---

## 🤝 Contribua

Toda contribuição é bem-vinda — desde reportar bugs e sugerir features até enviar pull requests ou melhorar a documentação!

**Como contribuir:**

- **Abra uma issue:** Achou um bug, tem dúvida ou quer sugerir algo? [Abra uma issue](../../issues).
- **Fork & PR:** Faça um fork, crie um branch e envie um pull request. Revisamos rápido!
- **Melhore a documentação:** Até correção de typo ou exemplos melhores ajudam.
- **Mostre seu uso:** Compartilhe seu caso de uso ou integração nas Discussions ou via issue.

**Onde encontrar:**

- **Perfil npm:** [samuelramos.dev no npm](https://www.npmjs.com/settings/samuelramos.dev/profile)
- **GitHub:** [github.com/samuelrms/beautiful-player](https://github.com/samuelrms/beautiful-player)

**Por que contribuir?**

- Ajude a moldar um player de áudio moderno e multi-framework para todos.
- Tenha seu nome na lista de contribuidores.
- Faça o open source melhor para o próximo dev!
