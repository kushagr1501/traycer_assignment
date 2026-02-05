import { type Plan, type StrategicOption, type DecisionHistory, type DecisionStep, MOCK_PLANS, MOCK_OPTIONS } from './mockPlanner';

declare const puter: any;


// So here we are using Puter.js Grok API Call(free) 
export async function generatePlan(prompt: string): Promise<Plan> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are Traycer, an expert coding architect. 
            Your goal is to break down a user's coding request into a JSON execution plan.
            
            Return ONLY raw JSON. No markdown formatting. No explanation.
            
            The JSON schema must be:
            {
              "id": "string (unique)",
              "steps": [
                {
                  "id": "string",
                  "title": "Short title of the step",
                  "description": "Technical description of what to do"
                }
              ]
            }`
      },
      {
        role: "user" as const,
        content: `Create a plan for: ${prompt}`
      }
    ];

    // puter is injected via global script cdn 
    const response = await puter.ai.chat(messages, { model: "gpt-4o-mini" });
    console.log("Response: ", response); //here the main ai output is inside the response's message's content 

    const content = response?.message?.content || response?.content || "";

    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const realPlan: Plan = JSON.parse(cleanJson);
    return realPlan;

  } catch (error) {
    console.error("Failed to generate real plan:", error);

    return structuredClone(MOCK_PLANS["default"]);
  }
}



export async function generateOptions(prompt: string): Promise<StrategicOption[]> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are a Senior CTO. The user wants to build: "${prompt}".
                
                Provide 3 distinct technical approaches (stacks) to build this.
                1. "The Low-Code / Simple Route" (Fastest, simplest tools)
                2. "The Modern Standard" (React/Vite/Tailwind or similar standard stack)
                3. "The Over-Engineered / Enterprise Route" (Scalable, complex, robust)

                Return ONLY raw JSON. No markdown.
                
                Schema:
                [
                  {
                    "id": "1",
                    "title": "Name of the stack",
                    "description": "Why choose this? What tech is inside?",
                    "pros": ["pro1", "pro2", "pro3"],
                    "cons": ["con1", "con2", "con3"],
                    "riskLevel": "low" | "medium" | "high" 
                  },
                  ...
                ]`
      },
      {
        role: "user" as const,
        content: `Generate options for: ${prompt}`
      }
    ];

    const response = await puter.ai.chat(messages, { model: "gpt-4o-mini" });
    const content = response?.message?.content || response?.content || "";
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const options: StrategicOption[] = JSON.parse(cleanJson);
    return options;

  } catch (error) {
    console.error("Failed to generate options:", error);
    return structuredClone(MOCK_OPTIONS);
  }
}

export async function generateNextDecision(prompt: string, history: DecisionHistory): Promise<DecisionStep | null> {
  try {
    const historyText = history.map((h, i) => `Step ${i + 1}: ${h.stepTitle}\nUser Selected: ${h.selectedOption.title} (${h.selectedOption.description})`).join('\n\n');

    const messages = [
      {
        role: "system" as const,
        content: `You are a Senior CTO Architect. The user wants to build: "${prompt}".
        
        You are in an iterative planning mode. You need to guide the user through critical technical decisions one by one.
        
        Current Decision History:
        ${historyText}

        Analyze the history. 
        Rules:
        1. ASK MAX 6-7 QUESTIONS TOTAL. usage history length to decide.
        2. FOCUS ONLY ON CRITICAL ARCHITECTURE: Frontend Stack, Database, Auth.
        3. DO NOT ASK about Deployment, Hosting, Testing, or minor libraries unless explicitly critical.
        4. If you have the Stack, DB, and Auth, and if vercel deployment is selected, STOP and return {"complete": true}.

        1. If you need more information or another key technical decision is required before building the plan, return a JSON object for the next decision step.
           Schema:
           {
             "id": "unique-step-id",
             "title": "Title of the Decision",
             "description": "Why this decision matters now.",
             "type": "decision",
             "options": [
                {
                    "id": "1",
                    "title": "Option Name",
                    "description": "Tech details...",
                    "pros": ["..."],
                    "cons": ["..."],
                    "riskLevel": "low" | "medium" | "high" 
                },
                ... (provide 2-5 distinct options)
             ]
           }

        2. If you have enough information to build a solid execution plan, return NULL or explicit "complete" signal.
           To signal completion, return exactly: {"complete": true}

        Return ONLY raw JSON.
        `
      },
      {
        role: "user" as const,
        content: history.length === 0 ? `Let's start. What is the first critical technical decision for: ${prompt}?` : `Here is my previous choice. What is the next decision?`
      }
    ];

    const response = await puter.ai.chat(messages, { model: "gpt-4o-mini" });
    const content = response?.message?.content || response?.content || "";
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

    const result = JSON.parse(cleanJson);

    if (result.complete) {
      return null;
    }

    return result as DecisionStep;

  } catch (error) {
    console.error("Error generating decision:", error);
    // Fallback for demo if offline or error, assuming first step
    if (history.length === 0) {
      return {
        id: "init-1",
        title: "Choose Your Tech Stack",
        description: "Before we build, we need to decide on the foundation.",
        type: "decision",
        options: structuredClone(MOCK_OPTIONS)
      };
    }
    return null;
  }
}
