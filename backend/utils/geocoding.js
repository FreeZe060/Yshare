const axios = require('axios');

async function getCoordinatesFromCity(city) {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: city,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'YourAppName (your@email.com)'
            }
        });

        if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return {
                latitude: parseFloat(lat),
                longitude: parseFloat(lon)
            };
        } else {
            console.warn(`[getCoordinatesFromCity] Aucun résultat pour la ville : ${city}`);
            return null;
        }
    } catch (error) {
        console.error(`[getCoordinatesFromCity] Erreur :`, error.message);
        return null;
    }
}

module.exports = {
    getCoordinatesFromCity
};