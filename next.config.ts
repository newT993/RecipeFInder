/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Only use temporarily for debugging
  },
  eslint: {
    ignoreDuringBuilds: true, // Only use temporarily for debugging
  }
}

module.exports = nextConfig