const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const sanitizeInput = (value) => {


    const suspiciousPatterns = [
        /<script.*?>.*?<\/script>/gi,
        /(<[^>]+>)/gi,
        /\b(SELECT|INSERT|DELETE|DROP|UPDATE)\b/gi,
        /['";]/g,
    ];

    let suspicious = false;

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(value)) {
            suspicious = true;
            break;
        }
    }

    const sanitized = value.replace(/<[^>]+>/g, '').trim();

    if (suspicious) {
        fetch(`${API_BASE_URL}/log-suspicious`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'input',
                value: value,
                path: window.location.pathname,
                timestamp: new Date().toISOString(),
            }),
        });
    }

    return sanitized;
};

export default sanitizeInput;
