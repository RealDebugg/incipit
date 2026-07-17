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
        };

        const validation = validateInput(query, [
            { field: 'page', type: 'string', required: true },
            { field: 'limit', type: 'string', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const offset = (Number(query.page) - 1) * Number(query.limit);

        const res = await prisma.posts.findMany({
            skip: offset,
            take: Number(query.limit),
            orderBy: {
                date: 'desc',
            },
            select: {
                id: true,
                date: true,
                title: true,
                coverPhotoBlob: true,
                description: true,
                status: true,
            },
        })

        const count = await prisma.tags.count();

        return NextResponse.json({ res, count }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch posts', reason: err.message }, { status: 500 });
    }
}