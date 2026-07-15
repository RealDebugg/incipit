import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { validateInput } from "@/lib/validation";

// Get all tags
export async function GET() {
    try {
        const data = await prisma.tags.findMany();
        return NextResponse.json({ data }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to fetch tags', reason: err.message },
            { status: 500 }
        );
    }
}

// Create tag
interface PostTagReqBody {
    name: string;
}
export async function POST(request: Request) {
    try {
        const data: PostTagReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'name', type: 'string', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.tags.create({
            data: {
                name: data.name.trim(),
            },
        });
        return NextResponse.json({ res }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to create tag', reason: err.message },
            { status: 500 }
        );
    }
}

// Update tag
interface PutTagReqBody {
    id: number;
    name: string;
}
export async function PUT(request: Request) {
    try {
        const data: PutTagReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'id', type: 'number', required: true },
            { field: 'name', type: 'string', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.tags.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name.trim(),
            },
        });
        return NextResponse.json({ res }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to update tag', reason: err.message },
            { status: 500 }
        );
    }
}

// Delete tag
interface DeleteTagReqBody {
    id: number;
}
export async function DELETE(request: Request) {
    try {
        const data: DeleteTagReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'id', type: 'number', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        const res = await prisma.tags.delete({
            where: {
                id: data.id,
            }
        });

        return NextResponse.json({ res }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to delete tag', reason: err.message },
            { status: 500 }
        );
    }
}