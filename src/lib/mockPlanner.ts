export type PlanStep = {
    id: string;
    title: string;
    description: string;
};

export type Plan = {
    id: string;
    steps: PlanStep[];
};

export const MOCK_PLANS: Record<string, Plan> = {
    "default": {
        id: "plan-default",
        steps: [
            { id: "1", title: "Analyze Request", description: "Parsing user intent and context..." },
            { id: "2", title: "Research Architecture", description: "Checking best practices and existing patterns..." },
            { id: "3", title: "Draft Implementation Plan", description: "Creating detailed step-by-step blueprint..." },
            { id: "4", title: "Verify Feasibility", description: "Cross-referencing dependencies and constraints..." },
        ]
    },
    "snake": {
        id: "plan-snake",
        steps: [
            { id: "1", title: "Game Loop Logic", description: "Designing the core tick mechanism..." },
            { id: "2", title: "Canvas Rendering", description: "Setting up grid and painting entities..." },
            { id: "3", title: "Input Handling", description: "Mapping keyboard arrows to direction vectors..." },
            { id: "4", title: "Collision Detection", description: "Implementing snake-to-wall and snake-to-self logic..." },
        ]
    }
};

export async function generatePlan(prompt: string): Promise<Plan> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const key = prompt.toLowerCase().includes("snake") ? "snake" : "default";
    return structuredClone(MOCK_PLANS[key]); // Return deep copy
}

export type StrategicOption = {
    id: string;
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    riskLevel: 'low' | 'medium' | 'high';
};

export type DecisionStep = {
    id: string;
    title: string;
    description: string;
    type: 'decision';
    options: StrategicOption[];
};

export type DecisionHistory = {
    stepId: string;
    stepTitle: string;
    selectedOption: StrategicOption;
}[];


//mock data for offline purpose 
export const MOCK_OPTIONS: StrategicOption[] = [
    {
        id: "1",
        title: "The Vanilla Route",
        description: "Zero dependencies. Just pure HTML, CSS, and modern JavaScript. Maximum performance, total control.",
        pros: ["No build step needed", "Instant load times", "100% standards compliant"],
        cons: ["Manual DOM manipulation", "Harder state management", "No component reuse"],
        riskLevel: 'low'
    },
    {
        id: "2",
        title: "The Modern Stack",
        description: "React 19 + Vite + TailwindCSS. The gold standard for modern web development. Fast, component-driven, and beautiful.",
        pros: ["Rich ecosystem", "Rapid UI development", "Declarative state model"],
        cons: ["Hydration overhead", "Build configuration", "Dependency fatigue"],
        riskLevel: 'medium'
    },
    {
        id: "3",
        title: "The Enterprise Grade",
        description: "Angular + RxJS + TypeScript (Strict). Opinionated, robust, and designed for massive scale and team collaboration.",
        pros: ["Built-in architecture", "Type safety enforced", "Batteries included"],
        cons: ["Steep learning curve", "High boilerplate", "Complex reactive streams"],
        riskLevel: 'high'
    }
];

export async function generateOptions(prompt: string): Promise<StrategicOption[]> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return structuredClone(MOCK_OPTIONS);
}
