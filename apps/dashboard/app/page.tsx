export default async function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col">
                <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                    Botify Dashboard
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
                        <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-4 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <h2 className="text-xl font-bold mb-2 text-center">Overview</h2>
                        <p className="text-zinc-400 text-center text-sm">Guild stats & metrics</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
                        <h2 className="text-xl font-bold mb-2 text-center">Moderation</h2>
                        <p className="text-zinc-400 text-center text-sm">Ban, kick, timeout controls</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
                        <h2 className="text-xl font-bold mb-2 text-center">Auto-Mod</h2>
                        <p className="text-zinc-400 text-center text-sm">Automated moderation</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
                        <h2 className="text-xl font-bold mb-2 text-center">Logging</h2>
                        <p className="text-zinc-400 text-center text-sm">Event logging channels</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
                        <h2 className="text-xl font-bold mb-2 text-center">Tickets</h2>
                        <p className="text-zinc-400 text-center text-sm">Support ticket system</p>
                    </div>

                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all">
                        <h2 className="text-xl font-bold mb-2 text-center">More Coming</h2>
                        <p className="text-zinc-400 text-center text-sm">Leveling, Music, & more</p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-zinc-500 text-sm">Enterprise rebuild in progress...</p>
                </div>
            </div>
        </main>
    )
}
