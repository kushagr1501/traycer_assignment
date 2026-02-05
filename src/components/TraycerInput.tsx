import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Pencil, Mic, MicOff, AlertCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import useVoiceInput from '../lib/useVoiceInput';

interface TraycerInputProps {
    onSubmit: (prompt: string, mode: 'selection' | 'yolo') => void;
    isPlanning: boolean;
    loading?: boolean
}

import { InputModeToggle } from './InputModeToggle';

export function TraycerInput({ onSubmit, isPlanning, loading }: TraycerInputProps) {
    const [prompt, setPrompt] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [mode, setMode] = useState<'selection' | 'yolo'>('selection');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isPlanning && !isEditing && !loading) {
            setIsEditing(true);
            return;
        }

        if (prompt.trim()) {
            setIsEditing(false);
            onSubmit(prompt, mode);
        }
    };

    const {
        toggleListening,
        isListening,
        isSupported,
        error,
        clearError,
        interimText,
        audioLevel
    } = useVoiceInput((text) => {
        setPrompt(prev => prev + (prev ? ' ' : '') + text);
    });

    const displayValue = isListening && interimText
        ? prompt + (prompt ? ' ' : '') + interimText
        : prompt;

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to auto to get accurate scrollHeight
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 300); // Max 300px ,we can adjust it based on our need 
            textarea.style.height = `${newHeight}px`;

            //  scroll feature is enabled only when hitting max height
            textarea.style.overflowY = textarea.scrollHeight > 300 ? 'auto' : 'hidden';
        }
    }, [displayValue]);

    // Normalize audio level for visual feedback (0-100)
    const normalizedLevel = Math.min(100, (audioLevel / 128) * 100);

    return (
        <div className={twMerge(
            "w-full max-w-2xl transition-all duration-700 ease-in-out",
            isPlanning ? "translate-y-0 opacity-100" : "translate-y-[20vh]"
        )}>
            {!isPlanning && (
                <InputModeToggle mode={mode} onModeChange={setMode} />
            )}
            <motion.form
                onSubmit={handleSubmit}
                initial={false}
                animate={{
                    scale: isFocused ? 1.02 : 1,
                    boxShadow: isFocused
                        ? "0 0 30px rgba(139, 92, 246, 0.3)"
                        : isListening
                            ? "0 0 30px rgba(239, 68, 68, 0.3)"
                            : "0 0 0px rgba(0,0,0,0)"
                }}
                className="relative group"
            >
                <div className={twMerge(
                    "absolute -inset-0.5 rounded-xl opacity-30 blur transition duration-1000 group-hover:opacity-75 group-hover:duration-200",
                    isListening
                        ? "bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-75"
                        : "bg-gradient-to-r from-primary via-accent to-secondary"
                )} />

                <div className={twMerge(
                    "relative flex items-start bg-black/80 backdrop-blur-xl rounded-xl border p-2 transition-colors",
                    isListening ? "border-red-500/30" : "border-white/10"
                )}>
                    <Sparkles className={twMerge(
                        "w-5 h-5 ml-3 mt-3 flex-shrink-0",
                        isListening ? "text-red-400 animate-pulse" : "text-gray-400 animate-pulse"
                    )} />

                    <textarea
                        ref={textareaRef}
                        value={displayValue}
                        onChange={(e) => setPrompt(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder={isListening ? "Listening... speak now" : "What do you want to build today?"}
                        rows={1}
                        className={twMerge(
                            "w-full min-h-[48px] bg-transparent border-none outline-none px-4 py-3 text-lg resize-none leading-relaxed",
                            isListening && interimText ? "text-gray-400" : "text-white",
                            "placeholder-gray-500",
                            "[&::-webkit-scrollbar]:w-1.5",
                            "[&::-webkit-scrollbar-track]:bg-transparent",
                            "[&::-webkit-scrollbar-thumb]:bg-white/20",
                            "[&::-webkit-scrollbar-thumb]:rounded-full"
                        )}
                        disabled={(loading || isPlanning) && !isEditing}
                    />

                    <div className="flex items-start gap-2 mt-1.5 flex-shrink-0">
                        <button
                            type="submit"
                            disabled={!prompt.trim() || loading}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-white/10"
                        >
                            {isPlanning && !isEditing && !loading ? (
                                <Pencil className="w-5 h-5 text-gray-400 group-hover:text-white" />
                            ) : (
                                <ArrowRight className="w-5 h-5" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={toggleListening}
                            disabled={!isSupported}
                            title={
                                !isSupported
                                    ? "Speech recognition not supported"
                                    : isListening
                                        ? "Click to stop"
                                        : "Click to speak"
                            }
                            className={twMerge(
                                "p-2 rounded-lg transition-all duration-300 relative overflow-hidden",
                                !isSupported
                                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                                    : isListening
                                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                        : "bg-white/5 hover:bg-white/10 text-white"
                            )}
                        >
                            {!isSupported ? (
                                <MicOff className="w-5 h-5" />
                            ) : (
                                <Mic className="w-5 h-5 relative z-10" />
                            )}

                            {isListening && (
                                <span
                                    className="absolute inset-0 rounded-lg bg-red-500/30 transition-transform duration-75"
                                    style={{
                                        transform: `scale(${1 + normalizedLevel / 100})`,
                                        opacity: normalizedLevel / 100
                                    }}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </motion.form>

            <AnimatePresence>
                {isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex flex-col items-center gap-2"
                    >
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="w-1 bg-red-400 rounded-full"
                                    animate={{
                                        height: audioLevel > 5
                                            ? [4, Math.max(8, normalizedLevel * 0.3), 4]
                                            : [4, 8, 4],
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        repeat: Infinity,
                                        delay: i * 0.05,
                                    }}
                                />
                            ))}
                        </div>

                        <span className="text-sm text-gray-400">
                            {interimText
                                ? "Hearing you..."
                                : audioLevel > 10
                                    ? `🎤 Mic active (${Math.round(normalizedLevel)}%)`
                                    : "Waiting for speech... (check mic)"}
                        </span>

                        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-75"
                                style={{ width: `${normalizedLevel}%` }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-3 flex items-center justify-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2"
                    >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                        <button
                            onClick={clearError}
                            className="ml-2 text-gray-500 hover:text-white transition-colors text-lg leading-none"
                        >
                            ×
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isPlanning && !isListening && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 flex flex-wrap justify-center gap-3"
                    >
                        {["Build a snake game", "Create a landing page", "Refactor auth flow"].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setPrompt(suggestion)}
                                className="px-4 py-2 rounded-full text-sm text-gray-400 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all hover:text-white"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}