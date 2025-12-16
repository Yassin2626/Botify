'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket(guildId?: string) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<any>(null);

    useEffect(() => {
        // Initialize socket connection
        if (!socket) {
            socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
                withCredentials: true,
            });

            socket.on('connect', () => {
                console.log('[Socket] Connected');
                setIsConnected(true);
            });

            socket.on('disconnect', () => {
                console.log('[Socket] Disconnected');
                setIsConnected(false);
            });

            socket.on('bot:update', (data) => {
                console.log('[Socket] Bot update:', data);
                setLastUpdate(data);
            });
        }

        // Join guild room
        if (guildId && socket) {
            socket.emit('join:guild', guildId);
        }

        return () => {
            // Don't disconnect on cleanup, keep connection alive
        };
    }, [guildId]);

    const executeCommand = async (commandName: string, options: any) => {
        return new Promise((resolve, reject) => {
            if (!socket || !guildId) {
                reject(new Error('Socket not connected or no guild ID'));
                return;
            }

            socket.emit('dashboard:command', {
                commandName,
                guildId,
                options,
                userId: 'dashboard-user', // TODO: Replace with actual user ID from session
            });

            socket.once('command:success', (data) => {
                if (data.commandName === commandName) {
                    resolve(data.result);
                }
            });

            socket.once('command:error', (data) => {
                if (data.commandName === commandName) {
                    reject(new Error(data.error));
                }
            });

            // Timeout after 10 seconds
            setTimeout(() => reject(new Error('Command timeout')), 10000);
        });
    };

    return {
        socket,
        isConnected,
        lastUpdate,
        executeCommand,
    };
}
