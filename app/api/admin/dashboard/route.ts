import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import {validateInput} from "@/lib/validation";

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

        return NextResponse.json({ postsCount, tagsCount, latestPost }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data', reason: err.message },
            { status: 500 }
        );
    }
}

// Create a "quick" post
interface PostQuickPostReqBody {
    title: string;
    content: string;
    author: string;
}
export async function POST(request: Request) {
    try {
        const data: PostQuickPostReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'title', type: 'string', required: true },
            { field: 'content', type: 'string', required: true },
            { field: 'author', type: 'string', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.posts.create({
            data: {
                title: data.title,
                content: data.content,
                author: data.author,
                status: 1,
            }
        })

        return NextResponse.json({ res }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to create post', reason: err.message },
            { status: 500 }
        );
    }
}