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
      create: async (...args: Parameters<OpenAI['audio']['transcriptions']['create']>) => {
        return getOpenAI().audio.transcriptions.create(...args);
      }
    },
    speech: {
      create: async (...args: Parameters<OpenAI['audio']['speech']['create']>) => {
        return getOpenAI().audio.speech.create(...args);
      }
    }
  },
  chat: {
    completions: {
      create: async (...args: Parameters<OpenAI['chat']['completions']['create']>) => {
        return getOpenAI().chat.completions.create(...args);
      }
    }
  }
}; 