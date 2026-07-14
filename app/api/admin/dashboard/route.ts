import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// Get dashboard overview
export async function GET() {
    try {
        const postsCount = await prisma.posts.count();
        const tagsCount = await prisma.tags.count();
        const latestPost = await prisma.posts.findFirst({
            take: 1,
            where: {
                status: 1, //Published
            },
            orderBy: {
                date: 'desc',
            },
            select: {
                id: true,
                date: true,
                title: true,
            },
        });

        return NextResponse.json({ postsCount, tagsCount, latestPost });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data', reason: err.message },
            { status: 500 }
        );
    }
}

// TODO: Create "quick" post
export async function POST(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}