import React, { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import RowSkeleton from '../../SkeletonLoading/RowSkeleton';
import NotFound from '../../../pages/NotFound';

const sortIcon = (dir) =>
    dir === 'asc' ? <i className="fas fa-sort-up" /> : <i className="fas fa-sort-down" />;

const AdminRatingSection = ({ loading, error, paginatedItems, sort, pagination, onDelete, Link }) => {
    const theadRef = useRef();

    const columns = [
        { label: 'Utilisateur', field: 'user' },
        { label: 'Événement', field: 'event' },
        { label: 'Note', field: 'rating' },
        { label: 'Message', field: 'message' },
    ];

    if (loading) return <RowSkeleton count={6} />;
    if (error) return <NotFound/>;

    return (
        <div>
            <h1 className="py-4 font-bold text-gray-800 text-2xl uppercase">Notes des utilisateurs</h1>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead ref={theadRef} className="bg-indigo-100 text-black">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className="px-6 py-3 text-left cursor-pointer"
                                    onClick={() => sort.toggleSort(col.field)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`font-medium uppercase tracking-wide ${sort.sortField === col.field ? 'underline font-bold' : ''}`}>
                                            {col.label}
                                        </span>
                                        {sort.sortField === col.field && sortIcon(sort.sortDirection)}
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left">Actions</th>
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
                                    className="hover:bg-gray-50 border-gray-200 border-b"
                                >
                                    <td className="px-6 py-3 text-black">

                                        <Link to={`/profile/${rating.user?.id}`} className="flex items-center space-x-2 hover:underline">
                                            <img
                                                src={`http://localhost:8080${rating.user?.profileImage || '/default-profile.jpg'}`}
                                                alt="pp"
                                                className="rounded-full w-8 h-8"
                                            />
                                            <span>{rating.user?.name} {rating.user?.lastname}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-3 text-black">
                                        {rating.event ? (
                                            <Link
                                                to={`/event/${rating.event.id}`}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                {rating.event.title}
                                            </Link>
                                        ) : (
                                            '–'
                                        )}
                                    </td>
                                    <td className="px-6 py-3 text-black">{rating.rating}</td>
                                    <td className="px-6 py-3 text-black">{rating.message}</td>
                                    <td className="px-6 py-3">
                                        <button onClick={() => onDelete(rating)} title="Supprimer">
                                            <i className="text-red-500 hover:scale-110 transition fas fa-trash" />
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