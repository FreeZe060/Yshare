import DOMPurify from 'dompurify';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const sanitizeInput = (value) => {
    if (typeof value !== 'string') return value;

    const sanitized = DOMPurify.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();

    const scriptTagPattern = /<script.*?>.*?<\/script>/gi;
    let suspicious = scriptTagPattern.test(value);

    if (suspicious) {
        fetch(`${REACT_APP_API_BASE_URL}/log-suspicious`, {
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
