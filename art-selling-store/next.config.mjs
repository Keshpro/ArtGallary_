/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ◀️ ImgBB එකෙන් දෙන Direct Image Link Host එක
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // ◀️ අපි සාම්පල් ඒවට දාපු Unsplash හොස්ට් එක
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;