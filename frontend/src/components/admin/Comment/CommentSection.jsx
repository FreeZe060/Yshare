import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import useClickOutside from '../../../hooks/Utils/useClickOutside';
import useSortedAndPaginatedData from '../../../hooks/Utils/useSortedAndPaginatedData';
import RowSkeleton from '../../SkeletonLoading/RowSkeleton';
import CreateCommentModal from './CreateCommentModal';

import NotFound from '../../../pages/NotFound';

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

const CommentSection = ({ comments, loading, error, onDelete, onEdit, refetch }) => {
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

    if (loading) return <RowSkeleton count={6} />;
    if (error) return <NotFound/>;

    return (
        <div className="admin-comments">
            <h1 className="py-4 font-bold text-gray-800 text-2xl uppercase">Commentaires Récents</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-[#C72EBF] hover:bg-[#BA28C0] shadow px-4 py-2 rounded text-white transition"
                >
                    <i className="mr-2 fas fa-comment-dots" />
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

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead ref={theadRef} className="bg-[#F6E2F2] text-[#BA28C0]">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className="px-4 py-3 cursor-pointer"
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
                            <th className="px-4 py-3">Actions</th>
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
                                    className="hover:bg-gray-50 border-gray-200 border-b"
                                >
                                    <td className="px-4 py-2 max-w-xs truncate">
                                        <Link
                                            to={`/profile/${comment.eventCreatorId}`}
                                            className="font-semibold text-[#C72EBF] text-sm hover:underline"
                                        >{comment.author}</Link>
                                    </td>
                                    <td className="px-4 py-2 max-w-xs truncate">
                                        <Link
                                            to={`/event/${comment.eventId}`}
                                            className="font-semibold text-[#C72EBF] text-sm hover:underline"
                                        >{comment.eventTitle}</Link>
                                    </td>
                                    <td className="px-4 py-2 max-w-md">
                                        <button
                                            onClick={() => handleViewThread(comment)}
                                            className="w-full max-w-md text-gray-900 hover:text-[#C72EBF] text-sm text-left break-words"
                                        >{comment.message}</button>
                                    </td>
                                    <td className="px-4 py-2 text-gray-500 text-sm">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleViewThread(comment)}
                                                title="Voir"
                                                className="hover:scale-110 transition transform"
                                            ><i className="text-[#B926C1] fas fa-eye" /></button>
                                            <button
                                                onClick={() => onEdit(comment)}
                                                title="Modifier"
                                                className="text-yellow-500 hover:scale-110 transition transform"
                                            ><i className="fas fa-pen" /></button>
                                            <button
                                                onClick={() => onDelete(comment)}
                                                title="Supprimer"
                                                className="text-red-500 hover:scale-110 transition transform"
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
                                        ? 'bg-[#C72EBF] text-white border-[#C72EBF]'
                                        : 'text-[#C72EBF] border-[#DD9ED5] hover:bg-[#F6E2F2]'}`}
                            >{i + 1}</button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;