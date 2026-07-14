import { NextResponse } from 'next/server';

// Get post data for form
export async function GET() {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}

// Create post
export async function POST(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}

// Update post
export async function PUT(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}

// Delete post
export async function DELETE(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}