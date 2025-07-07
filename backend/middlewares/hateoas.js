require('dotenv').config();

function hateoas(resourceType, resourceIdField = 'id') {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);

        res.json = (data) => {
            if (!data) return originalJson(data);

            const baseUrl = process.env.REACT_APP_API_BASE_URL || `${req.protocol}://${req.get('host')}/api/v1`;

            const toPlainObject = (item) => {
                if (!item) return item;
                if (typeof item.toJSON === 'function') {
                    return item.toJSON();
                }
                return item;
            };

            const addLinks = (item) => {
                if (!item || typeof item !== 'object') return item;

                const plainItem = toPlainObject(item);
                const id = plainItem[resourceIdField];
                if (!id) return plainItem;

                const links = generateLinks(resourceType, id, baseUrl);
                return { ...plainItem, _links: links };
            };

            try {
                if (Array.isArray(data)) {
                    data = data.map(addLinks);
                }
                else if (data[`${resourceType}s`] && Array.isArray(data[`${resourceType}s`])) {
                    data[`${resourceType}s`] = data[`${resourceType}s`].map(addLinks);
                }
                else if (data[resourceType]) {
                    data[resourceType] = addLinks(data[resourceType]);
                }
                else if (data[resourceIdField]) {
                    data = addLinks(data);
                }
            } catch (err) {
                console.error("[HATEOAS middleware] Erreur lors de l'ajout des liens :", err.message);
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
                ratings: { href: `${baseUrl}/ratings/user/${id}`, method: "GET" },
                participationCount: { href: `${baseUrl}/users/${id}/participation-count`, method: "GET" }
            };
        case 'participant':
            return {
                self: { href: `${baseUrl}/participants/${id}`, method: "GET" },
                update: { href: `${baseUrl}/participants/${id}`, method: "PUT" },
                delete: { href: `${baseUrl}/participants/${id}`, method: "DELETE" }
            };
        case 'admin':
            return {
                stats: { href: `${baseUrl}/admin/stats`, method: "GET" },
                users: { href: `${baseUrl}/users`, method: "GET" },
                createUser: { href: `${baseUrl}/admin/users`, method: "POST" },
                categories: { href: `${baseUrl}/categories`, method: "GET" }
            };
        case 'news':
            return {
                self: { href: `${baseUrl}/news/${id}/details`, method: "GET" },
                update: { href: `${baseUrl}/news/${id}`, method: "PUT" },
                delete: { href: `${baseUrl}/news/${id}`, method: "DELETE" },
                linkEvent: { href: `${baseUrl}/news/${id}/link-event`, method: "POST" }
            };
        case 'report':
            return {
                self: { href: `${baseUrl}/reports/${id}`, method: "GET" },
                updateStatus: { href: `${baseUrl}/reports/${id}/status`, method: "PUT" },
                delete: { href: `${baseUrl}/reports/${id}`, method: "DELETE" },
                messages: { href: `${baseUrl}/reports/${id}/messages`, method: "GET" },
                reply: { href: `${baseUrl}/reports/${id}/reply`, method: "POST" }
            };
        default:
            return {
                self: { href: `${baseUrl}/${resourceType}/${id}`, method: "GET" }
            };
    }
}

module.exports = hateoas;