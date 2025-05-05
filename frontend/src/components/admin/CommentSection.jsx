import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import useAllComments from '../../hooks/Comments/useAllComments';
import useDeleteComment from '../../hooks/Comments/useDeleteComment';
import useUpdateComment from '../../hooks/Comments/useUpdateComment';
import useClickOutside from '../../hooks/Utils/useClickOutside';
import useSortedAndPaginatedData from '../../hooks/Utils/useSortedAndPaginatedData';
import RowSkeleton from '../SkeletonLoading/RowSkeleton';
import CreateCommentModal from './CreateCommentModal';

const MySwal = withReactContent(Swal);

const sortIcon = (direction) =>
    direction === 'asc'
        ? <i className="fas fa-sort-up" />
        : <i className="fas fa-sort-down" />;

const buildCommentChain = (comment, allComments, indent = 0) => {
    if (!comment) return '';
    const dateStr = new Date(comment.createdAt).toLocaleString();
    const authorLink = `/profile/${comment.eventCreatorId || comment.authorId || ''}`;
    const currentHtml = `
        <div style="
            margin-bottom: 16px;
            padding: 12px;
            background: #f9fafb;
            border-left: 4px solid #6366f1;
            border-radius: 8px;
            font-family: 'Segoe UI', sans-serif;
            max-width: 600px;
        ">
            <div style="font-weight: bold; color: #1f2937; font-size: 0.9rem; text-align: left;">
                <a href="${authorLink}" style="color: #4f46e5;">${comment.author}</a>
            </div>
            <div style="margin-top: 4px; font-size: 1rem; color: #374151;">${comment.message}</div>
            <div style="margin-top: 8px; font-size: 0.75rem; color: #6b7280; text-align: right;">${dateStr}</div>
        </div>
    `;
    const parent = allComments.find(c => c.id === comment.parentCommentId);
    return buildCommentChain(parent, allComments, indent + 20) + currentHtml;
};

const CommentSection = () => {
    const { comments, loading, error, refetch } = useAllComments();
    const { remove } = useDeleteComment();
    const { update } = useUpdateComment();
    const theadRef = useRef();
    const [showModal, setShowModal] = useState(false);


    useClickOutside(theadRef, () => sort.setSortField(null));

    const { paginatedItems, sort, pagination } = useSortedAndPaginatedData(
        comments || [],
        () => true,
        8
    );

    const columns = [
        { label: 'Auteur', field: 'author' },
        { label: 'Événement', field: 'eventTitle' },
        { label: 'Message', field: 'message' },
        { label: 'Date', field: 'createdAt' },
    ];

    const handleDelete = async (c) => {
        const result = await Swal.fire({
            title: 'Supprimer ce commentaire ?',
            text: c.message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
        });
        if (!result.isConfirmed) return;
        try {
            await remove(c.id);
            await refetch();
            Swal.fire('Supprimé !', 'Le commentaire a été supprimé.', 'success');
        } catch (err) {
            Swal.fire('Erreur', err.message, 'error');
        }
    };

    const handleViewThread = (comment) => {
        const threadHtml = buildCommentChain(comment, comments);
        MySwal.fire({
            title: '<span style="font-size:1.25rem; font-weight:700; color:#2d3748;">Fil de discussion</span>',
            html: `<div style="font-family: 'Segoe UI', sans-serif;">${threadHtml}</div>`,
            customClass: { popup: 'rounded-2xl shadow-2xl p-6 bg-white max-w-2xl' },
            showCloseButton: true,
            showConfirmButton: false,
            width: 680,
            backdrop: 'rgba(0, 0, 0, 0.4)',
        });
    };

    const handleEdit = async (comment) => {
        const { value: message } = await Swal.fire({
            title: 'Modifier le commentaire',
            input: 'textarea',
            inputLabel: 'Nouveau message',
            inputValue: comment.message,
            inputPlaceholder: 'Modifiez le texte ici...',
            showCancelButton: true,
            confirmButtonText: 'Enregistrer',
            cancelButtonText: 'Annuler',
        });

        if (message && message !== comment.message) {
            try {
                await update(comment.id, { message });
                await refetch();
                Swal.fire('Modifié', 'Le commentaire a été mis à jour.', 'success');
            } catch (err) {
                Swal.fire('Erreur', err.message, 'error');
            }
        }
    };

    if (loading) return <RowSkeleton count={6} />;
    if (error) return <p className="text-red-600 font-medium">Erreur : {error}</p>;

    return (
        <div className="admin-comments">
            <h1 className="text-2xl font-bold py-4 uppercase text-gray-800">Commentaires Récents</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
                >
                    <i className="fas fa-comment-dots mr-2" />
                    Ajouter un commentaire
                </button>
                <AnimatePresence>
                    {showModal && (
                        <CreateCommentModal
                            onClose={() => setShowModal(false)}
                            onSubmit={refetch}
                        />
                    )}
                </AnimatePresence>

            </div>

            <div className="overflow-x-auto rounded-lg shadow bg-white">
                <table className="w-full text-sm">
                    <thead ref={theadRef} className="bg-indigo-100 text-indigo-700">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className="py-3 px-4 cursor-pointer"
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
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedItems.map(comment => (
                                <motion.tr
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="py-2 px-4 max-w-xs truncate">
                                        <Link
                                            to={`/profile/${comment.eventCreatorId}`}
                                            className="text-indigo-600 hover:underline font-semibold text-sm"
                                        >{comment.author}</Link>
                                    </td>
                                    <td className="py-2 px-4 max-w-xs truncate">
                                        <Link
                                            to={`/events/${comment.eventId}`}
                                            className="text-indigo-600 hover:underline font-semibold text-sm"
                                        >{comment.eventTitle}</Link>
                                    </td>
                                    <td className="py-2 px-4 max-w-md">
                                        <button
                                            onClick={() => handleViewThread(comment)}
                                            className="text-gray-900 hover:text-indigo-600 text-sm break-words text-left w-full max-w-md"
                                        >{comment.message}</button>
                                    </td>
                                    <td className="py-2 px-4 text-gray-500 text-sm">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-2 px-4">
                                        <div className="flex space-x-3 items-center">
                                            <button
                                                onClick={() => handleViewThread(comment)}
                                                title="Voir"
                                                className="transform hover:scale-110 transition"
                                            ><i className="fas fa-eye text-indigo-500" /></button>
                                            <button
                                                onClick={() => handleEdit(comment)}
                                                title="Modifier"
                                                className="transform hover:scale-110 transition text-yellow-500"
                                            ><i className="fas fa-pen" /></button>
                                            <button
                                                onClick={() => handleDelete(comment)}
                                                title="Supprimer"
                                                className="transform hover:scale-110 transition text-red-500"
                                            ><i className="fas fa-trash" /></button>
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
                            >{i + 1}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;