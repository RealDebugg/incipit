import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

// Get all tags
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = {
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        };

        if (!query.page || !query.limit) {
            const data = await prisma.tags.findMany();
            return NextResponse.json({ data }, { status: 200 });
        } else {
            const offset = (Number(query.page) - 1) * Number(query.limit);

            const data = await prisma.tags.findMany({
                skip: offset,
                take: Number(query.limit),
            });

            const count = Math.ceil(await prisma.tags.count() / Number(query.limit));

            return NextResponse.json({ data, count }, { status: 200 });
        }
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to fetch tags', reason: err.message },
            { status: 500 }
        );
    }
}