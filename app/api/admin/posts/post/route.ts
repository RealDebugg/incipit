import { NextResponse } from 'next/server';
import {validateInput} from "@/lib/validation";
import prisma from "@/lib/prisma";

// Get post data for form
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = {
            id: Number(searchParams.get('id')),
        };

        const validation = validateInput(query, [
            { field: 'id', type: 'number', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.posts.findFirst({
            where: {
                id: query.id,
            }
        })

        return NextResponse.json({ res }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch post', reason: err.message }, { status: 500 });
    }
}

// Create post
interface PostPostReqBody {
    author: string;
    title: string;
    content: string;
    description: string | null;
    coverPhotoBlob: string | null;
    tags: number[] | null;
    status: number;
}
export async function POST(request: Request) {
    try {
        const data: PostPostReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'author', type: 'string', required: true },
            { field: 'title', type: 'string', required: true },
            { field: 'content', type: 'string', required: true },
            { field: 'status', type: 'number', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.posts.create({
            data: {
                author: data.author,
                title: data.title,
                content: data.content,
                description: data.description,
                coverPhotoBlob: data.coverPhotoBlob,
                tags: data.tags ? {
                    connect: data.tags.map(id => ({ id }))
                } : undefined,
                status: data.status,
            },
        });
        return NextResponse.json({ id: res.id }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to create post', reason: err.message },
            { status: 500 }
        );
    }
}

// Update post
interface PutPostReqBody {
    id: number;
    author: string;
    title: string;
    content: string;
    description: string | null;
    coverPhotoBlob: string | null;
    tags: number[] | null;
    status: number;
}
export async function PUT(request: Request) {
    try {
        const data: PutPostReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'id', type: 'number', required: true },
            { field: 'author', type: 'string', required: true },
            { field: 'title', type: 'string', required: true },
            { field: 'content', type: 'string', required: true },
            { field: 'status', type: 'number', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        // First, get current tags to handle disconnection
        const currentPost = await prisma.posts.findUnique({
            where: { id: data.id },
            include: { tags: true }
        });

        if (!currentPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const res = await prisma.posts.update({
            where: { id: data.id },
            data: {
                author: data.author,
                title: data.title,
                content: data.content,
                description: data.description,
                coverPhotoBlob: data.coverPhotoBlob,
                status: data.status,
                tags: {
                    disconnect: currentPost.tags.map(tag => ({ id: tag.id })),
                    connect: data.tags ? data.tags.map(id => ({ id })) : []
                }
            },
        });

        return NextResponse.json({ id: res.id }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to update post', reason: err.message },
            { status: 500 }
        );
    }
}

// Delete post
interface DeletePostReqBody {
    id: number;
}
export async function DELETE(request: Request) {
    try {
        const data: DeletePostReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'id', type: 'number', required: true }
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.posts.delete({
            where: { id: data.id }
        });
        return NextResponse.json({ id: res.id }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to delete post', reason: err.message },
            { status: 500 }
        );
    }
}
