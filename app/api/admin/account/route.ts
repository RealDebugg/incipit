/*https://community.auth0.com/t/update-user-profile-using-nextjs/96543/3*/

import {NextRequest, NextResponse} from 'next/server';
import { auth0 } from '@/lib/auth0';

// Update name and/or email
export async function PUT(request: NextRequest) {
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