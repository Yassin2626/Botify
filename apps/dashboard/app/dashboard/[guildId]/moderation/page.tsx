'use client';

import { useSocket } from '@/hooks/useSocket';
import { COLORS } from '@botify/shared';
import { useState } from 'react';

interface ModerationPageProps {
    params: {
        guildId: string;
    };
}

export default function ModerationPage({ params }: ModerationPageProps) {
    const { guildId } = params;
    const { isConnected, executeCommand, lastUpdate } = useSocket(guildId);

    const [userId, setUserId] = useState('');
    const [reason, setReason] = useState('');
    const [deleteDays, setDeleteDays] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const handleBan = async () => {
        if (!userId) {
            setToast({ type: 'error', message: 'Please enter a user ID' });
            return;
        }

        setLoading(true);
        try {
            await executeCommand('ban', {
                userId,
                reason: reason || 'No reason provided',
                deleteDays,
                moderatorId: 'dashboard-user', // TODO: Get from session
            });

            setToast({ type: 'success', message: `Successfully banned user ${userId}` });
            setUserId('');
            setReason('');
            setDeleteDays(0);
        } catch (error: any) {
            setToast({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8" style={{ backgroundColor: COLORS.BACKGROUND, minHeight: '100vh' }}>
            {/* Connection Status */}
            <div className="mb-6 flex items-center gap-2">
                <div
                    className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ boxShadow: isConnected ? '0 0 10px rgba(34,197,94,0.5)' : undefined }}
                />
                <span style={{ color: COLORS.MUTED, fontSize: '14px' }}>
                    {isConnected ? 'Connected to bot' : 'Disconnected'}
                </span>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div
                    className="mb-6 p-4 rounded-lg border"
                    style={{
                        backgroundColor: COLORS.SURFACE,
                        borderColor: toast.type === 'success' ? COLORS.SUCCESS : COLORS.DANGER,
                        color: toast.type === 'success' ? COLORS.SUCCESS : COLORS.DANGER,
                    }}
                >
                    {toast.message}
                    <button
                        onClick={() => setToast(null)}
                        className="float-right"
                        style={{ color: COLORS.MUTED }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <h1 className="text-4xl font-bold mb-8" style={{ color: COLORS.TEXT }}>
                Moderation
            </h1>

            {/* Ban User Card */}
            <div
                className="p-6 rounded-lg border mb-6"
                style={{
                    backgroundColor: COLORS.SURFACE,
                    borderColor: COLORS.BORDER,
                }}
            >
                <h2 className="text-2xl font-semibold mb-4" style={{ color: COLORS.TEXT }}>
                    Ban User
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-sm font-medium" style={{ color: COLORS.TEXT }}>
                            User ID
                        </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter Discord user ID"
                            className="w-full p-3 rounded-lg border-2 focus:outline-none"
                            style={{
                                backgroundColor: COLORS.BACKGROUND,
                                borderColor: COLORS.BORDER,
                                color: COLORS.TEXT,
                            }}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium" style={{ color: COLORS.TEXT }}>
                            Reason (optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Why are you banning this user?"
                            rows={3}
                            className="w-full p-3 rounded-lg border-2 focus:outline-none"
                            style={{
                                backgroundColor: COLORS.BACKGROUND,
                                borderColor: COLORS.BORDER,
                                color: COLORS.TEXT,
                            }}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium" style={{ color: COLORS.TEXT }}>
                            Delete message history (days)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="7"
                            value={deleteDays}
                            onChange={(e) => setDeleteDays(parseInt(e.target.value))}
                            className="w-full p-3 rounded-lg border-2 focus:outline-none"
                            style={{
                                backgroundColor: COLORS.BACKGROUND,
                                borderColor: COLORS.BORDER,
                                color: COLORS.TEXT,
                            }}
                        />
                    </div>

                    <button
                        onClick={handleBan}
                        disabled={loading || !isConnected}
                        className="w-full p-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: COLORS.DANGER,
                            color: COLORS.TEXT,
                        }}
                    >
                        {loading ? 'Banning...' : 'Ban User'}
                    </button>
                </div>
            </div>

            {/* Real-time Updates */}
            {lastUpdate && lastUpdate.type === 'ban' && (
                <div
                    className="p-4 rounded-lg border"
                    style={{
                        backgroundColor: COLORS.SURFACE,
                        borderColor: COLORS.PRIMARY,
                    }}
                >
                    <div className="text-sm" style={{ color: COLORS.MUTED }}>
                        Recent ban: User {lastUpdate.data.userId} was banned by {lastUpdate.data.moderator}
                    </div>
                </div>
            )}
        </div>
    );
}
