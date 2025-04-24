const { EventImage } = require('../models');

class EventImageService {
    async addImages(eventId, images) {
        return await EventImage.bulkCreate(
            images.map(img => ({ event_id: eventId, image_url: img.image_url, is_main: !!img.is_main }))
        );
    }

    async setMainImage(eventId, imageId) {
        await EventImage.update({ is_main: false }, { where: { event_id: eventId } });
        return await EventImage.update({ is_main: true }, { where: { id: imageId, event_id: eventId } });
    }

    async getImages(eventId) {
        return await EventImage.findAll({ where: { event_id: eventId } });
    }
}

module.exports = new EventImageService();