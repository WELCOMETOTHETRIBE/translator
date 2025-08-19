export type Language = { code: string; label: string };

export type TranscribeResponse = {
  transcript: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
  durationSec?: number;
};

export type MessagePair = TranscribeResponse & { 
  id: string; 
  createdAt: string;
};

export type TTSOptions = { 
  voice: string; 
  format: "mp3" | "wav" | "opus" 
};

export type TTSRequest = { 
  text: string; 
  voice: string; 
  format?: TTSOptions["format"] 
};

export type TTSResponse = { 
  ok: true 
}; // audio is streamed, no JSON body when 200 