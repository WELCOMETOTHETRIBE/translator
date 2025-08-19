"use client";
import React from "react";
import { MessagePair } from "@/lib/types";
import AudioPlayerButton from "./AudioPlayerButton";

type Props = {
  messages: MessagePair[];
  currentVoice: string;
};

export default function ChatWindow({ messages, currentVoice }: Props) {
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (messages.length === 0) {
    return (
      <div className="glass-card h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="text-center">
          <div className="text-8xl mb-8 floating-element">🎤</div>
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Translate
          </h3>
          <p className="text-xl text-white/80 mb-2">
            Start by recording or uploading audio
          </p>
          <p className="text-white/60">
            Your transcriptions and translations will appear here
          </p>
          
          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mt-8">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card h-[60vh] overflow-y-auto space-y-8 p-6 animate-fade-in">
      {messages.map((pair, index) => (
        <div key={pair.id} className="space-y-4 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
          {/* Transcript */}
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="message-bubble-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-300">
                    Transcript ({pair.sourceLang === 'auto' ? 'Auto-detected' : pair.sourceLang.toUpperCase()})
                  </span>
                </div>
                <div className="text-white text-lg leading-relaxed">{pair.transcript}</div>
              </div>
            </div>
          </div>

          {/* Translation */}
          <div className="flex justify-end">
            <div className="max-w-[85%]">
              <div className="message-bubble-right">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm font-semibold text-green-300">
                    Translation ({pair.targetLang.toUpperCase()})
                  </span>
                </div>
                <div className="text-white text-lg leading-relaxed mb-6">{pair.translation}</div>
                
                {/* Audio controls */}
                <div className="border-t border-green-400/20 pt-4">
                  <AudioPlayerButton
                    text={pair.translation}
                    voice={currentVoice}
                    format="mp3"
                    filename={`translation-${pair.id}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-xs text-white/60 glass-card px-4 py-2">
              <span>🕒 {formatTime(pair.createdAt)}</span>
              {pair.durationSec && (
                <>
                  <span>•</span>
                  <span>⏱️ {Math.round(pair.durationSec)}s</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
} 