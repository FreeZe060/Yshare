import React, { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating }) => {
    const [hovered, setHovered] = useState(false);

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(
                <FaStar
                    key={i}
                    className="text-yellow-500"
                    size={24}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                />
            );
        } else if (rating >= i - 0.5) {
            stars.push(
                <FaStarHalfAlt
                    key={i}
                    className="text-yellow-500"
                    size={24}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                />
            );
        } else {
            stars.push(
                <FaRegStar
                    key={i}
                    className="text-gray-400"
                    size={24}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                />
            );
        }
    }

    return (
        <div className="relative flex items-center">
            <div className="flex">{stars}</div>
            {hovered && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm text-blueGray-600 bg-white px-2 py-1 rounded shadow">
                    {rating.toFixed(1)} / 5
                </div>
            )}
        </div>
    );
};

export default StarRating;