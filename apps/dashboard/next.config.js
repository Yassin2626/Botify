/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    transpilePackages: ['@botify/database'],
};

module.exports = nextConfig;
