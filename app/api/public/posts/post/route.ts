import { NextResponse } from 'next/server';
import {validateInput} from "@/lib/validation";
import prisma from "@/lib/prisma";

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
            },
            include: {
                tags: true
            }
        })

        if (res && res.date > new Date()) {
            return NextResponse.json({}, { status: 400 });
        }

        return NextResponse.json({ res }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Failed to fetch post', reason: err.message }, { status: 500 });
    }
}