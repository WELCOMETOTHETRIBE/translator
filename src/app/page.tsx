"use client";
import React from "react";
import { Language, MessagePair, TranscribeResponse } from "@/lib/types";
import { DEFAULT_LANGUAGES, VOICES } from "@/lib/validate";
import LanguageSelect from "@/components/LanguageSelect";
import RecordButton from "@/components/RecordButton";
import UploadButton from "@/components/UploadButton";
import ChatWindow from "@/components/ChatWindow";
import ExportButton from "@/components/ExportButton";

export default function Home() {
  const [languages, setLanguages] = React.useState<Language[]>(DEFAULT_LANGUAGES);
  const [sourceLang, setSourceLang] = React.useState("");
  const [targetLang, setTargetLang] = React.useState("en");
  const [voice, setVoice] = React.useState("alloy");
  const [messages, setMessages] = React.useState<MessagePair[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Fetch languages on mount
  React.useEffect(() => {
    fetch('/api/languages')
      .then(res => res.json())
      .then(data => setLanguages(data))
      .catch(err => console.error('Failed to fetch languages:', err));
  }, []);

  const submitAudio = async (audioInput: Blob | File) => {
    if (!targetLang) {
      alert('Please select a target language');
      return;
    }

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioInput);
      formData.append('sourceLang', sourceLang || 'auto');
      formData.append('targetLang', targetLang);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to transcribe audio';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const result: TranscribeResponse = await response.json();
      
      const newMessage: MessagePair = {
        ...result,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => {
        const updated = [...prev, newMessage];
        return updated.slice(-20);
      });

    } catch (error) {
      console.error('Error processing audio:', error);
      
      let errorMessage = 'Failed to process audio';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'error' in error) {
        errorMessage = (error as { error: string }).error;
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 sm:left-20 w-32 h-32 sm:w-64 sm:h-64 bg-purple-500/20 rounded-full blur-3xl floating-element"></div>
        <div className="absolute bottom-20 right-10 sm:right-20 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl floating-element" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 sm:w-72 sm:h-72 bg-pink-500/20 rounded-full blur-3xl floating-element" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <header className="text-center py-4 sm:py-6 md:py-8 animate-fade-in">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 floating-element">🎤</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-3 sm:mb-4">
            Speak & Translate
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Transform your voice into any language with AI-powered transcription, 
            translation, and natural text-to-speech
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4">
            <div className="glass-card px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg sm:text-2xl">🎯</span>
              <span className="font-medium">Real-time Recording</span>
            </div>
            <div className="glass-card px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg sm:text-2xl">🌍</span>
              <span className="font-medium">10+ Languages</span>
            </div>
            <div className="glass-card px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm sm:text-base">
              <span className="text-lg sm:text-2xl">🔊</span>
              <span className="font-medium">AI Voices</span>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="glass-card p-4 sm:p-6 md:p-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            <LanguageSelect
              languages={languages}
              value={sourceLang}
              onChange={setSourceLang}
              label="Origin Language"
              placeholder="Auto-detect"
            />
            
            <LanguageSelect
              languages={languages}
              value={targetLang}
              onChange={setTargetLang}
              label="Target Language"
              placeholder="Select target language"
            />

            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">
                Voice
              </label>
              <div className="relative">
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="glass-input w-full appearance-none pr-10 text-sm sm:text-base"
                >
                  {VOICES.map(v => (
                    <option key={v} value={v} className="bg-gray-800 text-white">
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex flex-col h-full">
            <RecordButton
              onComplete={submitAudio}
              disabled={isProcessing}
            />
          </div>
          <div className="flex flex-col h-full">
            <UploadButton
              onSelect={submitAudio}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="text-center py-6 sm:py-8 animate-fade-in">
            <div className="glass-card inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4">
              <div className="relative">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
              <div className="text-base sm:text-lg font-medium text-white">
                Processing your audio...
              </div>
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
          <ChatWindow 
            messages={messages} 
            currentVoice={voice}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-6 sm:py-8 animate-slide-up" style={{animationDelay: '0.6s'}}>
          <ExportButton 
            messages={messages} 
            disabled={isProcessing}
          />
          
          {/* Stats */}
          {messages.length > 0 && (
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-sm text-white/70">
              <div className="glass-card px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center gap-2">
                <span className="text-purple-400">📊</span>
                <span>{messages.length} translation{messages.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="glass-card px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center gap-2">
                <span className="text-blue-400">🌍</span>
                <span>{new Set(messages.map(m => m.targetLang)).size} language{new Set(messages.map(m => m.targetLang)).size !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
