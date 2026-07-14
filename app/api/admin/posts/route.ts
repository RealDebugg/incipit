import { NextResponse } from 'next/server';

// TODO: Get posts and their summary, paginated
export async function GET() {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}