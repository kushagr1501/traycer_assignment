import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import type { Plan, PlanStep } from '../lib/mockPlanner';
import { clsx } from 'clsx';
import { FloatingDockDemo } from './ui/FloatingDockDemo';


interface PlanViewerProps {
    plan: Plan;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

export function PlanViewer({ plan }: PlanViewerProps) {

    return (
        <div className="w-full max-w-4xl mx-auto mt-12 px-6 pb-20">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-0"
            >
                <div className="mb-10 text-left flex items-end justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Orchestrate Tasks</h2>
                        <p className="text-gray-400">Break work into Epics, Tickets, and Phases. Decompose work to scale your engineering.</p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    {plan.steps.map((step, index) => (
                        <div key={step.id} className="w-full flex flex-col items-center">
                            <PlanStepCard step={step} index={index} />

                            {index < plan.steps.length - 1 && (
                                <div className="py-4 text-gray-700">
                                    <ArrowDown className="w-6 h-6 text-white/20" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </motion.div>
            <FloatingDockDemo />
        </div>
    );
}

// function SlideToStart({ onStart, isExecuting }: { onStart: () => void; isExecuting: boolean }) {
//     const controls = useAnimation();
//     const x = useMotionValue(0);
//     const [sliderWidth, setSliderWidth] = useState(0);

//     const textOpacity = useTransform(x, [0, sliderWidth / 2], [1, 0]);
//     const shimmerOpacity = useTransform(x, [0, sliderWidth / 2], [1, 0]);

//     const bgOpacity = useTransform(x, [0, sliderWidth], [0.3, 1]);

//     const handleDragEnd = () => {
//         if (x.get() > sliderWidth - 50) {
//             x.set(sliderWidth - 44);
//             onStart();
//         } else {
//             controls.start({ x: 0, transition: { type: "spring", stiffness: 400, damping: 30 } });
//         }
//     };

//     if (isExecuting) {
//         return (
//             <div className="w-full max-w-sm h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-white/80">
//                 <Loader2 className="w-5 h-5 animate-spin text-primary" />
//                 <span className="font-medium tracking-wide text-sm">BUILDING...</span>
//             </div>
//         )
//     }

//     return (
//         <div
//             className="relative w-full max-w-sm h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 overflow-hidden select-none"
//             ref={(el) => { if (el) setSliderWidth(el.offsetWidth); }}
//         >
//             <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40"
//                 style={{ opacity: bgOpacity }}
//             />

//             <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
//                 animate={{ x: ['-100%', '200%'] }}
//                 transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
//                 style={{ opacity: shimmerOpacity }}
//             />

//             <motion.div
//                 className="absolute inset-0 flex items-center justify-center pointer-events-none"
//                 style={{ opacity: textOpacity }}
//             >
//                 <span className="text-white/50 text-sm font-medium tracking-[2px] uppercase group-hover:text-white/80 transition-colors">
//                     Slide to Start
//                 </span>
//             </motion.div>

//             <motion.div
//                 className="absolute left-1 top-1 bottom-1 w-12 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
//                 drag="x"
//                 dragConstraints={{ left: 0, right: sliderWidth - 52 }}
//                 dragElastic={0.1}
//                 dragMomentum={false}
//                 onDragEnd={handleDragEnd}
//                 animate={controls}
//                 style={{ x }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//             >
//                 <ChevronRight className="w-6 h-6 text-black" />
//             </motion.div>
//         </div>
//     );
// }

function PlanStepCard({ step, index }: { step: PlanStep; index: number }) {

    return (
        <motion.div
            variants={item}
            className={clsx(
                "w-full relative overflow-hidden rounded-xl border p-6 transition-all duration-300 backdrop-blur-md bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-lg hover:shadow-black/20"
            )}
        >

            <div className="relative flex flex-col md:flex-row gap-6 items-start">
                <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border shadow-inner transition-colors bg-white/5 text-white/40 border-white/5">
                        {index + 1}
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="text-xl font-semibold tracking-tight text-gray-100">
                            {step.title}
                        </h3>
                    </div>

                    <p className="text-gray-400 text-base leading-relaxed max-w-3xl font-light">
                        {step.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
