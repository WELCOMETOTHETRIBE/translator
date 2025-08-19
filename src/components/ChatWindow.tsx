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
      <div className="glass-card h-[50vh] sm:h-[60vh] flex items-center justify-center animate-fade-in">
        <div className="text-center px-4">
          <div className="text-6xl sm:text-8xl mb-6 sm:mb-8 floating-element">🎤</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Translate
          </h3>
          <p className="text-lg sm:text-xl text-white/80 mb-2">
            Start by recording or uploading audio
          </p>
          <p className="text-sm sm:text-base text-white/60">
            Your transcriptions and translations will appear here
          </p>
          
          {/* Decorative elements */}
          <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card h-[50vh] sm:h-[60vh] overflow-y-auto space-y-6 sm:space-y-8 p-4 sm:p-6 animate-fade-in">
      {messages.map((pair, index) => (
        <div key={pair.id} className="space-y-3 sm:space-y-4 animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
          {/* Transcript */}
          <div className="flex justify-start">
            <div className="max-w-[90%] sm:max-w-[85%]">
              <div className="message-bubble-left">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm font-semibold text-blue-300">
                    Transcript ({pair.sourceLang === 'auto' ? 'Auto-detected' : pair.sourceLang.toUpperCase()})
                  </span>
                </div>
                <div className="text-white text-sm sm:text-lg leading-relaxed">{pair.transcript}</div>
              </div>
            </div>
          </div>

          {/* Translation */}
          <div className="flex justify-end">
            <div className="max-w-[90%] sm:max-w-[85%]">
              <div className="message-bubble-right">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                  <span className="text-xs sm:text-sm font-semibold text-green-300">
                    Translation ({pair.targetLang.toUpperCase()})
                  </span>
                </div>
                <div className="text-white text-sm sm:text-lg leading-relaxed mb-4 sm:mb-6">{pair.translation}</div>
                
                {/* Audio controls */}
                <div className="border-t border-green-400/20 pt-3 sm:pt-4">
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
            <div className="inline-flex items-center gap-2 sm:gap-3 text-xs text-white/60 glass-card px-3 py-1 sm:px-4 sm:py-2">
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