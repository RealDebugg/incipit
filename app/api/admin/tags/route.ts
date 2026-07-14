import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// Get all tags
export async function GET() {
    const data = await prisma.tags.findMany();
    return NextResponse.json({ data });
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