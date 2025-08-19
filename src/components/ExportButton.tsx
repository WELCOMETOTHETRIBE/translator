"use client";
import React from "react";
import { MessagePair } from "@/lib/types";

type Props = {
  messages: MessagePair[];
  disabled?: boolean;
};

export default function ExportButton({ messages, disabled = false }: Props) {
  const handleExport = () => {
    if (messages.length === 0) return;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `speak-translate-session-${timestamp}.txt`;

    let content = `Speak & Translate Session\n`;
    content += `Generated on: ${new Date().toLocaleString()}\n`;
    content += `Total messages: ${messages.length}\n\n`;
    content += `==========================================\n\n`;

    messages.forEach((pair, index) => {
      content += `Message ${index + 1} - ${new Date(pair.createdAt).toLocaleString()}\n`;
      content += `Source Language: ${pair.sourceLang === 'auto' ? 'Auto-detected' : pair.sourceLang}\n`;
      content += `Target Language: ${pair.targetLang}\n`;
      if (pair.durationSec) {
        content += `Duration: ${Math.round(pair.durationSec)}s\n`;
      }
      content += `\nTRANSCRIPT:\n${pair.transcript}\n\n`;
      content += `TRANSLATION:\n${pair.translation}\n\n`;
      content += `==========================================\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || messages.length === 0}
      className="
        bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold 
        rounded-3xl px-8 py-4 shadow-lg hover:shadow-xl 
        transform hover:scale-105 active:scale-95 transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        flex items-center gap-4 text-lg
      "
    >
      <span className="text-2xl">📄</span>
      <span>Export Session</span>
      {messages.length > 0 && (
        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
          {messages.length}
        </span>
      )}
    </button>
  );
} 