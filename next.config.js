module.exports = {
    experimental: {
        appDir: true,
        serverActions: true
    },
    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            'bufferutil': 'commonjs bufferutil',
        })
        return config
    },
    async redirects() {
        return [
            {
                source: '/login',
                destination: "/intern/login",
                permanent: true,
            },
        ];
    },
};
