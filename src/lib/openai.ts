import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
    }
    openaiInstance = new OpenAI({ apiKey });
  }
  return openaiInstance;
}

// For backward compatibility
export const openai = {
  audio: {
    transcriptions: {
      create: async (params: Parameters<OpenAI['audio']['transcriptions']['create']>[0]) => {
        return getOpenAI().audio.transcriptions.create(params);
      }
    },
    speech: {
      create: async (params: Parameters<OpenAI['audio']['speech']['create']>[0]) => {
        return getOpenAI().audio.speech.create(params);
      }
    }
  },
  chat: {
    completions: {
      create: async (params: Parameters<OpenAI['chat']['completions']['create']>[0]) => {
        return getOpenAI().chat.completions.create(params);
      }
    }
  }
}; 