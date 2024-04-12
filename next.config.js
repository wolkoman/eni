module.exports = {
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
                source: '/api/weekly',
                destination: "/wochenmitteilungen",
                permanent: true,
            },
            {
                source: '/wochenmitteilungen/emmaus',
                destination: "/wochenmitteilungen?parish=emmaus",
                permanent: true,
            },
            {
                source: '/wochenmitteilungen/inzersdorf',
                destination: "/wochenmitteilungen?parish=inzersdorf",
                permanent: true,
            },
            {
                source: '/wochenmitteilungen/neustift',
                destination: "/wochenmitteilungen?parish=neustift",
                permanent: true,
            },
            {
                source: '/login',
                destination: "/intern/login",
                permanent: true,
            },
            {
                source: '/w',
                destination: "/worship",
                permanent: true,
            },
            {
                source: '/ig',
                destination: "https://www.instagram.com/eni.wien",
                permanent: true,
            },
        ];
    },
};
