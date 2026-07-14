import { NextResponse } from 'next/server';

// Get posts and their summary, paginated
export async function GET() {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}