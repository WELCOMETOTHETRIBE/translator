import { NextResponse } from 'next/server';
import { DEFAULT_LANGUAGES } from '@/lib/validate';

export async function GET() {
  return NextResponse.json(DEFAULT_LANGUAGES);
} 