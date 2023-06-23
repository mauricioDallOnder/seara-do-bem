/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com','oaidalleapiprodscus.blob.core.windows.net'],
   
  },
}

module.exports = nextConfig
