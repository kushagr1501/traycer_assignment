#  Traycer AI Assignment 

**The Planning Layer for Autonomous Agents.**

THis project  is a reverse-engineered implementation of an Traycer AI "Thought Process". Instead of just sending a prompt and getting code,  sits in the middle. It acts as the **Architect**, breaking down complex user requests into strategic decisions, iterative refinements, and finally, a concrete execution plan.


---

## The Tech Stack

-   **Core**: React 19 + TypeScript + Vite
-   **Styling**: TailwindCSS (Utility-first, heavily animated)
-   **Animations**: Framer Motion (for that "premium" feel)
-   **AI Layer**: [Puter.js](https://puter.com) (GPT-4o-mini powered)
-   **Icons**: Lucide React
-   **State**: LocalStorage persistence for session continuity

---

## The "Reverse Engineered" Logic

The core innovation of this project is how it deconstructs a prompt. It doesn't just "answer"; it **thinks** through a specific flow we call **"Yolo Mode"**.

### 1.  Strategic Forking (`generateOptions`)
When you first type a request (e.g., *"Build a Twitter Clone"*), this project doesn't just start coding. It calls `generateOptions` to analyze your intent and presents **3 distinct architectural paths**:
*   *The Simple Route* (Low-code/Fast)
*   *The Modern Standard* (Balanced)
*   *The Enterprise Route* (Robust/Scalable)

This forces the user to align on the *High-Level Strategy* 

### 2. The Iterative Loop (`generateNextDecision`)
Once a path is chosen, we enter the recursive **Decision Loop**.
*   **Recursive Interrogation**: It looks at decisionHistory and asks critical questions (e.g., "SQL vs NoSQL?", "Auth provider selection?").
*   **Skip Logic**: Includes a "Sensible Defaults" engine—if a user skips a question, the AI fills the gap with an industry-standard choice to maintain momentum.

### 3.  The Architect (`generatePlan`)
The final output layer. It aggregates the prompt and the accumulated decision context into a structured JSON execution plan. This provides a coding agent with a linear, step-by-step ticket system to minimize hallucinations.
---

## Key Methods & Architecture

Located in `src/lib/aiService.ts`, these are the primitives that power the agent.

### `generateOptions(prompt)`
> **Input**: User Prompt string
> **Output**: Array of 3 `StrategicOption` objects.
> **Role**: The "Consultant". Generates high-level choices with Pros/Cons and Risk analysis.

### `generateNextDecision(prompt, history)`
> **Input**: User Prompt + Array of previous decisions.
> **Output**: `DecisionStep` OR `Plan` (Polymorphic return).
> **Role**: The "Project Manager". It decides if we need to ask another question or if we are ready to build. It intelligently helps the user skip minor details (`skip` logic) and focuses only on critical architectural blockers.

### `generatePlan(planContext)`
> **Input**: A rich string context containing the goal + all made decisions.
> **Output**: `Plan` object (JSON).
> **Role**: The "Tech Lead". Converts the abstract decisions into a concrete, linear set of tickets/tasks.

---

## Features

*   **Yolo Mode**: A gamified, card-based decision flow.
*   **Skip Logic**: Don't care about a specific database? Click "Skip", and the AI fills in the blank with a sensible default.
*   **Build Now**: A "Panic Button" to stop the questions and generate the plan immediately based on what we know so far.

---

## How to Run

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Dev Server**
    ```bash
    npm run dev
    ```

3.  **Open in Browser**
    Visit `http://localhost:5173`

---
