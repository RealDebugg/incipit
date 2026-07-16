import { NextResponse } from 'next/server';

// Get current user info from session
export async function GET(request: Request) {
    try {
        const userName = request.headers.get('x-user-name');
        const userEmail = request.headers.get('x-user-email');
        const userPicture = request.headers.get('x-user-picture');
        return NextResponse.json({ 
            name: userName || 'User',
            email: userEmail || '',
            picture: userPicture || ''
        }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to fetch user data', reason: err.message },
            { status: 500 }
        );
    }
}
