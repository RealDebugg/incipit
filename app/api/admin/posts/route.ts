import {NextRequest, NextResponse} from 'next/server';
import { auth0 } from '@/lib/auth0';

// Get posts and their summary, paginated
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