/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_MAPS_API_KEY: process.env.REACT_APP_MAPS_API_KEY,
  }
}

module.exports = nextConfig
