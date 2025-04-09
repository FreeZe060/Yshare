import React from 'react';
import { motion } from 'framer-motion';

const EventCard = ({ event }) => {
    console.log(event.img);

    return (
        <motion.div 
            className="bg-white rounded-lg shadow-md p-4 w-64 cursor-pointer hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
        >
            <div className="w-full h-40 bg-gray-200 rounded-md overflow-hidden">
                
                {event.img ? (
                    <img src={`http://localhost:8080/${event.image}`} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Pas d'image
                    </div>
                )}
            </div>
            <h3 className="mt-4 text-xl font-bold">{event.title}</h3>
            <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">Statut : {event.status}</p>
        </motion.div>
    );
};

export default EventCard;
