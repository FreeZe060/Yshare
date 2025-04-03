const getApiBaseUrl = () => {
    const hostname = window.location.hostname;

    if (hostname === 'localhost') {
        return 'http://localhost:80';

    } if (hostname === '192.168.2.28') {
        return 'http://192.168.2.28:4000';

    } if (hostname === '127.0.0.1') {
        return 'http://127.0.0.1';

    } else if (hostname === 'dev.savplus-btp.com') {
        return 'http://dev.savplus-btp.com';

    } else if (hostname === 'eiffage.savplus-btp.com') {
        return 'https://eiffage.savplus-btp.com';

    } else if (hostname === 'vcfprdsav01') {
        return 'https://vcfprdsav01';

    } else if (hostname === 'spie-batignolles.savplus-btp.com') {
        return 'https://spie-batignolles.savplus-btp.com';
    }
    return 'http://localhost:80';
};

const config = {
    apiBaseUrl: getApiBaseUrl(),
};

console.log('API Base URL:', config.apiBaseUrl);

export default config;
