const { EventImage } = require('../models');

class EventImageService {
    async addImages(eventId, images) {
        console.log(`[addImages] ➤ Ajout de ${images.length} image(s) à l'événement ID=${eventId}`);

        const result = await EventImage.bulkCreate(
            images.map(img => ({
                event_id: eventId,
                image_url: img.image_url,
                is_main: !!img.is_main
            }))
        );

        console.log(`[addImages] ✅ Images ajoutées avec succès`);
        return result;
    }

    async setMainImage(eventId, imageId) {
        console.log(`[setMainImage] ➤ Définition de l’image principale ID=${imageId} pour l’événement ID=${eventId}`);

        await EventImage.update({ is_main: false }, { where: { event_id: eventId } });
        const result = await EventImage.update(
            { is_main: true },
            { where: { id: imageId, event_id: eventId } }
        );

        console.log(`[setMainImage] ✅ Image ID=${imageId} définie comme principale`);
        return result;
    }

    async getImages(eventId) {
        console.log(`[getImages] ➤ Récupération des images pour l’événement ID=${eventId}`);

        const images = await EventImage.findAll({ where: { event_id: eventId } });

        console.log(`[getImages] ✅ ${images.length} image(s) trouvée(s)`);
        return images;
    }

    async deleteImage(imageId) {
        console.log(`[deleteImage] ➤ Suppression de l’image ID=${imageId}`);
        const deleted = await EventImage.destroy({ where: { id: imageId } });
        console.log(deleted ? `[deleteImage] ✅ Image supprimée` : `[deleteImage] ⚠️ Image introuvable`);
        return deleted;
    }
}

module.exports = new EventImageService();