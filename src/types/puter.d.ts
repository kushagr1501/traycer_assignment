
interface PuterChatOptions {
    model?: string;
    stream?: boolean;
}

interface PuterChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface PuterChatResponse {
    message: {
        content: string;
    };
    content?: string;
}

interface PuterAI {
    chat: (messages: PuterChatMessage[], options?: PuterChatOptions) => Promise<PuterChatResponse>;
}

interface Puter {
    ai: PuterAI;
}

declare const puter: Puter;
