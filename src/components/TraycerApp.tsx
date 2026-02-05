import { useState } from 'react';
import { TraycerInput } from './TraycerInput';
import { PlanViewer } from './PlanViewer';
import { OptionsViewer } from './OptionsViewer';
import { CookingLoader } from './CookingLoader';
import { generatePlan, generateOptions, generateNextDecision } from '../lib/aiService';
import type { Plan, StrategicOption, DecisionHistory, DecisionStep } from '../lib/mockPlanner';
import { Cpu } from 'lucide-react';


const TRAYCER_HISTORY_KEY = 'traycer_yolo_history';

export function TraycerApp() {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [options, setOptions] = useState<StrategicOption[] | null>(null);
    const [isPlanning, setIsPlanning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // const [isExecuting, setIsExecuting] = useState(false);

    // New state for Yolo Mode Loop
    const [decisionHistory, setDecisionHistory] = useState<DecisionHistory>([]);
    const [currentDecision, setCurrentDecision] = useState<DecisionStep | null>(null);
    const [originalPrompt, setOriginalPrompt] = useState("");
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    const handleCreatePlan = async (prompt: string, mode: 'selection' | 'yolo') => {
        setIsPlanning(true);
        setIsLoading(true);
        setPlan(null);
        setOptions(null);
        setDecisionHistory([]);
        setCurrentDecision(null);
        setOriginalPrompt(prompt);

        // Clear history on new start
        localStorage.removeItem(TRAYCER_HISTORY_KEY);

        try {
            if (mode === 'yolo') {
                const firstStep = await generateNextDecision(prompt, []);
                if (firstStep) {
                    setOptions(firstStep.options);
                    setCurrentDecision(firstStep);
                } else {
                    const strategicOptions = await generateOptions(prompt);
                    setOptions(strategicOptions);
                }
            } else {
                const newPlan = await generatePlan(prompt);
                setPlan(newPlan);
            }
        } catch (error) {
            console.error("Error generating plan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = async (option: StrategicOption) => {
        if (currentDecision) {
            setIsLoading(true);
            setSelectedOptionId(option.id);

            const newHistory = [
                ...decisionHistory,
                {
                    stepId: currentDecision.id,
                    stepTitle: currentDecision.title,
                    selectedOption: option
                }
            ];
            setDecisionHistory(newHistory);
            // Persist to local storage as requested
            localStorage.setItem(TRAYCER_HISTORY_KEY, JSON.stringify(newHistory));


            try {
                const nextStep = await generateNextDecision(originalPrompt, newHistory);

                if (nextStep) {
                    setCurrentDecision(nextStep);
                    setOptions(nextStep.options);
                    setSelectedOptionId(null);
                } else {
                    // Done! Generate Final Plan
                    const promptContext = `Task: ${originalPrompt}. \nDecisions made:\n${newHistory.map(h => `- ${h.stepTitle}: ${h.selectedOption.title}`).join('\n')}`;

                    setOptions(null); // 
                    const newPlan = await generatePlan(promptContext);
                    setPlan(newPlan);
                    setCurrentDecision(null);
                }

            } catch (error) {
                console.error("Error in decision loop:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(true);
            setOptions(null);

            try {
                const newPlan = await generatePlan(`Implement this using: ${option.title}. ${option.description}`);
                setPlan(newPlan);
            } catch (error) {
                console.error("Error generating plan:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };


    // Handle the Skip or  Early Exit
    const handleSkip = async () => {
        setIsLoading(true);
        setOptions(null);

        try {
            // Creating a context for the AI to finish whatever is left
            const promptContext = `Task: ${originalPrompt}. 
         Decisions already made:
         ${decisionHistory.map(h => `- ${h.stepTitle}: ${h.selectedOption.title}`).join('\n')}
         
         The user has decided to SKIP the remaining decision steps.
         PLEASE FILL IN THE BLANKS AND GENERATE THE FINAL EXECUTION PLAN NOW.
         `;

            const newPlan = await generatePlan(promptContext);
            setPlan(newPlan);
            setCurrentDecision(null);
            setSelectedOptionId(null);

        } catch (error) {
            console.error("Error skipping:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Skip a specific decision step
    const handleSkipStep = async () => {
        if (!currentDecision) return;
        setIsLoading(true);

        const newHistory = [
            ...decisionHistory,
            {
                stepId: currentDecision.id,
                stepTitle: currentDecision.title,
                selectedOption: { id: 'skipped', title: 'Skipped', description: 'User decided to skip this decision', pros: [], cons: [], riskLevel: 'low' as const }
            }
        ];
        setDecisionHistory(newHistory);
        // Save persistence
        localStorage.setItem(TRAYCER_HISTORY_KEY, JSON.stringify(newHistory));

        try {
            const nextStep = await generateNextDecision(originalPrompt, newHistory);

            if (nextStep) {
                setCurrentDecision(nextStep);
                setOptions(nextStep.options);
            } else {
                const promptContext = `Task: ${originalPrompt}. \nDecisions made:\n${newHistory.map(h => `- ${h.stepTitle}: ${h.selectedOption.title}`).join('\n')}`;

                setOptions(null); // Clearing  options immediately BEFORE plan generation starts
                const newPlan = await generatePlan(promptContext);
                setPlan(newPlan);
                setCurrentDecision(null);
            }
        } catch (error) {
            console.error("Error skipping step:", error);
        } finally {
            setIsLoading(false);
            setSelectedOptionId(null);
        }
    };

    const showHeader = !plan && !options && !isLoading && decisionHistory.length === 0;

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden selection:bg-primary/30 w-full">

            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-accent/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">

                <div className={`transition-all duration-700 ${(!showHeader) ? 'mb-8 scale-75' : 'mb-16'}`}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                            <Cpu className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight">
                            Traycer
                        </h1>
                    </div>
                    {showHeader && (
                        <p className="text-gray-500 text-center text-sm font-mono tracking-widest uppercase">
                            The Planning Layer for Agents
                        </p>
                    )}
                </div>

                {!options && !plan && decisionHistory.length === 0 && (
                    <TraycerInput
                        onSubmit={handleCreatePlan}
                        isPlanning={isPlanning}
                        loading={isLoading}
                    />
                )}

                {isLoading && !options && <CookingLoader />}

                {options && (
                    <OptionsViewer
                        options={options}
                        onSelect={handleOptionSelect}
                        title={currentDecision?.title}
                        description={currentDecision?.description}
                        isSubmitting={isLoading}
                        selectedOptionId={selectedOptionId}
                        onSkip={handleSkip}
                        onSkipStep={handleSkipStep}
                    />
                )}

                {plan && !isLoading && (
                    <PlanViewer
                        plan={plan}
                    // onStart={handleStartExecution}
                    // isExecuting={isExecuting}
                    />
                )}

            </div>


            {plan && decisionHistory.length > 0 && (
                <div className="fixed bottom-4 left-4 z-50 group">
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-lg p-4 text-xs font-mono text-gray-400 opacity-30 hover:opacity-100 transition-opacity max-w-sm">
                        <div className="font-bold text-white mb-2 uppercase tracking-wider">Session History (Saved)</div>
                        {decisionHistory.map((h, i) => (
                            <div key={i} className="mb-1">
                                <span className="text-gray-500">{i + 1}.</span> <span className="text-purple-400">{h.selectedOption.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
