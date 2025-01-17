/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    distDir: 'build', // Specify the custom build folder
};

export default nextConfig;
