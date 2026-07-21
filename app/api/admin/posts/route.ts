import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { validateInput } from "@/lib/validation";

// Get paginated posts summary
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = {
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
            search: searchParams.get('search'),
            sortBy: searchParams.get('sortBy'),
            sortOrder: searchParams.get('sortOrder'),
        };

        const validation = validateInput(query, [
            { field: 'page', type: 'string', required: true },
            { field: 'limit', type: 'string', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const offset = (Number(query.page) - 1) * Number(query.limit);

        // Build where clause for search
        const where = query.search ? {
            title: {
                contains: query.search,
                mode: 'insensitive' as const,
            },
        } : {};

        // Build orderBy clause for sorting
        let orderBy: any = { date: 'desc' };
        if (query.sortBy) {
            const sortField = query.sortBy as 'date' | 'status';
            const sortDirection = (query.sortOrder === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
            orderBy = { [sortField]: sortDirection };
        }

        const res = await prisma.posts.findMany({
            where,
            skip: offset,
            take: Number(query.limit),
            orderBy,
            select: {
                id: true,
                date: true,
                title: true,
                author: true,
                coverPhotoBlob: true,
                description: true,
                status: true,
            },
        })

        const totalCount = await prisma.posts.count({ where });
        const count = Math.ceil(totalCount / Number(query.limit));

        return NextResponse.json({ res, count }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch posts', reason: err.message }, { status: 500 });
    }
}


// Delete post
interface PutPostReqBody {
    id: number;
    status: number;
}
export async function PUT(request: Request) {
    try {
        const data: PutPostReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'id', type: 'number', required: true },
            { field: 'status', type: 'number', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.posts.update({
            where: { id: data.id },
            data: { status: data.status }
        });
        return NextResponse.json({ id: res.id }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to set post status', reason: err.message },
            { status: 500 }
        );
    }
}
