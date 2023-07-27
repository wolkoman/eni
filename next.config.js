module.exports = {
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