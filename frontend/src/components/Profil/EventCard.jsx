import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    const isTermineEtInscrit = event.event_status === 'Terminé' && event.status === 'Inscrit';

    return (
        <motion.div
            className="relative bg-white shadow-lg hover:shadow-xl p-4 rounded-2xl w-64 transition-transform cursor-pointer"
            whileHover={{ scale: 1.05 }}
        >
            <Link to={`/event/${event.id}`}>

                <div className="relative shadow-inner rounded-md w-full h-40 overflow-hidden">
                    {event.image ? (
                        <>
                            <img
                                src={`${event.image}`}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                        </>
                    ) : (
                        <div className="flex justify-center items-center bg-gray-100 w-full h-full text-gray-500">
                            Pas d'image
                        </div>
                    )}
                </div>

                <h3 className="mt-4 font-semibold text-gray-800 text-lg line-clamp-1">{event.title}</h3>

                <div className="flex justify-between items-center mt-2 text-gray-500 text-sm">
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
                <div className="top-[150px] right-0 left-0 z-10 absolute bg-gradient-to-r from-[#580FCA] to-[#C320C0] px-4 py-2 rounded-xl text-white translate-y-[-10%]">
                    <div className="flex items-center gap-1">
                        <p className="font-medium text-xs">Événement terminé</p>
                        <Link
                            to={`/event/${event.id}`}
                            className="bg-white hover:bg-[#580FCA] px-3 py-0.5 border border-white rounded-full text-[#580FCA] hover:text-white text-xs transition-all"
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