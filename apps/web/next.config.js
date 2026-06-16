/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'place.map.kakao.com' },
      { protocol: 'https', hostname: 't1.daumcdn.net' },
      { protocol: 'https', hostname: 'image.maps.kakao.com' }
    ]
  }
};
module.exports = nextConfig;
