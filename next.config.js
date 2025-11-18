/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Dockerコンテナ内で正しく動作するための設定
  output: 'standalone',
};

module.exports = nextConfig;