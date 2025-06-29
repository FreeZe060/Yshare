import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(
                <FaStar
                    key={i}
                    className="text-yellow-400 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                    size={25}
                />
            );
        } else if (rating >= i - 0.5) {
            stars.push(
                <FaStarHalfAlt
                    key={i}
                    className="text-yellow-400 drop-shadow-md transition-transform duration-300 group-hover:scale-110"
                    size={25}
                />
            );
        } else {
            stars.push(
                <FaRegStar
                    key={i}
                    className="text-violet-200 transition-transform duration-300 group-hover:scale-110"
                    size={25}
                />
            );
        }
    }

    return (
        <div className="relative group flex items-center justify-center bg-gradient-to-tr from-[#580FCA]/90 to-[#F929BB]/90 rounded-full px-6 py-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
            <div className="flex gap-1">
                {stars}
            </div>

            <div className="absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 w-[200px] sm:w-[300px] bg-gradient-to-br from-[#580FCA]/90 to-[#F929BB]/90 backdrop-blur-md bg-opacity-80 px-6 py-4 rounded-2xl shadow-2xl border border-pink-300 text-sm font-semibold tracking-wide scale-105 group-hover:scale-110 transition-all duration-300 flex items-center justify-center gap-3">
                <FaStar className="text-yellow-300" size={15} />
                <span className="text-white">Note : {rating.toFixed(1)} / 5</span>
            </div>
        </div>
    );
};

export default StarRating;
