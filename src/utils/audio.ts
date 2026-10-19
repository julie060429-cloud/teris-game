import { NOTE_FREQ, TETRIS_THEME_NOTES } from '../constants/tetris';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  public sfxEnabled: boolean = true;
  public bgmEnabled: boolean = false; // default off for pleasant first impression, easily toggled
  public sfxVolume: number = 0.5;
  public bgmVolume: number = 0.3;

  private isBgmPlaying: boolean = false;
  private bgmTimeoutId: number | null = null;
  private currentNoteIndex: number = 0;
  private currentTempoBpm: number = 135;

  constructor() {
    // Load preferences from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const savedSfx = localStorage.getItem('tetris_sfx_enabled');
        if (savedSfx !== null) this.sfxEnabled = savedSfx === 'true';

        const savedBgm = localStorage.getItem('tetris_bgm_enabled');
        if (savedBgm !== null) this.bgmEnabled = savedBgm === 'true';

        const savedSfxVol = localStorage.getItem('tetris_sfx_volume');
        if (savedSfxVol !== null) this.sfxVolume = parseFloat(savedSfxVol);

        const savedBgmVol = localStorage.getItem('tetris_bgm_volume');
        if (savedBgmVol !== null) this.bgmVolume = parseFloat(savedBgmVol);
      } catch (e) {
        console.warn('Could not read sound preferences', e);
      }
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
        this.sfxGain.connect(this.masterGain);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = this.bgmEnabled ? this.bgmVolume : 0;
        this.bgmGain.connect(this.masterGain);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
    try {
      localStorage.setItem('tetris_sfx_enabled', String(enabled));
    } catch {}
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    try {
      localStorage.setItem('tetris_bgm_enabled', String(enabled));
    } catch {}
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(enabled ? this.bgmVolume : 0, this.ctx.currentTime);
    }
    if (enabled && !this.isBgmPlaying) {
      this.startBgm();
    } else if (!enabled && this.isBgmPlaying) {
      this.stopBgm();
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('tetris_sfx_volume', String(this.sfxVolume));
    } catch {}
    if (this.sfxGain && this.ctx && this.sfxEnabled) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('tetris_bgm_volume', String(this.bgmVolume));
    } catch {}
    if (this.bgmGain && this.ctx && this.bgmEnabled) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  public setLevelTempo(level: number) {
    // Increase tempo slightly with level
    this.currentTempoBpm = Math.min(210, 135 + (level - 1) * 5);
  }

  // --- Sound Effects ---

  public playMove() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.045);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playRotate() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.075);
  }

  public playSoftDrop() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  public playHardDrop() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Punchy thud with noise transient
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.13);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.14);
  }

  public playHold() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;
    [520, 680].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.04);

      gain.gain.setValueAtTime(0.16, t + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + i * 0.04);
      osc.stop(t + i * 0.04 + 0.09);
    });
  }

  public playLock() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playLineClear(lines: number) {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    if (lines === 4) {
      // Tetris! Epic 4-note victory chord
      const chords = [
        [523.25, 659.25, 783.99], // C Major
        [587.33, 739.99, 880.00], // D Major
        [659.25, 830.61, 987.77], // E Major
        [1046.50, 1318.51, 1567.98], // High C
      ];

      chords.forEach((triad, step) => {
        const stepTime = t + step * 0.08;
        triad.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);

          const dur = step === chords.length - 1 ? 0.35 : 0.09;
          gain.gain.setValueAtTime(0.12, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + dur);

          osc.connect(gain);
          gain.connect(this.sfxGain!);

          osc.start(stepTime);
          osc.stop(stepTime + dur + 0.01);
        });
      });
    } else {
      // Single, double, triple arpeggios
      const freqs = lines === 1
        ? [440, 554]
        : lines === 2
        ? [440, 554, 659]
        : [440, 554, 659, 880];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);

        gain.gain.setValueAtTime(0.15, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.14);
      });
    }
  }

  public playCombo(combo: number) {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const baseFreq = 400 + Math.min(12, combo) * 60;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playLevelUp() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50];
    const t = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.07);

      gain.gain.setValueAtTime(0.2, t + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + i * 0.07);
      osc.stop(t + i * 0.07 + 0.2);
    });
  }

  public playGameOver() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [392.00, 349.23, 311.13, 261.63, 196.00];
    const t = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + i * 0.14);

      gain.gain.setValueAtTime(0.18, t + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.14 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGain!);

      osc.start(t + i * 0.14);
      osc.stop(t + i * 0.14 + 0.2);
    });
  }

  // --- Chiptune 8-bit BGM Synthesizer ---

  public startBgm() {
    this.initContext();
    if (!this.bgmEnabled || !this.ctx || !this.bgmGain) return;

    this.isBgmPlaying = true;
    this.playNextBgmNote();
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimeoutId !== null) {
      window.clearTimeout(this.bgmTimeoutId);
      this.bgmTimeoutId = null;
    }
  }

  private playNextBgmNote() {
    if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;

    const [noteName, durationSixteenths] = TETRIS_THEME_NOTES[this.currentNoteIndex];
    const freq = NOTE_FREQ[noteName] || 0;

    // 1 beat = 4 sixteenths; tempo in BPM
    // duration in seconds = (durationSixteenths / 4) * (60 / currentTempoBpm)
    const noteDurationSec = (durationSixteenths / 4) * (60 / this.currentTempoBpm);

    if (freq > 0 && this.bgmEnabled) {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      // 8-bit staccato envelope
      const playDur = noteDurationSec * 0.82;
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + playDur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc.stop(t + playDur + 0.02);

      // Add gentle bass accompaniment
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(freq / 2, t);
      bassGain.gain.setValueAtTime(0.08, t);
      bassGain.gain.exponentialRampToValueAtTime(0.001, t + playDur);
      bassOsc.connect(bassGain);
      bassGain.connect(this.bgmGain);
      bassOsc.start(t);
      bassOsc.stop(t + playDur + 0.02);
    }

    this.currentNoteIndex = (this.currentNoteIndex + 1) % TETRIS_THEME_NOTES.length;
    this.bgmTimeoutId = window.setTimeout(() => {
      this.playNextBgmNote();
    }, noteDurationSec * 1000);
  }
}

export const sound = new SoundEngine();
