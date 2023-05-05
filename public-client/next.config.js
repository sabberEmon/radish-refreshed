/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "buffwild.b-cdn.net",
      },
      
      {
        protocol: "https",
        hostname: "farm.radishsquare.com",
      },
      {
        protocol: "https",
        hostname: "singularityx.net",
      },
      
      {
        protocol: "https",
        hostname: "radixfrogzsociety.xyz",
      },
      {
        protocol: "https",
        hostname: "www.radicalfractals.com",
      },
    ],
  },
};

module.exports = nextConfig;
