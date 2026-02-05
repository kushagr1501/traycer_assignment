import { motion } from 'framer-motion';
import { Bolt, MousePointer2 } from 'lucide-react';
import { clsx } from 'clsx';

interface InputModeToggleProps {
    mode: 'selection' | 'yolo';
    onModeChange: (mode: 'selection' | 'yolo') => void;
}

export function InputModeToggle({ mode, onModeChange }: InputModeToggleProps) {
    return (
        <div className="flex mb-4">
            <div className="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">

                <button
                    onClick={() => onModeChange('selection')}
                    className={clsx(
                        "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors z-10 flex items-center gap-2",
                        mode === 'selection' ? "text-white" : "text-gray-400 hover:text-white/80"
                    )}
                >
                    {mode === 'selection' && (
                        <motion.div
                            layoutId="mode-highlight"
                            className="absolute inset-0 bg-white/10 border border-white/20 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <MousePointer2 className="w-3.5 h-3.5" />
                    <span>Selection</span>
                </button>

                <button
                    onClick={() => onModeChange('yolo')}
                    className={clsx(
                        "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors z-10 flex items-center gap-2",
                        mode === 'yolo' ? "text-yellow-400" : "text-gray-400 hover:text-white/80"
                    )}
                >
                    {mode === 'yolo' && (
                        <motion.div
                            layoutId="mode-highlight"
                            className="absolute inset-0 bg-yellow-500/10 border border-yellow-500/20 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span>Yolo Mode</span>
                    <Bolt className={clsx("w-3.5 h-3.5", mode === 'yolo' && "fill-yellow-500/50")} />
                </button>

            </div>
        </div>
    );
}

