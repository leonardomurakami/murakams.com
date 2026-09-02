export interface StartupChimeHandle {
  stop: () => void;
}

type AudioContextWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const CHIME_LENGTH_SECONDS = 1.24;

export function playStartupChime(): StartupChimeHandle | null {
  if (typeof window === "undefined") return null;

  const AudioContextClass =
    window.AudioContext ?? (window as AudioContextWindow).webkitAudioContext;
  if (!AudioContextClass) return null;

  const context = new AudioContextClass();
  const master = context.createGain();
  const now = context.currentTime;
  const oscillators: OscillatorNode[] = [];

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.12, now + 0.035);
  master.gain.setValueAtTime(0.12, now + 0.72);
  master.gain.exponentialRampToValueAtTime(0.0001, now + CHIME_LENGTH_SECONDS);
  master.connect(context.destination);

  const voices = [
    { frequency: 196, offset: 0, length: 0.76, level: 0.52, type: "triangle" as OscillatorType },
    { frequency: 293.66, offset: 0.13, length: 0.82, level: 0.34, type: "sine" as OscillatorType },
    { frequency: 440, offset: 0.31, length: 0.86, level: 0.22, type: "sine" as OscillatorType },
  ];

  for (const voice of voices) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const startsAt = now + voice.offset;
    const endsAt = startsAt + voice.length;

    oscillator.type = voice.type;
    oscillator.frequency.setValueAtTime(voice.frequency, startsAt);
    oscillator.frequency.exponentialRampToValueAtTime(voice.frequency * 1.012, endsAt);
    envelope.gain.setValueAtTime(0.0001, startsAt);
    envelope.gain.exponentialRampToValueAtTime(voice.level, startsAt + 0.025);
    envelope.gain.exponentialRampToValueAtTime(0.0001, endsAt);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(startsAt);
    oscillator.stop(endsAt + 0.02);
    oscillators.push(oscillator);
  }

  void context.resume();

  let finished = false;
  const finishTimer = window.setTimeout(
    () => {
      finished = true;
      void context.close();
    },
    (CHIME_LENGTH_SECONDS + 0.08) * 1000,
  );

  return {
    stop() {
      if (finished) return;
      finished = true;
      window.clearTimeout(finishTimer);
      const stopAt = context.currentTime;
      master.gain.cancelScheduledValues(stopAt);
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), stopAt);
      master.gain.exponentialRampToValueAtTime(0.0001, stopAt + 0.025);
      for (const oscillator of oscillators) {
        try {
          oscillator.stop(stopAt + 0.03);
        } catch {}
      }
      window.setTimeout(() => void context.close(), 45);
    },
  };
}
