module.exports = {
    experimental: {
        appDir: true,
    },
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            'bufferutil': 'commonjs bufferutil',
        })
        return config
    },
    async redirects() {
        return [
            {
                source: '/w',
                destination: '/events/2023-05-12',
                permanent: false,
            },
        ];
    },
};