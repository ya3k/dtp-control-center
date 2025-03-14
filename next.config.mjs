/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Chấp nhận tất cả hostname
      },
      {
        protocol: 'http',
        hostname: '**', // Nếu cần hỗ trợ cả HTTP
      }
    ],
  },
};

export default nextConfig;
