import { prisma } from '@botify/database';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function Home() {
    // Check for bot token
    const config = await prisma.systemConfig.findUnique({
        where: { key: 'bot_token' },
    });

    if (!config?.value) {
        redirect('/setup');
    }

    // Extract Client ID from token (first part, base64 encoded)
    let inviteUrl = '#';
    try {
        const tokenParts = config.value.split('.');
        if (tokenParts.length > 0) {
            const clientId = Buffer.from(tokenParts[0], 'base64').toString('utf-8');
            inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot%20applications.commands`;
        }
    } catch (e) {
        console.error('Failed to parse client ID from token', e);
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">
                <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Botify Dashboard
                </h1>

                <div className="grid grid-cols-1 gap-4 w-full max-w-md">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-4 box-shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <h2 className="text-xl font-bold mb-2">Bot Configured</h2>
                        <p className="text-zinc-400 mb-6">Your bot token is saved and ready.</p>

                        <Link
                            href={inviteUrl}
                            target="_blank"
                            className="inline-flex items-center justify-center w-full px-5 py-3 text-base font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-800 transition-all"
                        >
                            Invite Bot to Server
                        </Link>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center opacity-50 cursor-not-allowed">
                        <h2 className="text-xl font-bold mb-2">Modules</h2>
                        <p className="text-zinc-400">Manage your bot modules (Coming Soon)</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
