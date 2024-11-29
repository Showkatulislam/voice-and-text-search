export {};

declare global {
  interface Window {
    recognition?: SpeechRecognition;
  }
}
