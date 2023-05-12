/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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
        hostname: "pool.sdprojectbucket.xyz",
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
