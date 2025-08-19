# 🎤 Speak & Translate

A modern web application that records or uploads audio, transcribes it with OpenAI's Whisper, translates the transcript to a chosen language, and provides text-to-speech playback of the translation.

## ✨ Features

- **🎤 Audio Recording**: Record audio directly from your microphone
- **📁 File Upload**: Upload audio files (WAV, MP3, M4A, WebM, OGG)
- **🔤 Speech-to-Text**: Transcribe audio using OpenAI's Whisper model
- **🌍 Translation**: Translate transcripts to 10+ languages
- **🔊 Text-to-Speech**: Play back translations with 6 different AI voices
- **💾 Export**: Download session transcripts and translations as text files
- **📱 Mobile-Friendly**: Responsive design that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd translate_transcribe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PREFERRED_TTS_MODEL=gpt-4o-mini-tts
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Services**: OpenAI API (Whisper, GPT-4o-mini, TTS)
- **State Management**: React Hooks
- **Audio Processing**: MediaRecorder API, Web Audio API

## 📋 API Routes

### `/api/transcribe`
- **Method**: POST
- **Purpose**: Transcribe and translate audio
- **Input**: Multipart form data with audio file, sourceLang, targetLang
- **Output**: JSON with transcript, translation, and metadata

### `/api/tts`
- **Method**: POST
- **Purpose**: Convert text to speech
- **Input**: JSON with text, voice, format
- **Output**: Audio file stream

### `/api/languages`
- **Method**: GET
- **Purpose**: Get supported languages
- **Output**: JSON array of language codes and labels

## 🌍 Supported Languages

- English (en)
- Mandarin Chinese (zh)
- Hindi (hi)
- Spanish (es)
- French (fr)
- Arabic (ar)
- Bengali (bn)
- Portuguese (pt)
- Russian (ru)
- Urdu (ur)

## 🎵 Voice Options

- alloy
- echo
- fable
- onyx
- nova
- shimmer
- coral
- verse
- ballad
- ash
- sage

## 📁 File Support

**Audio Formats**: WAV, MP3, M4A, WebM, OGG
**Max File Size**: 25MB
**Recording Quality**: 48kHz mono

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `PREFERRED_TTS_MODEL` | Preferred TTS model (default: gpt-4o-mini-tts) | No |

### Next.js Configuration

The app is configured for:
- Node.js runtime (not Edge)
- 25MB file upload limit
- CORS disabled (same-origin only)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

### Manual Testing Checklist

- [ ] Record audio and verify transcription
- [ ] Upload audio file and verify processing
- [ ] Test translation to different languages
- [ ] Test TTS playback with different voices
- [ ] Export session data
- [ ] Test mobile responsiveness
- [ ] Verify error handling for invalid files

### API Testing

```bash
# Test transcription
curl -X POST http://localhost:3000/api/transcribe \
  -F "audio=@test-audio.mp3" \
  -F "sourceLang=en" \
  -F "targetLang=es"

# Test TTS
curl -X POST http://localhost:3000/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","voice":"Alloy","format":"mp3"}'
```

## 🔒 Security

- OpenAI API key is never exposed to the client
- File uploads are validated for type and size
- Input sanitization on all API endpoints
- Rate limiting considerations for production

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

**"Could not access microphone"**
- Check browser permissions
- Ensure HTTPS in production (required for MediaRecorder)

**"Failed to transcribe audio"**
- Verify OpenAI API key is valid
- Check audio file format and size
- Ensure internet connection

**TTS not working**
- Check if preferred TTS model is available
- Verify voice selection is valid

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment.

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

## 🎨 **Beautiful Modern UI**

The application features a stunning, modern design with:
- **Glass Morphism Effects**: Translucent cards with backdrop blur
- **Gradient Backgrounds**: Beautiful purple-blue gradient with floating elements
- **Smooth Animations**: Fade-in, slide-up, and floating animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Modern Typography**: Inter font family for clean, readable text
- **Intuitive UX**: Clear visual hierarchy and user-friendly interactions

---

Built with ❤️ using Next.js and OpenAI
