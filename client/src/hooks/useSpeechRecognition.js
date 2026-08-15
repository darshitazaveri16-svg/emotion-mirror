import { useEffect, useRef, useState } from "react";

export default function useSpeechRecognition({
  language = "en-US",
  onResult,
}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    setSupported(Boolean(SpeechRecognition));

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript =
        event.results[0]?.[0]?.transcript || "";

      if (transcript && onResult) {
        onResult(transcript.trim());
      }

      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language, onResult]);

  const startListening = () => {
    if (!recognitionRef.current || listening) {
      return;
    }

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return {
    listening,
    supported,
    startListening,
    stopListening,
  };
}

const SPEECH_LANG_MAP = {
  en: "en-US",
  hi: "hi-IN",
  gu: "gu-IN",
};

export const getSpeechLanguage = (code) =>
  SPEECH_LANG_MAP[code] || "en-US";
