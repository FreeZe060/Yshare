// components/Admin/CommentsPanel.jsx
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import useAllComments from '../../hooks/Comments/useAllComments';
import useDeleteComment from '../../hooks/Comments/useDeleteComment';
import useClickOutside from '../../hooks/Utils/useClickOutside';
import useSortedAndPaginatedData from '../../hooks/Utils/useSortedAndPaginatedData';
import RowSkeleton from '../SkeletonLoading/RowSkeleton';
import { capitalizeFirstLetter } from '../../utils/format';

const MySwal = withReactContent(Swal);

const sortIcon = (direction) =>
    direction === 'asc' ? <i className="fas fa-sort-up text-gray-500" /> : <i className="fas fa-sort-down text-gray-500" />;

const CommentSection = () => {
    const { comments, loading, error, refetch } = useAllComments();
    const { remove } = useDeleteComment();

    const theadRef = useRef();
    useClickOutside(theadRef, () => sort.setSortField(null));

    const { paginatedItems, sort, pagination } = useSortedAndPaginatedData(
        comments || [],
        () => true,
        8
    );

    const handleDelete = async (comment) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Supprimer ce commentaire ?',
            text: comment.message,
            icon: 'warning',
            confirmButtonText: 'Oui, supprimer',
            showCancelButton: true
        });

        if (!isConfirmed) return;

        try {
            await remove(comment.id);
            await refetch();
            Swal.fire('Supprimé !', 'Le commentaire a été supprimé.', 'success');
        } catch (err) {
            Swal.fire('Erreur', err.message, 'error');
        }
    };

    const handleViewThread = (comment) => {
        MySwal.fire({
            title: `Discussion sur "${comment.eventTitle}"`,
            html: `
        <div class="text-left">
          <p><strong>${comment.author}</strong> : ${comment.message}</p>
          <hr />
          ${(comment.replies || [])
                    .map(reply => `<p><strong>${reply.author}</strong> : ${reply.message}</p>`)
                    .join('') || '<em>Aucune réponse</em>'}
        </div>`,
            customClass: {
                popup: 'rounded-lg shadow-xl p-6',
            },
            showCloseButton: true,
            confirmButtonText: 'Fermer',
            width: 600
        });
    };

    if (loading) return <RowSkeleton count={6} />;
    if (error) return <p className="text-red-500">Erreur : {error}</p>;

    return (
        <div className="admin-comments">
            <h1 className="font-bold py-4 uppercase text-gray-800">Commentaires Récents</h1>
            <div className="overflow-x-auto rounded-lg shadow bg-white">
                <table className="w-full text-sm">
                    <thead ref={theadRef} className="bg-indigo-100 text-indigo-700">
                        <tr>
                            {['Auteur', 'Événement', 'Message', 'Date'].map((field, index) => (
                                <th
                                    key={field}
                                    className="py-3 px-2 cursor-pointer"
                                    onClick={() => sort.toggleSort(field.toLowerCase())}
                                >
                                    <span className="flex items-center gap-x-1.5">
                                        {field}
                                        {sort.sortField === field.toLowerCase() && sortIcon(sort.sortDirection)}
                                    </span>
                                </th>
                            ))}
                            <th className="py-3 px-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedItems.map((comment) => (
                                <motion.tr
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="py-2 px-2 font-semibold text-gray-700">{comment.author}</td>
                                    <td className="py-2 px-2">{comment.eventTitle}</td>
                                    <td className="py-2 px-2 truncate max-w-[200px]">{comment.message}</td>
                                    <td className="py-2 px-2 text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-2">
                                        <div className="flex space-x-2 text-indigo-500">
                                            <button onClick={() => handleViewThread(comment)} title="Voir la discussion">
                                                <i className="fas fa-eye" />
                                            </button>
                                            <button onClick={() => handleDelete(comment)} title="Supprimer" className="hover:text-red-600">
                                                <i className="fas fa-trash" />
                                            </button>
                                        </div>
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

export default CommentSection;