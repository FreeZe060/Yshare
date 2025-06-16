import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import useAllParticipantsForAdmin from '../../../hooks/Admin/useAllParticipantsForAdmin';
import useUpdateParticipantStatus from '../../../hooks/Participant/useUpdateParticipantStatus';
import useSortedAndPaginatedData from '../../../hooks/Utils/useSortedAndPaginatedData';
import { useAuth } from '../../../config/authHeader';
import { getStatusColor, getStatusOptions } from '../../../utils/status';

import RowSkeleton from '../../SkeletonLoading/RowSkeleton';
import AssignParticipantModal from './AssignParticipantModal';

const sortIcon = (direction) =>
    direction === 'asc'
        ? <i className="fas fa-sort-up text-gray-800" />
        : <i className="fas fa-sort-down text-gray-800" />;

const ParticipantSection = () => {
    const { participants, loading, error, refetch } = useAllParticipantsForAdmin();
    const { updateStatus } = useUpdateParticipantStatus();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [statusFilter, setStatusFilter] = useState('Tous');
    const [updatingId, setUpdatingId] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);

    const theadRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (theadRef.current && !theadRef.current.contains(e.target)) return;
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const {
        paginatedItems,
        pagination: { page, totalPages, goToPage },
        sort: { sortField, sortDirection, toggleSort }
    } = useSortedAndPaginatedData(
        participants,
        (p) => statusFilter === 'Tous' || p.status === statusFilter,
        8
    );

    const handleStatusUpdate = async (participant) => {
        const choices = getStatusOptions(participant.status);

        const result = await Swal.fire({
            title: "Mettre à jour le statut",
            text: "Choisissez un nouveau statut.",
            icon: "question",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: choices[0],
            denyButtonText: choices[1],
            cancelButtonText: "Annuler",
            reverseButtons: true,
        });

        const newStatus = result.isConfirmed ? choices[0] : result.isDenied ? choices[1] : null;

        if (!newStatus || newStatus === participant.status) return;

        try {
            setUpdatingId(participant.id);
            await updateStatus(participant.eventId, participant.id, newStatus, user.token);
            await refetch();
            Swal.fire("Succès", `Le statut a été mis à jour en "${newStatus}"`, "success");
        } catch (err) {
            console.error("❌ Erreur lors de la mise à jour :", err);
            Swal.fire("Erreur", "Impossible de mettre à jour le statut.", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="overflow-x-auto rounded-lg shadow-md bg-white min-h-[600px]">
                <table className="w-full text-sm">
                    <thead className="bg-indigo-100 text-indigo-700">
                        <tr>
                            {['Nom', 'Événement', 'Statut', 'Date de demande', 'Actions'].map((title, i) => (
                                <th key={i} className="py-3 px-2 text-left">{title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <RowSkeleton key={i} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (error) return <p className="text-red-500">Erreur : {error}</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-gray-800 text-xl">Demandes de participation</h1>
                <button
                    onClick={() => setShowAssignModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
                >
                    <i className="fas fa-user-plus mr-2" />
                    Ajouter un participant
                </button>
            </div>

            <AnimatePresence>
                {showAssignModal && (
                    <AssignParticipantModal
                        token={user.token}
                        onClose={() => setShowAssignModal(false)}
                        onSubmit={refetch}
                    />
                )}
            </AnimatePresence>

            <div className="overflow-x-auto rounded-lg shadow-md bg-white">
                <table className="w-full text-sm text-gray-900">
                    <thead ref={theadRef} className="bg-indigo-100 text-indigo-700">
                        <tr>
                            {[
                                { label: 'Nom', key: 'name' },
                                { label: 'Événement', key: 'eventTitle' },
                                { label: 'Statut', key: 'status' },
                                { label: 'Date de demande', key: 'joinedAt' }
                            ].map(({ label, key }) => (
                                <th
                                    key={key}
                                    onClick={() => toggleSort(key)}
                                    className="py-3 px-2 cursor-pointer text-left"
                                >
                                    <span className="flex items-center gap-x-1.5">
                                        {label}
                                        {sortField === key && sortIcon(sortDirection)}
                                    </span>
                                </th>
                            ))}
                            <th className="py-3 px-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedItems.map((p) => (
                                <motion.tr
                                    key={p.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="py-3 px-2 flex items-center space-x-2">
                                        <img
                                            src={`http://localhost:8080${p.profileImage || '/default-avatar.png'}`}
                                            alt={p.name}
                                            className="w-8 h-8 rounded-full object-cover cursor-pointer"
                                            onClick={() => navigate(`/profile/${p.userId}`)}
                                        />
                                        <span
                                            className="hover:underline cursor-pointer"
                                            onClick={() => navigate(`/profile/${p.userId}`)}
                                        >
                                            {p.name} {p.lastname}
                                        </span>
                                    </td>
                                    <td
                                        className="py-3 px-2 hover:underline cursor-pointer"
                                        onClick={() => navigate(`/event/${p.eventId}`)}
                                    >
                                        {p.eventTitle}
                                    </td>
                                    <td className={`py-3 px-2 font-semibold ${getStatusColor(p.status)}`}>
                                        {p.status}
                                    </td>
                                    <td className="py-3 px-2">
                                        {new Intl.DateTimeFormat('fr-FR').format(new Date(p.joinedAt))}
                                    </td>
                                    <td className="py-3 px-2 text-indigo-600">
                                        {updatingId === p.id ? (
                                            <i className="fas fa-spinner fa-spin text-gray-500" />
                                        ) : (
                                            <i
                                                className="fas fa-sync-alt hover:text-yellow-600 cursor-pointer"
                                                title="Changer le statut"
                                                onClick={() => handleStatusUpdate(p)}
                                            ></i>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 my-4">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <motion.button
                            key={i + 1}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => goToPage(i + 1)}
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${page === i + 1
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'border-blue-500 text-blue-500 hover:bg-blue-100'
                                }`}
                        >
                            {i + 1}
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParticipantSection;