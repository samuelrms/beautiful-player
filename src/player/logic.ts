import { volumeHighSvg, volumeLowSvg, volumeMediumSvg, volumeMuteSvg } from '../icons/volume';
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

    const setIcon = (el: HTMLElement, icon: string) => {
        if (icon.trim().startsWith('<')) {
            el.innerHTML = icon;
        } else {
            el.textContent = icon;
        }
    };

    const updatePlayIcon = () => {
        setIcon(playBtn, audio.paused ? icons.play : icons.pause);
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

        const volIcons = {
            mute: opts.icons?.volumeMute || volumeMuteSvg,
            low: opts.icons?.volumeLow || volumeLowSvg,
            medium: opts.icons?.volumeMedium || volumeMediumSvg,
            high: opts.icons?.volumeHigh || volumeHighSvg
        };

        const updateVolumeIcon = () => {
            const v = audio.volume;
            let icon = volIcons.high;
            if (v === 0) icon = volIcons.mute;
            else if (v <= 0.33) icon = volIcons.low;
            else if (v <= 0.66) icon = volIcons.medium;
            setIcon(volumeBtn, icon);
        };
        updateVolumeIcon();

        const volumeWrapper = root.querySelector('.bfp-volume-control');
        const showSlider = () => volumeWrapper?.classList.add('active');
        const hideSlider = () => volumeWrapper?.classList.remove('active');

        let sliderVisible = false;
        let lastVolume = audio.volume; // remember previous non-zero volume
        volumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sliderVisible = !sliderVisible;
            sliderVisible ? showSlider() : hideSlider();
        });

        // Double-click mutes
        volumeBtn.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            if (audio.volume === 0) {
                // restore
                audio.volume = lastVolume || maxVol;
            } else {
                lastVolume = audio.volume || maxVol;
                audio.volume = 0;
            }
            volumeRange.value = String(audio.volume);
            updateVolumeIcon();
            updateSliderBg();
        });

        const updateSliderBg = () => {
            const percent = audio.volume * 100;
            volumeRange.style.background = `linear-gradient(to right, var(--icon-color, var(--primary)) 0%, var(--icon-color, var(--primary)) ${percent}%, rgba(255,255,255,0.35) ${percent}%, rgba(255,255,255,0.35) 100%)`;
        };
        updateSliderBg();

        volumeRange.addEventListener('input', (e) => {
            const val = Number((e.target as HTMLInputElement).value);
            audio.volume = val;
            if (val > 0) lastVolume = val;
            updateVolumeIcon();
            updateSliderBg();
        });

        // keep in sync when volume changed elsewhere
        audio.addEventListener('volumechange', updateSliderBg);

        document.addEventListener('click', () => {
            sliderVisible = false;
            hideSlider();
        });
    }

    /* ---------- Download ---------- */
    if (downloadA) {
        downloadA.href = opts.src;
        downloadA.setAttribute('download', '');

        // Dispatch a custom event so the host application can intercept it
        downloadA.addEventListener('click', (e) => {
            // Allow the host to cancel the default behavior
            const ev = new CustomEvent('download', {
                detail: { url: opts.src },
                bubbles: true,
                cancelable: true,
            });
            const canceled = !root.host.dispatchEvent(ev);
            if (canceled) {
                // If the host canceled, prevent the default navigation
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
        try {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            const source = audioCtx.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        } catch (err) {
            console.warn('Audio analyzer disabled (possibly due to cross-origin restrictions):', err);
            audioCtx = undefined as any; // mark as not available
        }
    }

    function drawWave() {
        animationId = requestAnimationFrame(drawWave);
        if (!analyser) return;
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
    if (opts.tooltips === false) {
        root.querySelectorAll('[data-tooltip]').forEach(el => el.removeAttribute('data-tooltip'));
    } else if (opts.tooltips && typeof opts.tooltips === 'object') {
        const map: Record<string, any> = opts.tooltips as any;

        // create single tooltip element
        const tip = document.createElement('div');
        tip.className = 'bfp-tt';
        root.appendChild(tip);

        const showTip = (btn: HTMLElement, content: any) => {
            let node: string | HTMLElement = content;
            if (typeof content === 'function') node = content();

            tip.innerHTML = '';
            if (node instanceof HTMLElement) {
                tip.appendChild(node.cloneNode(true));
            } else if (typeof node === 'string') {
                if (node.trim().startsWith('<')) tip.innerHTML = node;
                else tip.textContent = node;
            }
            const rect = btn.getBoundingClientRect();
            const hostRect = (root.host as HTMLElement).getBoundingClientRect();
            tip.style.left = `${rect.left - hostRect.left + rect.width / 2}px`;
            tip.classList.add('show');
        };
        const hideTip = () => tip.classList.remove('show');

        Object.entries(map).forEach(([role, text]) => {
            const el = root.querySelector(`[data-role="${role}"]`) as HTMLElement | null;
            if (!el || !text) return;
            // remove default pseudo tooltip to avoid overlap
            el.removeAttribute('data-tooltip');
            el.addEventListener('mouseenter', () => showTip(el, text));
            el.addEventListener('mouseleave', hideTip);
        });
    }
} 