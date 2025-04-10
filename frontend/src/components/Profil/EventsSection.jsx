import React from 'react';
import EventCard from './EventCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventsSection = ({ title, linkText, events, emptyMessage, buttonLink, emptyButtonText }) => {
    const isEmpty = !events || events.length === 0;

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{title}</h2>
                {!isEmpty && linkText && (
                    <Link to={buttonLink} className="text-blue-500 hover:underline">
                        {linkText}
                    </Link>
                )}
            </div>
            {events && events.length > 0 ? (
                <div className="flex space-x-4">
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <motion.div 
                    className="flex flex-col items-center justify-center h-40 border-dashed border-2 border-gray-300 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-xl font-bold text-gray-500 text-center px-4">
                        {emptyMessage}
                    </p>
                    <Link 
                        to={buttonLink} 
                        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        {emptyButtonText || "Explorer"}
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default EventsSection;