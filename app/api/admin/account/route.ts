/*https://community.auth0.com/t/update-user-profile-using-nextjs/96543/3*/

import { NextResponse } from 'next/server';
import { validateInput } from '@/lib/validation';


// Update name and/or email
interface PutAccountReqBody {
    name: string;
    email: string;
}
export async function PUT(request: Request) {
    try {
        const data: PutAccountReqBody = await request.json();

        const validation = validateInput(data, [
            { field: 'name', type: 'string', required: true },
            { field: 'email', type: 'string', required: true },
        ]);

        if (!validation.valid) {
            return validation.error;
        }

        // Get user ID from headers (set by proxy.ts)
        const userId = request.headers.get('x-user-id');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get Management API access token
        const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`
            })
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to get access token');
        }

        const { access_token } = await tokenResponse.json();

        // Update user profile
        const updateData = {
            name: data.name,
            email: data.email
        };

        const updateResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(updateData)
        });

        if (!updateResponse.ok) {
            const error = await updateResponse.json();
            throw new Error(error.message || 'Failed to update user');
        }

        const updatedUser = await updateResponse.json();

        return NextResponse.json({
            user: {
                name: updatedUser.name,
                email: updatedUser.email
            }
        }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json(
            { error: 'Failed to update account', reason: err.message },
            { status: 500 }
        );
    }
}