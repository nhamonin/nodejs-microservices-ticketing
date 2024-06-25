/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    if (!config.watchOptions) {
      config.watchOptions = {};
    }

    config.watchOptions = Object.assign({}, config.watchOptions, {
      poll: 300,
    });

    return config;
  },
};

export default nextConfig;
