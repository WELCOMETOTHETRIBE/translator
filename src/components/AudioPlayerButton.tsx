"use client";
import React from "react";

type Props = {
  text: string;
  voice: string;
  format?: "mp3" | "wav" | "opus";
  filename?: string;
};

const cache = new Map<string, string>(); // key -> blob URL

function hash(s: string) {
  // simple stable hash for cache keys
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h.toString(16);
}

export default function AudioPlayerButton({
  text,
  voice,
  format = "mp3",
  filename = "translation",
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const key = `${hash(text)}_${voice}_${format}`;

  async function ensureBlobUrl(): Promise<string> {
    const cached = cache.get(key);
    if (cached) return cached;

    setLoading(true);
    try {
      const resp = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, format }),
      });
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || "TTS request failed");
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      cache.set(key, url);
      return url;
    } finally {
      setLoading(false);
    }
  }

  async function handlePlay() {
    try {
      const url = await ensureBlobUrl();
      const audio = new Audio(url);
      await audio.play();
    } catch (error) {
      console.error('Playback error:', error);
      alert(error instanceof Error ? error.message : 'Failed to play audio');
    }
  }

  async function handleDownload() {
    try {
      const url = await ensureBlobUrl();
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download audio');
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
      <button
        onClick={handlePlay}
        disabled={loading}
        className="btn-gradient-primary flex items-center gap-2 sm:gap-3 text-xs sm:text-sm py-2 sm:py-3 px-4 sm:px-6 disabled:opacity-50 w-full sm:w-auto"
        aria-label="Play translation"
        title="Play translation"
      >
        {loading ? (
          <>
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <span className="text-lg sm:text-xl">▶️</span>
            <span>Play</span>
          </>
        )}
      </button>
      
      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-gradient-secondary flex items-center gap-2 sm:gap-3 text-xs sm:text-sm py-2 sm:py-3 px-4 sm:px-6 disabled:opacity-50 w-full sm:w-auto"
        aria-label="Download audio"
        title="Download audio"
      >
        <span className="text-lg sm:text-xl">⬇️</span>
        <span>Download</span>
      </button>
    </div>
  );
} 