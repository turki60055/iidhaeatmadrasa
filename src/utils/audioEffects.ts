// Web Audio API based sound synthesizer for school radio effects without external assets

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSchoolBell() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const chimeFreqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    chimeFreqs.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.25);

      gain.gain.setValueAtTime(0, now + index * 0.25);
      gain.gain.linearRampToValueAtTime(0.3, now + index * 0.25 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.25 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.25);
      osc.stop(now + index * 0.25 + 1.3);
    });
  } catch (err) {
    console.error('Audio playback error', err);
  }
}

export function playRadioJingle() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [
      { f: 440, t: 0, d: 0.2 },
      { f: 554.37, t: 0.2, d: 0.2 },
      { f: 659.25, t: 0.4, d: 0.25 },
      { f: 880, t: 0.65, d: 0.5 },
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0, now + note.t);
      gain.gain.linearRampToValueAtTime(0.25, now + note.t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.1);
    });
  } catch (err) {
    console.error('Audio playback error', err);
  }
}

export function playApplause() {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 2.5; // 2.5 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.9));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.Q.setValueAtTime(2.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
  } catch (err) {
    console.error('Audio playback error', err);
  }
}

// Arabic Text to Speech helper
export function speakArabicText(text: string, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  // Try to find an Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
