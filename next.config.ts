module.exports = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Only apply the fallback on the client side (because Monaco uses node-specific APIs)
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        os: false,
      };
    }

    return config;
  },
};
