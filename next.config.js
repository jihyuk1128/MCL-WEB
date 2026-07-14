/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "crafatar.com" }],
  },
};

module.exports = nextConfig;
