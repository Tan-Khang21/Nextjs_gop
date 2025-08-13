/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "demodienmay.125.atoz.vn",
      "demochung.125.atoz.vn",
      "choixanh.net",
      "cdn2.tuoitre.vn",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "demodienmay.125.atoz.vn",
        pathname: "/**", // Cho phép mọi ảnh từ domain này
      },
      {
        protocol: "https",
        hostname: "choixanh.net",
        pathname: "/**", 
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "81",
        pathname: "/choixanh/public/images/**"
      }      
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/tintuc/:path*',
        destination: 'https://demodienmay.125.atoz.vn/ww2/app.all.danhmuc.asp/:path*',
      },
    ];
  },
};

module.exports = nextConfig;


