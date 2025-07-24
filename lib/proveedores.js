export const proveedores = {
    openrouter: {
        endpoint: "https://openrouter.ai/api/v1/chat/completions",
        key: process.env.OPENROUTER_API_KEY
    },
    groq: {
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        key: process.env.GROQ_API_KEY
    },
    together: {
        endpoint: "https://api.together.xyz/v1/chat/completions",
        key: process.env.TOGETHER_API_KEY
    }

};
