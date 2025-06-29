function hateoas(resourceType, resourceIdField = 'id') {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);

        res.json = (data) => {
            if (!data) return originalJson(data);

            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const addLinks = (item) => {
                if (!item || typeof item !== 'object') return item;

                const id = item[resourceIdField];
                const links = generateLinks(resourceType, id, baseUrl);

                return { ...item, _links: links };
            };

            if (Array.isArray(data)) {
                data = data.map(addLinks);
            } else if (data[resourceType]) {
                data[resourceType] = data[resourceType].map(addLinks);
            } else {
                data = addLinks(data);
            }

            return originalJson(data);
        };

        next();
    };
}

function generateLinks(resourceType, id, baseUrl) {
    switch (resourceType) {
        case 'event':
            return {
                self: { href: `${baseUrl}/events/${id}`, method: "GET" },
                update: { href: `${baseUrl}/events/${id}`, method: "PUT" },
                delete: { href: `${baseUrl}/events/${id}`, method: "DELETE" },
                participants: { href: `${baseUrl}/events/${id}/participants/all`, method: "GET" },
                comments: { href: `${baseUrl}/events/${id}/comments`, method: "GET" },
                rate: { href: `${baseUrl}/ratings`, method: "POST" }
            };
        case 'user':
            return {
                self: { href: `${baseUrl}/profile/${id}`, method: "GET" },
                update: { href: `${baseUrl}/profile/${id}`, method: "PUT" },
                delete: { href: `${baseUrl}/users/${id}`, method: "DELETE" },
                eventHistory: { href: `${baseUrl}/users/${id}/event-history`, method: "GET" },
                createdEvents: { href: `${baseUrl}/users/${id}/created-events`, method: "GET" },
                ratings: { href: `${baseUrl}/ratings/user/${id}`, method: "GET" }
            };
        default:
            return {
                self: { href: `${baseUrl}/${resourceType}/${id}`, method: "GET" }
            };
    }
}

module.exports = hateoas;