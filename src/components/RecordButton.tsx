"use client";
import React from "react";

type Props = {
  onComplete: (blob: Blob) => void;
  disabled?: boolean;
};

export default function RecordButton({ onComplete, disabled = false }: Props) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 48000,
          channelCount: 1 
        } 
      });
      
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/wav';
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      
      const chunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const extension = mimeType.includes('webm') ? '.webm' : 
                         mimeType.includes('mp4') ? '.mp4' : 
                         mimeType.includes('wav') ? '.wav' : '.mp3';
        const fileName = `recording-${timestamp}${extension}`;
        
        const file = new File([blob], fileName, { type: mimeType });
        onComplete(file);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        className={`
          w-full h-16 sm:h-20 md:h-24 rounded-2xl sm:rounded-3xl font-semibold text-base sm:text-lg transition-all duration-300 relative overflow-hidden flex-shrink-0
          ${isRecording 
            ? 'btn-gradient-accent hover:shadow-2xl' 
            : 'btn-gradient-primary hover:shadow-2xl'
          }
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        `}
      >
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {isRecording ? (
            <>
              <div className="relative">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full animate-pulse-slow"></div>
                <div className="absolute inset-0 w-6 h-6 sm:w-8 sm:h-8 bg-white/30 rounded-full animate-ping"></div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold">Stop Recording</div>
                <div className="text-xs sm:text-sm opacity-90">{formatTime(recordingTime)}</div>
              </div>
            </>
          ) : (
            <>
              <div className="text-3xl sm:text-4xl">🎤</div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold">Record Audio</div>
                <div className="text-xs sm:text-sm opacity-80">Click to start recording</div>
              </div>
            </>
          )}
        </div>
        
        {/* Recording wave animation */}
        {isRecording && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        )}
      </button>
      
      {isRecording && (
        <div className="text-center text-xs sm:text-sm text-white/70 animate-fade-in px-2 mt-3">
          <p>🔴 Recording in progress... Click to stop</p>
        </div>
      )}
    </div>
  );
} 