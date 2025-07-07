import React from 'react';
import 'animate.css';

const CATEGORY_STYLES = {
    Foot: 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-md',
    Musique: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md',
    Sport: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md',
    Fête: 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-md',
    Théâtre: 'bg-gradient-to-r from-purple-500 to-[#C72EBF] text-white shadow-md',
    Tech: 'bg-gradient-to-r from-[#D232BE] to-cyan-500 text-white shadow-md',
    Fitness: 'bg-gradient-to-r from-emerald-400 to-emerald-600 text-white shadow-md',
    Startup: 'bg-gradient-to-r from-[#EE7AB5] to-[#BA28C0] text-white shadow-md',
    Danse: 'bg-gradient-to-r from-rose-400 to-pink-600 text-white shadow-md',
    Autre: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-md',
};

const EventCategoryTag = ({ category, className }) => {
    const categoryStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES['Autre'];

    return (
        <span
            className={`inline-block px-3 py-1 rounded-full text-[13px] font-medium animate__animated animate__fadeIn ${categoryStyle} ${className}`}
        >
            {category}
        </span>
    );
};

export default EventCategoryTag;
