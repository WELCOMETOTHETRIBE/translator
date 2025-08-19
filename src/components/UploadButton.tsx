"use client";
import React from "react";
import { isValidAudioFile } from "@/lib/validate";

type Props = {
  onSelect: (file: File) => void;
  disabled?: boolean;
};

export default function UploadButton({ onSelect, disabled = false }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (isValidAudioFile(file)) {
        onSelect(file);
      } else {
        alert('Please select a valid audio file (WAV, MP3, M4A, WebM, or OGG) under 25MB.');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      <button
        onClick={handleClick}
        disabled={disabled}
        className="
          w-full h-24 rounded-3xl font-semibold text-lg transition-all duration-300
          btn-gradient-secondary hover:shadow-2xl
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          border-2 border-dashed border-white/30 hover:border-white/50
        "
      >
        <div className="flex items-center justify-center gap-4">
          <div className="text-4xl">📁</div>
          <div className="text-center">
            <div className="text-xl font-bold">Upload Audio File</div>
            <div className="text-sm opacity-80">WAV, MP3, M4A, WebM, OGG</div>
          </div>
        </div>
      </button>
      
      <div className="text-center text-sm text-white/70">
        <p>Maximum file size: 25MB</p>
      </div>
    </div>
  );
} 