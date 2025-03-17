
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
  //   remotePatterns: [{
  //     protocol: 'https',
  //     hostname: 'picsum.photos',
  //     port: '',
  //     pathname: '/**'
  //   },{
  //     protocol: 'http',
  //     hostname: `localhost`,
  //     port: '3000',
  //     pathname: '/**'
  //   },{
  //     protocol: 'https',
  //     hostname: `www.google.com`,
  //     port: '',
  //     pathname: '/**'
  //   }
  // ]
  remotePatterns: [{
    protocol: "https",
    hostname: "**"
  },{
    protocol: "http",
    hostname: "**"
  }]
  },
};

export default nextConfig;