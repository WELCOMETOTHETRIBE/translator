import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';
import { normalizeLanguageCode } from '@/lib/validate';
import { File as NodeFile } from 'node:buffer';

// Polyfill File constructor for older Node.js versions (Railway compatibility)
if (typeof globalThis.File === 'undefined') {
  globalThis.File = NodeFile as unknown as typeof globalThis.File;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Transcribe API called');
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as unknown as File;
    const sourceLang = formData.get('sourceLang') as string;
    const targetLang = formData.get('targetLang') as string;
    
    console.log('Form data received:', {
      hasAudioFile: !!audioFile,
      sourceLang,
      targetLang,
      audioFileType: audioFile?.type,
      audioFileSize: audioFile?.size
    });

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Validate file size (25MB limit for OpenAI)
    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 25MB.' }, { status: 400 });
    }

    // Validate file type (check base MIME type, ignoring codec specifications)
    const allowedBaseTypes = [
      'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 
      'audio/webm', 'audio/ogg', 'audio/flac', 'audio/mp4'
    ];
    
    const baseType = audioFile.type.split(';')[0]; // Remove codec specification
    
    if (!allowedBaseTypes.includes(baseType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please use WAV, MP3, M4A, WebM, OGG, FLAC, or MP4 files.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ensure file has proper extension
    let fileName = audioFile.name;
    if (!fileName.includes('.')) {
      // If no extension, add one based on MIME type
      const mimeToExt: { [key: string]: string } = {
        'audio/wav': '.wav',
        'audio/mp3': '.mp3',
        'audio/mpeg': '.mp3',
        'audio/m4a': '.m4a',
        'audio/webm': '.webm',
        'audio/ogg': '.ogg',
      };
      const ext = mimeToExt[baseType] || '.mp3';
      fileName = `audio${ext}`;
    }

    // Debug logging
    console.log('File details:', {
      name: fileName,
      type: audioFile.type,
      size: buffer.length,
      originalName: audioFile.name
    });
    
    // Get OpenAI client
    const openai = getOpenAI();

    // Create a proper file-like object that works both locally and on Railway
    // This approach avoids function properties that the OpenAI API rejects
    const fileLike = {
      type: audioFile.type,
      size: buffer.length,
      name: fileName,
      // Provide the buffer directly without function wrappers
      [Symbol.asyncIterator]: async function* () {
        yield buffer;
      }
    };

    const transcription = await openai.audio.transcriptions.create({
      file: fileLike as unknown as File,
      model: 'whisper-1',
      language: sourceLang === 'auto' ? undefined : normalizeLanguageCode(sourceLang),
    });

    const transcript = transcription.text;

    // Get language name from code for better translation
    const getLanguageName = (code: string): string => {
      const languageMap: { [key: string]: string } = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'zh': 'Chinese',
        'hi': 'Hindi',
        'ar': 'Arabic',
        'bn': 'Bengali',
        'ur': 'Urdu'
      };
      return languageMap[code.toLowerCase()] || code;
    };

    // Debug logging for translation
    console.log('Translation request:', {
      sourceLang,
      targetLang,
      normalizedTargetLang: normalizeLanguageCode(targetLang),
      languageName: getLanguageName(targetLang),
      transcript: transcript.substring(0, 100) + '...'
    });

    // Translate transcript
    const translationResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a precise translator. Translate the user's text into ${getLanguageName(targetLang)} while preserving meaning, tone, and punctuation. Do not add commentary.`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      temperature: 0.3,
    });

    const translation = translationResponse.choices[0]?.message?.content || '';

    // Debug logging for translation result
    console.log('Translation result:', {
      targetLang,
      translation: translation.substring(0, 100) + '...'
    });

    return NextResponse.json({
      transcript,
      translation,
      sourceLang: sourceLang === 'auto' ? 'auto' : normalizeLanguageCode(sourceLang),
      targetLang: normalizeLanguageCode(targetLang),
      durationSec: undefined // Could be calculated from audio metadata if needed
    });

  } catch (error) {
    console.error('Transcription error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid file format')) {
        return NextResponse.json(
          { error: 'Unsupported audio format. Please use WAV, MP3, M4A, WebM, or OGG files.' },
          { status: 400 }
        );
      }
      if (error.message.includes('file size')) {
        return NextResponse.json(
          { error: 'Audio file is too large. Please use files under 25MB.' },
          { status: 400 }
        );
      }
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'OpenAI API key is not configured. Please contact support.' },
          { status: 500 }
        );
      }
    }
    
    // Log the full error for debugging
    console.error('Full error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      error: error
    });
    
    return NextResponse.json(
      { error: 'Failed to transcribe audio. Please try again.' },
      { status: 500 }
    );
  }
} 