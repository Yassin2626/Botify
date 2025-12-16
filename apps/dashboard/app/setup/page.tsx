'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to save token');
            }

            // Redirect to home
            router.push('/');
            router.refresh(); // Refresh server components
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
            <div className="z-10 max-w-md w-full items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">Botify Setup</h1>

                <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
                    <p className="mb-6 text-zinc-400 text-center">
                        Please enter your Discord Bot Token to get started.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label htmlFor="token" className="block mb-2 text-sm font-medium">Bot Token</label>
                            <input
                                type="password"
                                id="token"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="bg-zinc-800 border border-zinc-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                placeholder="MTAw..."
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-900/30 rounded-lg border border-red-900/50">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
