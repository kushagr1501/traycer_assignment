import { useEffect, useRef, useState, useCallback } from "react";

export default function useVoiceInput(onText: (text: string) => void) {
    const recognitionRef = useRef<any>(null);
    const onTextRef = useRef(onText);
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [interimText, setInterimText] = useState<string>("");

    // Keep callback ref updated
    useEffect(() => {
        onTextRef.current = onText;
    }, [onText]);

    useEffect(() => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            setError("Speech recognition not supported. Try Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = true;  // Show text as you speak
        recognition.continuous = true;       // Don't stop after one sentence
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log("[Voice] Started listening");
            setIsListening(true);
            setError(null);
            setInterimText("");
        };

        recognition.onend = () => {
            console.log("[Voice] Stopped listening");
            setIsListening(false);
            setInterimText("");
        };

        recognition.onerror = (e: any) => {
            console.error("[Voice] Error:", e.error, e.message);
            setIsListening(false);
            setInterimText("");

            switch (e.error) {
                case 'no-speech':
                    setError("No speech detected. Try again.");
                    break;
                case 'audio-capture':
                    setError("No microphone found.");
                    break;
                case 'not-allowed':
                    setError("Microphone permission denied. Check browser settings.");
                    break;
                case 'network':
                    setError("Network error. Check your connection.");
                    break;
                case 'aborted':
                    // User cancelled - no error
                    break;
                default:
                    setError(`Error: ${e.error}`);
            }
        };

        recognition.onresult = (e: any) => {
            console.log("[Voice] Got result:", e.results);

            let finalTranscript = "";
            let interimTranscript = "";

            for (let i = e.resultIndex; i < e.results.length; i++) {
                const transcript = e.results[i][0].transcript;

                if (e.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Show interim text while speaking
            if (interimTranscript) {
                setInterimText(interimTranscript);
            }

            // Send final text to parent
            if (finalTranscript) {
                console.log("[Voice] Final transcript:", finalTranscript);
                setInterimText("");
                onTextRef.current(finalTranscript.trim());
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch (e) {
                    // Ignore
                }
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) {
            setError("Speech recognition not available");
            return;
        }

        setError(null);
        setInterimText("");

        try {
            recognitionRef.current.start();
        } catch (err: any) {
            // Already started - restart it
            console.log("[Voice] Restarting...");
            recognitionRef.current.stop();
            setTimeout(() => {
                try {
                    recognitionRef.current?.start();
                } catch (e) {
                    setError("Could not start voice input");
                }
            }, 100);
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore
            }
        }
    }, [isListening]);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    const clearError = useCallback(() => setError(null), []);

    return {
        toggleListening,
        startListening,
        stopListening,
        isListening,
        isSupported,
        error,
        clearError,
        interimText, //show texts while the user is speakig
        audioLevel: 0 // Placeholder for audio level visualization
    };
}