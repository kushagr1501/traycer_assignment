import { motion } from 'framer-motion';
import { Check, X, AlertTriangle, ArrowRight } from 'lucide-react';
import type { StrategicOption } from '../lib/mockPlanner';
import { clsx } from 'clsx';


interface OptionsViewerProps {
    options: StrategicOption[];
    onSelect: (option: StrategicOption) => void;
    title?: string;
    description?: string;
    selectedOptionId?: string | null;
    onSkip: () => void;
    onSkipStep?: () => void;
    isSubmitting?: boolean;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function OptionsViewer({ options, onSelect, title, description, isSubmitting, selectedOptionId, onSkip, onSkipStep }: OptionsViewerProps) {
    return (
        <div className="w-full max-w-5xl mx-auto mt-8 px-4 pb-20">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 mb-3">
                        {title || "Technical Stack Decisions"}
                    </h2>
                    <p className="text-gray-400">
                        {description || "Yolo Mode wants you to pick your weapon. Choose your stack wisely."}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 z-50 bg-black/10 backdrop-blur-[1px] cursor-wait rounded-2xl transition-all duration-300 pointer-events-none" />
                    )}

                    {options.map((option) => (
                        <OptionCard
                            key={option.id}
                            option={option}
                            onSelect={onSelect}
                            disabled={isSubmitting}
                            isSelected={selectedOptionId === option.id}
                        />
                    ))}
                </div>

                <div className="flex justify-center gap-4 mt-12">
                    <button
                        onClick={onSkipStep}
                        disabled={isSubmitting}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-mono text-sm tracking-wide disabled:opacity-50"
                    >
                        Skip this Decision
                    </button>
                    <button
                        onClick={onSkip}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-mono text-sm tracking-wide disabled:opacity-50"
                    >
                        💀 Build Now (Skip Rest)
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function OptionCard({ option, onSelect, disabled, isSelected }: { option: StrategicOption; onSelect: (o: StrategicOption) => void; disabled?: boolean; isSelected?: boolean }) {
    return (
        <motion.div
            variants={item}
            whileHover={disabled ? {} : { y: -5, scale: 1.02 }}
            className={clsx(
                "group relative flex flex-col h-full rounded-2xl border bg-black/40 backdrop-blur-xl overflow-hidden transition-all duration-300",
                disabled && !isSelected ? "opacity-30 blur-sm scale-[0.98] border-white/5" : "",
                isSelected ? "border-primary shadow-[0_0_30px_rgba(139,92,246,0.3)] scale-[1.02] z-10" : "border-white/10",
                !disabled && "hover:border-white/20 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer hover:-translate-y-1"
            )}
            onClick={() => !disabled && onSelect(option)}
        >
            <div className={clsx(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500",
                option.riskLevel === 'low' ? "bg-gradient-to-br from-blue-500 to-cyan-500" :
                    option.riskLevel === 'medium' ? "bg-gradient-to-br from-purple-500 to-pink-500" :
                        "bg-gradient-to-br from-yellow-500 to-red-500"
            )} />

            <div className="p-6 flex-1 relative z-10 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <RiskBadge level={option.riskLevel} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                    {option.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                    {option.description}
                </p>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pros</div>
                        <ul className="space-y-1">
                            {option.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                    <span>{pro}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cons</div>
                        <ul className="space-y-1">
                            {option.cons.map((con, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-400/80">
                                    <X className="w-4 h-4 text-red-400/80 shrink-0 mt-0.5" />
                                    <span>{con}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className={clsx(
                "p-4 border-t transition-colors",
                isSelected ? "bg-primary/20 border-primary/20" : "border-white/5 bg-white/5 group-hover:bg-white/10"
            )}>
                <button className={clsx(
                    "w-full flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                    isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                )}>
                    {isSelected ? (
                        <>
                            <Check className="w-4 h-4" />
                            SELECTED
                        </>
                    ) : (
                        <>
                            Select Strategy <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
}

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
    const styles = {
        low: "bg-blue-500/20 text-blue-400 border-blue-500/20",
        medium: "bg-purple-500/20 text-purple-400 border-purple-500/20",
        high: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
    };

    return (
        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5", styles[level])}>
            {level === 'high' && <AlertTriangle className="w-3 h-3" />}
            {level.toUpperCase()} RISK
        </span>
    );
}
