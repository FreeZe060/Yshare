import React from 'react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
    return (
        <motion.div
            className="bg-white rounded-2xl shadow-lg p-4 w-64 cursor-pointer transition-transform hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
        >
            <div className="relative w-full h-40 rounded-md overflow-hidden shadow-inner">
                {event.image ? (
                    <>
                        <img
                            src={`http://localhost:8080/${event.image}`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                        Pas d'image
                    </div>
                )}
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-800 line-clamp-1">{event.title}</h3>

            <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                <span>{event.status}</span>
            </div>
        </motion.div>
    );
};

export default EventCard;