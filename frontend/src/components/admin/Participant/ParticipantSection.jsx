import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import NotFound from '../../../pages/NotFound';
import RowSkeleton from '../../SkeletonLoading/RowSkeleton';
import AssignParticipantModal from './AssignParticipantModal';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/';

const sortIcon = (direction) =>
    direction === 'asc'
        ? <i className="text-gray-800 fas fa-sort-up" />
        : <i className="text-gray-800 fas fa-sort-down" />;

const ParticipantSection = ({
    participants,
    loading,
    error,
    onUpdateStatus,
    updatingId,
    showAssignModal,
    setShowAssignModal,
    refetchParticipants,
    getStatusColor,
    navigate,
    AnimatePresence,
    user,
    useSortedAndPaginatedData,
    statusFilter,
    setStatusFilter,
    theadRef,
}) => {
    
    

    // const [statusFilter, setStatusFilter] = useState('Tous');
    // const [updatingId, setUpdatingId] = useState(null);
    // const [showAssignModal, setShowAssignModal] = useState(false);

    // const theadRef = useRef();

    // useEffect(() => {
    //     const handleClickOutside = (e) => {
    //         if (theadRef.current && !theadRef.current.contains(e.target)) return;
    //     };
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => document.removeEventListener('mousedown', handleClickOutside);
    // }, []);

    const {
        paginatedItems,
        pagination: { page, totalPages, goToPage },
        sort: { sortField, sortDirection, toggleSort }
    } = useSortedAndPaginatedData(
        participants,
        (p) => statusFilter === '' || p.status === statusFilter,
        8
    );

    // const handleStatusUpdate = async (participant) => {
    //     const choices = getStatusOptions(participant.status);

    //     const result = await Swal.fire({
    //         title: "Mettre à jour le statut",
    //         text: "Choisissez un nouveau statut.",
    //         icon: "question",
    //         showCancelButton: true,
    //         showDenyButton: true,
    //         confirmButtonText: choices[0],
    //         denyButtonText: choices[1],
    //         cancelButtonText: "Annuler",
    //         reverseButtons: true,
    //     });

    //     const newStatus = result.isConfirmed ? choices[0] : result.isDenied ? choices[1] : null;

    //     if (!newStatus || newStatus === participant.status) return;

    //     try {
    //         setUpdatingId(participant.id);
    //         await updateStatus(participant.eventId, participant.id, newStatus, user.token);
    //         await refetch();
    //         Swal.fire("Succès", `Le statut a été mis à jour en "${newStatus}"`, "success");
    //     } catch (err) {
    //         console.error("❌ Erreur lors de la mise à jour :", err);
    //         Swal.fire("Erreur", "Impossible de mettre à jour le statut.", "error");
    //     } finally {
    //         setUpdatingId(null);
    //     }
    // };

    if (loading) {
        return (
            <div className="bg-white shadow-md rounded-lg min-h-[600px] overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-[#F6E2F2] text-[#BA28C0]">
                        <tr>
                            {['Nom', 'Événement', 'Statut', 'Date de demande', 'Actions'].map((title, i) => (
                                <th key={i} className="px-2 py-3 text-left">{title}</th>
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

    if (error) return <NotFound/>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-gray-800 text-xl">Demandes de participation</h1>
                <button
                    onClick={() => setShowAssignModal(true)}
                    className="bg-[#C72EBF] hover:bg-[#BA28C0] shadow px-4 py-2 rounded text-white transition"
                >
                    <i className="mr-2 fas fa-user-plus" />
                    Ajouter un participant
                </button>
            </div>

            <AnimatePresence>
                {showAssignModal && (
                    <AssignParticipantModal
                        token={user.token}
                        onClose={() => setShowAssignModal(false)}
                        onSubmit={refetchParticipants}
                    />
                )}
            </AnimatePresence>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-gray-900 text-sm">
                    <thead ref={theadRef} className="bg-[#F6E2F2] text-[#BA28C0]">
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
                                    className="px-2 py-3 text-left cursor-pointer"
                                >
                                    <span className="flex items-center gap-x-1.5">
                                        {label}
                                        {sortField === key && sortIcon(sortDirection)}
                                    </span>
                                </th>
                            ))}
                            <th className="px-2 py-3 text-left">Actions</th>
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
                                    className="hover:bg-gray-50 border-b"
                                >
                                    <td className="flex items-center space-x-2 px-2 py-3">
                                        <img
                                            src={`${API_BASE_URL}${p.profileImage || '/default-avatar.png'}`}
                                            alt={p.name}
                                            className="rounded-full w-8 h-8 object-cover cursor-pointer"
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
                                        className="px-2 py-3 hover:underline cursor-pointer"
                                        onClick={() => navigate(`/event/${p.eventId}`)}
                                    >
                                        {p.eventTitle}
                                    </td>
                                    <td className={`py-3 px-2 font-semibold ${getStatusColor(p.status)}`}>
                                        {p.status}
                                    </td>
                                    <td className="px-2 py-3">
                                        {new Intl.DateTimeFormat('fr-FR').format(new Date(p.joinedAt))}
                                    </td>
                                    <td className="px-2 py-3 text-[#C72EBF]">
                                        {updatingId === p.id ? (
                                            <i className="text-gray-500 fas fa-spinner fa-spin" />
                                        ) : (
                                            <i
                                                className="hover:text-yellow-600 cursor-pointer fas fa-sync-alt"
                                                title="Changer le statut"
                                                onClick={() => onUpdateStatus(p)}
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
                                ? 'bg-[#D232BE] text-white border-[#D232BE]'
                                : 'border-[#D232BE] text-[#D232BE] hover:bg-blue-100'
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