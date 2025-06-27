import type { AudioPlayerOptions } from './AudioPlayer';

export function initPlayer(root: ShadowRoot, opts: AudioPlayerOptions) {
    const audio = root.querySelector('audio') as HTMLAudioElement;
    const playBtn = root.querySelector('[data-role="play"]') as HTMLButtonElement;
    const currentTimeEl = root.querySelector('[data-role="current"]') as HTMLSpanElement | null;
    const speedBtn = root.querySelector('[data-role="speed"]') as HTMLButtonElement | null;
    const volumeBtn = root.querySelector('[data-role="volume"]') as HTMLButtonElement | null;
    const volumeRange = root.querySelector('[data-role="volume-range"]') as HTMLInputElement | null;
    const downloadA = root.querySelector('[data-role="download"]') as HTMLAnchorElement | null;
    const progressContainer = root.querySelector('.bfp-progress') as HTMLElement;
    const waveCanvas = root.querySelector('.bfp-wave') as HTMLCanvasElement;
    const waveCtx = waveCanvas.getContext('2d')!;

    /* ---------- Play / Pause ---------- */
    const icons = {
        play: opts.icons?.play || '►',
        pause: opts.icons?.pause || '❚❚'
    };
    const updatePlayIcon = () => {
        playBtn.textContent = audio.paused ? icons.play : icons.pause;
    };
    playBtn.addEventListener('click', () => {
        audio.paused ? audio.play() : audio.pause();
    });
    audio.addEventListener('play', updatePlayIcon);
    audio.addEventListener('pause', updatePlayIcon);
    updatePlayIcon();

    /* ---------- Speed ---------- */
    if (speedBtn && opts.speeds && opts.speeds.length) {
        let idx = 0;
        const updateSpeedBtn = () => {
            speedBtn.textContent = `${opts.speeds![idx]}x`;
        };
        speedBtn.addEventListener('click', () => {
            idx = (idx + 1) % opts.speeds!.length;
            audio.playbackRate = opts.speeds![idx];
            updateSpeedBtn();
        });
        audio.playbackRate = opts.speeds[0];
        updateSpeedBtn();
    }

    /* ---------- Volume ---------- */
    if (volumeBtn && volumeRange) {
        const maxVol = opts.maxVolume ?? 1;
        audio.volume = maxVol;
        volumeRange.value = String(maxVol);

        const showSlider = () => {
            root.querySelector('.bfp-volume-card')?.classList.add('active');
        };
        const hideSlider = () => {
            root.querySelector('.bfp-volume-card')?.classList.remove('active');
        };

        let sliderVisible = false;
        volumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sliderVisible = !sliderVisible;
            sliderVisible ? showSlider() : hideSlider();
        });
        volumeRange.addEventListener('input', (e) => {
            const val = Number((e.target as HTMLInputElement).value);
            audio.volume = val;
            volumeBtn.textContent = `${Math.round(val * 100)}%`;
        });
        document.addEventListener('click', () => {
            sliderVisible = false;
            hideSlider();
        });
    }

    /* ---------- Download ---------- */
    if (downloadA) {
        downloadA.href = opts.src;
        downloadA.setAttribute('download', '');

        // Dispara evento para que o usuário possa interceptar
        downloadA.addEventListener('click', (e) => {
            // Permite que o host cancele comportamento padrão
            const ev = new CustomEvent('download', {
                detail: { url: opts.src },
                bubbles: true,
                cancelable: true,
            });
            const canceled = !root.host.dispatchEvent(ev);
            if (canceled) {
                // se usuário cancelou, impedir navegação padrão
                e.preventDefault();
            }
        });
    }

    /* ---------- Durations ---------- */
    const fmt = (t: number) => {
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };
    if (currentTimeEl) {
        audio.addEventListener('timeupdate', () => {
            currentTimeEl.textContent = fmt(audio.currentTime);
        });
    }

    /* ---------- Wave Visualizer ---------- */
    let audioCtx: AudioContext | undefined;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let animationId: number;

    function resizeCanvas() {
        waveCanvas.width = progressContainer.clientWidth;
        waveCanvas.height = progressContainer.clientHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawPlaceholder(progress = 0) {
        resizeCanvas();
        waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        const gap = 1, barWidth = 2, numBars = Math.floor(waveCanvas.width / (barWidth + gap));
        const centerY = waveCanvas.height / 2;
        for (let i = 0; i < numBars; i++) {
            const rand = 0.3 + Math.random() * 0.6;
            const h = rand * waveCanvas.height;
            const x = i * (barWidth + gap);
            const y = centerY - h / 2;
            const played = x / waveCanvas.width < progress;
            waveCtx.fillStyle = played ? '#fff' : 'rgba(255,255,255,0.3)';
            waveCtx.fillRect(x, y, barWidth, h);
        }
    }

    let placeholder = true;
    drawPlaceholder();

    function initAnalyzer() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 512;
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    function drawWave() {
        animationId = requestAnimationFrame(drawWave);
        analyser.getByteFrequencyData(dataArray);
        waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
        const gap = 1, barWidth = 2, numBars = Math.min(Math.floor(waveCanvas.width / (barWidth + gap)), dataArray.length);
        const centerY = waveCanvas.height / 2;
        const playedX = (audio.currentTime / audio.duration) * waveCanvas.width;
        for (let i = 0; i < numBars; i++) {
            const val = dataArray[i] / 255;
            const h = val * waveCanvas.height;
            const x = i * (barWidth + gap);
            const y = centerY - h / 2;
            const played = x + barWidth <= playedX;
            waveCtx.fillStyle = played ? '#fff' : 'rgba(255,255,255,0.3)';
            waveCtx.fillRect(x, y, barWidth, h);
        }
    }

    audio.addEventListener('play', () => {
        placeholder = false;
        initAnalyzer();
        drawWave();
    });
    audio.addEventListener('pause', () => {
        cancelAnimationFrame(animationId);
    });
    audio.addEventListener('ended', () => {
        cancelAnimationFrame(animationId);
        placeholder = true;
        drawPlaceholder();
    });

    /* ---------- Seeking ---------- */
    let seeking = false;
    function handleSeek(e: MouseEvent) {
        const rect = progressContainer.getBoundingClientRect();
        const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        if (placeholder) {
            drawPlaceholder(percent);
        }
        if (audio.duration) {
            audio.currentTime = percent * audio.duration;
        }
    }
    progressContainer.addEventListener('mousedown', (e) => { seeking = true; handleSeek(e); });
    window.addEventListener('mousemove', (e) => { if (seeking) handleSeek(e); });
    window.addEventListener('mouseup', () => seeking = false);

    /* ---------- Tooltips ---------- */
    if (!opts.tooltips) {
        root.querySelectorAll('[data-tooltip]').forEach(el => el.removeAttribute('data-tooltip'));
    }
} 