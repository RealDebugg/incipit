import { NextResponse } from 'next/server';

// Get all tags
export async function GET() {
    return NextResponse.json({ message: 'Hello from Next.js API!' });
}

// Create tag
export async function POST(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}

// Update tag
export async function PUT(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}

// Delete tag
export async function DELETE(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}