import { NextResponse } from 'next/server';

// Get overview amount of posts, amount of tags, latest publication
export async function GET() {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}

// Create "quick" post
export async function POST(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}