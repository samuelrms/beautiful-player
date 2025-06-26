const audio = document.getElementById("audio");
const playPause = document.getElementById("play-pause");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const speedBtn = document.getElementById("speed-btn");
const volumeBtn = document.getElementById("volume-btn");
const volumeRange = document.getElementById("volume-range");
const downloadBtn = document.getElementById("download-btn");
const volumeCard = document.querySelector(".volume-card");
const durationTotal = document.getElementById("duration-total");
const waveCanvas = document.getElementById("wave-canvas");
const waveCtx = waveCanvas.getContext("2d");

let speedValues = [1, 1.5, 2];
let currentSpeedIndex = 0;
let audioCtx, analyser, dataArray, bufferLength, animationId;

// Flag indicando se placeholder está ativo
let placeholderActive = true;
let placeholderProgress = 0; // 0 a 1

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

playPause.addEventListener("click", togglePlay);

audio.addEventListener("play", () => {
  playPause.textContent = "❚❚"; // Ícone de pausa
  if (!audioCtx) initVisualizer();
  drawWave();
  placeholderActive = false;
});

audio.addEventListener("pause", () => {
  playPause.textContent = "►"; // Ícone de play
  if (animationId) cancelAnimationFrame(animationId);

  // Se pausa chegou ao final do áudio (sem disparar 'ended' em alguns navegadores)
  if (audio.currentTime >= audio.duration - 0.05 && audio.duration !== 0) {
    placeholderActive = true;
    placeholderProgress = 0;
    drawPlaceholder();
  }
});

audio.addEventListener("timeupdate", () => {
  const { currentTime } = audio;
  if (currentTime) {
    const percent = (currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(currentTime);
  }

  // Fallback adicional: se chegar ao fim mas 'ended' não disparar
  if (
    !audio.paused &&
    audio.duration &&
    audio.currentTime >= audio.duration - 0.02
  ) {
    // força evento ended manualmente
    audio.pause();
    audio.currentTime = audio.duration;
    const endedEvent = new Event("ended");
    audio.dispatchEvent(endedEvent);
  }
});

progressContainer.addEventListener("click", (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  audio.currentTime = (clickX / width) * duration;
});

// Acelerador de áudio
speedBtn.addEventListener("click", () => {
  currentSpeedIndex = (currentSpeedIndex + 1) % speedValues.length;
  const newRate = speedValues[currentSpeedIndex];
  audio.playbackRate = newRate;
  speedBtn.textContent = `${newRate}x`;
  updateSpeedTooltip();
});

function updateVolumeIcon(vol) {
  // Atualiza texto percentual
  volumeBtn.textContent = `${Math.round(vol * 100)}%`;
  updateVolumeRangeBar(vol);
  updateVolumeTooltip();
}

// Volume e controle de visibilidade
const volumeControl = document.querySelector(".volume-control");
let sliderVisible = false;
let lastVolume = 1;

audio.volume = 1;

// Atualiza volume via slider
volumeRange.addEventListener("input", (e) => {
  e.stopPropagation();
  audio.volume = e.target.value;
  lastVolume = audio.volume;
  updateVolumeIcon(audio.volume);
});

// Impede que eventos no slider fechem o controle
volumeRange.addEventListener("mousedown", (e) => e.stopPropagation());

volumeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!sliderVisible) {
    // Primeira ação: mostra slider
    volumeControl.classList.add("active");
    sliderVisible = true;
  } else {
    // Segunda ação: mute/unmute
    if (audio.volume === 0) {
      audio.volume = lastVolume || 1;
      volumeRange.value = audio.volume;
    } else {
      lastVolume = audio.volume;
      audio.volume = 0;
      volumeRange.value = 0;
    }
    updateVolumeIcon(audio.volume);
  }
});

// Clique fora fecha o slider
document.addEventListener("click", (e) => {
  if (sliderVisible && !volumeControl.contains(e.target)) {
    volumeControl.classList.remove("active");
    sliderVisible = false;
  }
});

// Ajusta href do download para o source carregado
downloadBtn.href = audio.querySelector("source").src;

// Icone inicial
updateVolumeIcon(audio.volume);

volumeCard.addEventListener("click", (e) => e.stopPropagation());

// Atualiza visual do preenchimento do range
function updateVolumeRangeBar(val) {
  const percent = val * 100;
  volumeRange.style.background = `linear-gradient(to right, #222375 0%, #222375 ${percent}%, rgba(255,255,255,0.35) ${percent}%, rgba(255,255,255,0.35) 100%)`;
}

// Inicializa estilo de range
updateVolumeRangeBar(audio.volume);

// Atualiza campo de duração quando metadados carregarem
audio.addEventListener("loadedmetadata", () => {
  durationTotal.textContent = formatTime(audio.duration);
});

// Suporte a arraste no progresso
let seeking = false;

function handleSeekInteraction(e) {
  const rect = progressContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const percent = Math.min(Math.max(offsetX / rect.width, 0), 1);

  if (placeholderActive) {
    // apenas atualiza placeholder visual
    placeholderProgress = percent;
    drawPlaceholder(percent);
  }

  if (audio.duration) {
    audio.currentTime = percent * audio.duration;
  }
}

progressContainer.addEventListener("mousedown", (e) => {
  seeking = true;
  handleSeekInteraction(e);
});

document.addEventListener("mousemove", (e) => {
  if (seeking) {
    handleSeekInteraction(e);
  }
});

document.addEventListener("mouseup", () => {
  seeking = false;
});

function initVisualizer() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  drawWave();
}

function resizeCanvas() {
  waveCanvas.width = progressContainer.clientWidth;
  waveCanvas.height = progressContainer.clientHeight;
}

function drawWave() {
  animationId = requestAnimationFrame(drawWave);
  analyser.getByteFrequencyData(dataArray);

  waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

  const gap = 1; // espaço entre barras
  const barWidth = 2; // largura fixa estilo WhatsApp
  const numBars = Math.min(
    Math.floor(waveCanvas.width / (barWidth + gap)),
    bufferLength
  );
  const centerY = waveCanvas.height / 2;

  const playedPercent = audio.duration ? audio.currentTime / audio.duration : 0;
  const playedX = playedPercent * waveCanvas.width;

  for (let i = 0; i < numBars; i++) {
    const value = dataArray[i];
    const percent = value / 255;
    const barHeight = percent * waveCanvas.height;

    const x = i * (barWidth + gap);
    if (x + barWidth > waveCanvas.width) break;

    // barras centradas verticalmente (symmetry)
    const y = centerY - barHeight / 2;

    // Cor depende se já foi reproduzido
    const isPlayed = x + barWidth <= playedX;
    waveCtx.fillStyle = isPlayed ? "#ffffff" : "rgba(255,255,255,0.3)";
    waveCtx.fillRect(x, y, barWidth, barHeight);
  }
}

// Desenha placeholder estático (ondas triangulares) quando áudio ainda não começou ou terminou
function drawPlaceholder(progress = placeholderProgress) {
  resizeCanvas();
  waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

  const gap = 1;
  const barWidth = 2;
  const numBars = Math.floor(waveCanvas.width / (barWidth + gap));
  const centerY = waveCanvas.height / 2;

  // Gera alturas aleatórias mas suaves usando interpolação
  const heights = [];
  for (let i = 0; i < numBars; i++) {
    // Valor aleatório entre 30% e 90% da altura
    heights.push(0.3 + Math.random() * 0.6);
  }
  // Desenha barras com alturas irregulares
  const playedX = progress * waveCanvas.width;

  for (let i = 0; i < numBars; i++) {
    const barHeight = heights[i] * waveCanvas.height;
    const x = i * (barWidth + gap);
    const y = centerY - barHeight / 2;
    const isPlayed = x + barWidth <= playedX;
    waveCtx.fillStyle = isPlayed ? "#ffffff" : "rgba(255,255,255,0.3)";
    waveCtx.fillRect(x, y, barWidth, barHeight);
  }
  placeholderActive = true;
}

// Desenha placeholder inicialmente
resizeCanvas();
drawPlaceholder();

// Atualiza placeholder quando a janela redimensionar, se placeholder estiver ativo
window.addEventListener("resize", () => {
  if (placeholderActive) {
    drawPlaceholder();
  }
});

audio.addEventListener("ended", () => {
  if (animationId) cancelAnimationFrame(animationId);
  placeholderActive = true;
  placeholderProgress = 0;
  drawPlaceholder();
  playPause.textContent = "►";
});

function updateVolumeTooltip() {
  volumeBtn.dataset.tooltip = `Volume ${Math.round(audio.volume * 100)}%`;
}

function updateSpeedTooltip() {
  speedBtn.dataset.tooltip = `Velocidade ${audio.playbackRate}x`;
}

// call inside updateVolumeIcon
updateVolumeRangeBar(vol);

// inside speedBtn click after textContent change
speedBtn.textContent = `${newRate}x`;
updateSpeedTooltip();

// set initial tooltips
updateVolumeTooltip();
updateSpeedTooltip();
