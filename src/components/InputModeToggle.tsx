import { Bolt } from 'lucide-react';

interface InputModeToggleProps {
    mode: 'selection' | 'yolo';
    onModeChange: (mode: 'selection' | 'yolo') => void;
}

export function InputModeToggle({ mode, onModeChange }: InputModeToggleProps) {
    return (
        <div className="flex items-center gap-4 mb-3 pl-1">
            <button
                onClick={() => onModeChange('selection')}
                className="group relative flex items-center justify-center p-2 text-sm font-mono tracking-wide text-gray-400 hover:text-white transition-colors"
            >

                <div className={`absolute inset-0 border border-t-0 border-b-0 border-white/20 transition-all duration-300 ${mode === 'selection' ? 'border-l-2 border-r-2 border-white' : 'group-hover:border-white/50'}`}>
                    <div className="absolute top-0 left-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                </div>

                <span className={`relative z-10 px-3 py-1 ${mode === 'selection' ? 'text-white' : ''}`}>Selection Mode</span>
            </button>

            <button
                onClick={() => onModeChange('yolo')}
                className="group relative flex items-center justify-center p-2 text-sm font-mono tracking-wide text-gray-400 hover:text-white transition-colors"
            >
                <div className={`absolute inset-0 border border-t-0 border-b-0 border-white/20 transition-all duration-300 ${mode === 'yolo' ? 'border-l-2 border-r-2 border-white' : 'group-hover:border-white/50'}`}>
                    <div className="absolute top-0 left-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                    <div className="absolute top-0 right-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors" />
                </div>

                <div className={`flex items-center gap-2 relative z-10 px-3 py-1 ${mode === 'yolo' ? 'text-white' : ''}`}>
                    <span>Yolo Mode</span>
                    <Bolt className="w-3 h-3 text-yellow-500 fill-yellow-500/20" />
                </div>
            </button>
        </div>
    );
}

