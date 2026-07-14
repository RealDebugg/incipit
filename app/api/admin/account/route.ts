/*https://community.auth0.com/t/update-user-profile-using-nextjs/96543/3*/

import { NextResponse } from 'next/server';

// Update name and/or email
export async function PUT(request: Request) {
    const data = await request.json();
    return NextResponse.json({ received: data }, { status: 201 });
}