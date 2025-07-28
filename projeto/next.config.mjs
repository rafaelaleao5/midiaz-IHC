/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.unsplash.com', 'placeholder.svg', 'media.istockphoto.com', 'plus.unsplash.com'],
    unoptimized: true
  },
  // Disable caching for development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Force refresh
  experimental: {
    forceSwcTransforms: true,
  },
  // Project name
  env: {
    PROJECT_NAME: 'midiaz'
  }
}

export default nextConfig
