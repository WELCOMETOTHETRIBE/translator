export const ALLOWED_AUDIO_TYPES = [
  'audio/wav',
  'audio/mp3',
  'audio/mpeg',
  'audio/m4a',
  'audio/webm',
  'audio/ogg',
  'audio/webm;codecs=opus',
  'audio/webm;codecs=vorbis',
  'audio/ogg;codecs=opus',
  'audio/ogg;codecs=vorbis',
  'audio/mp4',
  'audio/aac',
  'audio/flac'
];

export const ALLOWED_AUDIO_EXTENSIONS = ['.wav', '.mp3', '.m4a', '.webm', '.ogg'];

export const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export function isValidAudioFile(file: File): boolean {
  // Check file size first
  if (file.size > MAX_FILE_SIZE) {
    console.log('File too large:', file.size, 'bytes');
    return false;
  }

  // Check if MIME type is in our allowed list
  if (ALLOWED_AUDIO_TYPES.includes(file.type)) {
    return true;
  }

  // If MIME type is empty or generic, check file extension
  if (!file.type || file.type === 'application/octet-stream') {
    const fileName = file.name.toLowerCase();
    return ALLOWED_AUDIO_EXTENSIONS.some(ext => fileName.endsWith(ext));
  }

  // Check if it's any audio type (more permissive)
  if (file.type.startsWith('audio/')) {
    console.log('Allowing audio type:', file.type);
    return true;
  }

  console.log('Rejected file type:', file.type);
  return false;
}

export function normalizeLanguageCode(code: string): string {
  return code.toLowerCase().trim();
}

export const DEFAULT_LANGUAGES: Array<{ code: string; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: 'Mandarin Chinese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ar', label: 'Arabic' },
  { code: 'bn', label: 'Bengali' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' },
  { code: 'ur', label: 'Urdu' }
];

export const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer", "coral", "verse", "ballad", "ash", "sage"]; 