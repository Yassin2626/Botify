import { prisma } from '@botify/database';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        // Validate token format roughly (optional but good)
        // Basic check: 3 parts separated by dots
        if (token.split('.').length !== 3) {
            return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
        }

        await prisma.systemConfig.upsert({
            where: { key: 'bot_token' },
            create: { key: 'bot_token', value: token },
            update: { value: token },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to save token:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
