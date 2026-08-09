import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = {
            page: searchParams.get('page'),
            limit: searchParams.get('limit'),
        };

        if (!query.page || !query.limit) {
            const data = await prisma.posts.findMany({
                select: {
                    id: true,
                    date: true,
                    tags: true,
                    title: true,
                    description: true,
                    coverPhotoBlob: true,
                },
                where: {
                    status: 1 //published
                },
                orderBy: {
                    date: 'desc'
                }
            });
            return NextResponse.json({ data }, { status: 200 });
        } else {
            const offset = (Number(query.page) - 1) * Number(query.limit);

            const data = await prisma.posts.findMany({
                skip: offset,
                take: Number(query.limit),
                select: {
                    date: true,
                    tags: true,
                    title: true,
                    description: true,
                    coverPhotoBlob: true,
                },
                where: {
                    status: 1 //published
                },
                orderBy: {
                    date: 'desc'
                }
            });

            const totalCount = await prisma.posts.count({
                where: {
                    status: 1 //published
                }
            });

            const count = Math.ceil(totalCount / Number(query.limit));

            return NextResponse.json({ data, count }, { status: 200 });
        }
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch posts', reason: err.message }, { status: 500 });
    }
}