import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { VOICES } from "@/lib/validate";

export const runtime = "nodejs";

const ALLOWED_VOICES = VOICES;
const FORMAT_MAP = {
  mp3: { mime: "audio/mpeg" as const },
  wav: { mime: "audio/wav" as const },
  opus: { mime: "audio/ogg" as const },
};

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "Alloy", format = "mp3" } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), { status: 400 });
    }

    if (text.length > 10000) {
      return new Response(JSON.stringify({ error: "Text too long (max 10k chars)" }), { status: 400 });
    }

    const v = ALLOWED_VOICES.includes(voice) ? voice : "alloy";
    const fmt = (["mp3","wav","opus"].includes(format) ? format : "mp3") as "mp3"|"wav"|"opus";

    // Prefer newer TTS model if available; fallback gracefully
    const model = process.env.PREFERRED_TTS_MODEL || "gpt-4o-mini-tts";
    const fallbackModel = "tts-1";

    let audioResp;
    try {
      audioResp = await openai.audio.speech.create({
        model,
        voice: v,
        input: text,
        response_format: fmt,
      });
    } catch (error) {
      console.log("Primary TTS model failed, trying fallback:", error);
      audioResp = await openai.audio.speech.create({
        model: fallbackModel,
        voice: v,
        input: text,
        response_format: fmt,
      });
    }

    // Get the audio data
    const arrayBuffer = await audioResp.arrayBuffer();

    const headers = new Headers({
      "Content-Type": FORMAT_MAP[fmt].mime,
      "Cache-Control": "no-store",
      "Content-Disposition": `inline; filename="tts.${fmt}"`,
    });

    return new Response(arrayBuffer, { status: 200, headers });
  } catch (err) {
    console.error("TTS error:", err);
    
    // Provide more specific error messages
    if (err instanceof Error) {
      if (err.message.includes('Invalid value') && err.message.includes('voice')) {
        return new Response(JSON.stringify({ 
          error: `Invalid voice. Supported voices: ${ALLOWED_VOICES.join(', ')}` 
        }), { status: 400 });
      }
    }
    
    return new Response(JSON.stringify({ error: "TTS failed. Please try again." }), { status: 500 });
  }
} 