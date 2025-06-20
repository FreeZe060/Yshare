import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RowSkeleton from '../../SkeletonLoading/RowSkeleton';

const sortIcon = (dir) =>
    dir === 'asc' ? <i className="fas fa-sort-up" /> : <i className="fas fa-sort-down" />;

const AdminRatingSection = ({ loading, error, paginatedItems, sort, pagination, onDelete }) => {
    const theadRef = useRef();

    const columns = [
        { label: 'Utilisateur', field: 'user' },
        { label: 'Événement', field: 'event' },
        { label: 'Note', field: 'rating' },
        { label: 'Message', field: 'message' },
    ];

    if (loading) return <RowSkeleton count={6} />;
    if (error) return <p className="text-red-600 font-medium">Erreur : {error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold py-4 uppercase text-gray-800">Notes des utilisateurs</h1>

            <div className="overflow-x-auto rounded-lg shadow bg-white">
                <table className="w-full text-sm">
                    <thead ref={theadRef} className="bg-indigo-100 text-black">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className="py-3 px-6 text-left cursor-pointer"
                                    onClick={() => sort.toggleSort(col.field)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium uppercase tracking-wide ${sort.sortField === col.field ? 'underline font-bold' : ''}`}>
                                            {col.label}
                                        </span>
                                        {sort.sortField === col.field && sortIcon(sort.sortDirection)}
                                    </div>
                                </th>
                            ))}
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedItems.map(rating => (
                                <motion.tr
                                    key={rating.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-6 text-black">
                                        <div className="flex items-center space-x-2">
                                            <img src={`http://localhost:8080${rating.user?.profileImage || '/default-profile.jpg'}`} alt="pp" className="w-8 h-8 rounded-full" />
                                            <span>{rating.user?.name} {rating.user?.lastname}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6 text-black">{rating.event?.title || '–'}</td>
                                    <td className="py-3 px-6 text-black">{rating.rating}</td>
                                    <td className="py-3 px-6 text-black">{rating.message}</td>
                                    <td className="py-3 px-6">
                                        <button onClick={() => onDelete(rating)} title="Supprimer">
                                            <i className="fas fa-trash text-red-500 hover:scale-110 transition" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center py-4">
                        {Array.from({ length: pagination.totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => pagination.goToPage(i + 1)}
                                className={`mx-1 px-3 py-1 rounded-full text-sm font-medium transition border
                                    ${pagination.page === i + 1
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'text-indigo-600 border-indigo-300 hover:bg-indigo-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRatingSection;