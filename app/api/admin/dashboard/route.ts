import {NextRequest, NextResponse} from 'next/server';
import { auth0 } from '@/lib/auth0';

// Get overview amount of posts, amount of tags, latest publication
export async function GET(request: NextRequest) {
    const session = await auth0.getSession(request);
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized', description: 'Missing active session' },
            { status: 401 }
        );
    }

    /*const token = session.accessToken; */

    return NextResponse.json({ message: 'Hello from Next.js API!' });
}

// Create "quick" post
export async function POST(request: NextRequest) {
    const session = await auth0.getSession(request);
    if (!session) {
        return NextResponse.json(
            { error: 'Unauthorized', description: 'Missing active session' },
            { status: 401 }
        );
    }

    /*const token = session.accessToken; */

    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}