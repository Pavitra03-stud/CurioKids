let onSpeakStart = () => {};
let onSpeakEnd = () => {};

function loadVoices() {
  window.speechSynthesis.getVoices();
}

// Call this once if you want callbacks
export function registerSpeechCallbacks(start, end) {
  onSpeakStart = start || (() => {});
  onSpeakEnd = end || (() => {});
  loadVoices();
}

export function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);

  const voices = window.speechSynthesis.getVoices();

  // 🎧 Prefer female / child-friendly voice
  utterance.voice =
    voices.find(v =>
      v.name.toLowerCase().includes("female") ||
      v.name.toLowerCase().includes("child") ||
      v.lang === "en-US"
    ) || voices[0];

  utterance.rate = 0.9;
  utterance.pitch = 1.3;
  utterance.volume = 1;

  utterance.onstart = onSpeakStart;
  utterance.onend = onSpeakEnd;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
