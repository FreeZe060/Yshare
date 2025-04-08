import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-500" size={24} />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" size={24} />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-400" size={24} />);
    }
  }
  return <div className="flex">{stars}</div>;
};

export default StarRating;