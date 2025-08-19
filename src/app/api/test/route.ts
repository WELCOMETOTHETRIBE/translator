import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    return NextResponse.json({
      fileName: audioFile.name,
      fileType: audioFile.type,
      fileSize: audioFile.size,
      lastModified: audioFile.lastModified,
    });
    
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
} 