import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { isValidAudioFile, normalizeLanguageCode } from '@/lib/validate';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const sourceLang = (formData.get('sourceLang') as string) || 'auto';
    const targetLang = (formData.get('targetLang') as string) || 'en';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // Debug logging for file validation
    console.log('File validation details:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
      isValid: isValidAudioFile(audioFile)
    });

    if (!isValidAudioFile(audioFile)) {
      return NextResponse.json(
        { error: `Invalid audio file. Received type: ${audioFile.type}, size: ${audioFile.size} bytes. Must be WAV, MP3, M4A, WebM, or OGG and under 25MB` },
        { status: 400 }
      );
    }

    // Convert File to Buffer for OpenAI
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure we have a valid file extension for OpenAI
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
      const ext = mimeToExt[audioFile.type] || '.mp3';
      fileName = `audio${ext}`;
    }

    // Create a proper file object for OpenAI
    const file = new File([buffer], fileName, { type: audioFile.type });
    
    // Debug logging
    console.log('File details:', {
      name: fileName,
      type: audioFile.type,
      size: buffer.length,
      originalName: audioFile.name
    });
    
    // Transcribe audio with fallback approach
    let transcription;
    try {
      transcription = await openai.audio.transcriptions.create({
        file: file,
        model: 'whisper-1',
        language: sourceLang === 'auto' ? undefined : normalizeLanguageCode(sourceLang),
      });
    } catch (transcriptionError) {
      console.error('First transcription attempt failed:', transcriptionError);
      
      // Try with a different approach - create file with explicit extension
      const fallbackFileName = fileName.includes('.') ? fileName : `audio.mp3`;
      const fallbackFile = new File([buffer], fallbackFileName, { type: 'audio/mpeg' });
      
      transcription = await openai.audio.transcriptions.create({
        file: fallbackFile,
        model: 'whisper-1',
        language: sourceLang === 'auto' ? undefined : normalizeLanguageCode(sourceLang),
      });
    }

    const transcript = transcription.text;

    // Translate transcript
    const translationResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a precise translator. Translate the user's text into ${targetLang} while preserving meaning, tone, and punctuation. Do not add commentary.`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      temperature: 0.3,
    });

    const translation = translationResponse.choices[0]?.message?.content || '';

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
    }
    
    return NextResponse.json(
      { error: 'Failed to transcribe audio. Please try again.' },
      { status: 500 }
    );
  }
} 