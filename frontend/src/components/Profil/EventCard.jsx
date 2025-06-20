import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    const isTermineEtInscrit = event.event_status === 'Terminé' && event.status === 'Inscrit';

    return (
        <motion.div
            className="relative bg-white rounded-2xl shadow-lg p-4 w-64 cursor-pointer transition-transform hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
        >
            <Link to={`/event/${event.id}`}>

                <div className="relative w-full h-40 rounded-md overflow-hidden shadow-inner">
                    {event.image ? (
                        <>
                            <img
                                src={`http://localhost:8080${event.image}`}
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
                    <span>{new Date(event.start_time).toLocaleDateString('fr-FR')}</span>
                    <div className={`text-xs font-semibold px-3 py-1 rounded-full w-fit mt-2
                        ${event.event_status === 'Planifié' ? 'bg-blue-100 text-blue-700' : ''}
                        ${event.event_status === 'En Cours' ? 'bg-green-100 text-green-700' : ''}
                        ${event.event_status === 'Terminé' ? 'bg-gray-200 text-gray-700' : ''}
                        ${event.event_status === 'Annulé' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                        {event.event_status}
                    </div>
                </div>
            </Link>

            {isTermineEtInscrit && (
                <div className="absolute left-0 right-0 top-[150px] translate-y-[-10%] bg-gradient-to-r from-[#580FCA] to-[#C320C0] text-white px-4 py-2 rounded-xl z-10">
                    <div className="flex items-center gap-1">
                        <p className="text-xs font-medium">Événement terminé</p>
                        <Link
                            to={`/event/${event.id}`}
                            className="text-xs px-3 py-0.5 bg-white text-[#580FCA] hover:text-white hover:bg-[#580FCA] border border-white rounded-full transition-all"
                        >
                            Voir les détails
                        </Link>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default EventCard;