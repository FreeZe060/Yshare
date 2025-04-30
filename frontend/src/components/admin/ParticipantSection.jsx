import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAllParticipantsForAdmin from '../../hooks/Admin/useAllParticipantsForAdmin';
import useUpdateParticipantStatus from '../../hooks/Participant/useUpdateParticipantStatus';
import { useAuth } from '../../config/authHeader';

const getStatusColor = (status) => {
	const normalized = status.toLowerCase();
	if (normalized === 'inscrit') return 'text-green-600';
	if (normalized === 'en attente') return 'text-orange-500';
	if (normalized === 'refusé') return 'text-red-500';
	return 'text-gray-600';
};

const sortIcon = (direction) => (
	direction === 'asc'
		? <i className="fas fa-sort-up text-gray-800" />
		: <i className="fas fa-sort-down text-gray-800" />
);

const ParticipantSection = () => {
	const { participants, loading, error, refetch } = useAllParticipantsForAdmin();
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const participantsPerPage = 8;
	const [statusFilter, setStatusFilter] = useState('Tous');
	const { updateStatus, loading: updating, error: updateError } = useUpdateParticipantStatus();
	const theadRef = useRef();
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (theadRef.current && !theadRef.current.contains(e.target)) setSortField(null);
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	const handleStatusUpdate = async (participant) => {
		const options = {
			"En Attente": ["Inscrit", "Refusé"],
			"Inscrit": ["En Attente", "Refusé"],
			"Refusé": ["En Attente", "Inscrit"]
		};

		const choices = options[participant.status] || [];

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

		let newStatus = null;
		if (result.isConfirmed) newStatus = choices[0];
		else if (result.isDenied) newStatus = choices[1];

		if (newStatus) {
			console.log("Updating participant:", participant.id, "to status:", newStatus);
			try {
				await updateStatus(participant.eventId, participant.id, newStatus, user.token); // ✅ appel via hook
				await refetch();
				Swal.fire("Succès", `Le statut a été mis à jour en "${newStatus}"`, "success");
			} catch (err) {
				console.error("Erreur lors de la mise à jour :", err);
				Swal.fire("Erreur", "Impossible de mettre à jour le statut.", "error");
			}
		}
	};

	const filteredParticipants = useMemo(() => {
		return statusFilter === 'Tous'
			? participants
			: participants.filter((p) => p.status === statusFilter);
	}, [participants, statusFilter]);

	const sortedParticipants = useMemo(() => {
		let sorted = [...filteredParticipants];
		if (sortField) {
			sorted.sort((a, b) => {
				const valA = a[sortField]?.toString().toLowerCase() || '';
				const valB = b[sortField]?.toString().toLowerCase() || '';
				if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
				if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
				return 0;
			});
		}
		return sorted;
	}, [filteredParticipants, sortField, sortDirection]);

	const paginatedParticipants = useMemo(() => {
		const startIndex = (currentPage - 1) * participantsPerPage;
		return sortedParticipants.slice(startIndex, startIndex + participantsPerPage);
	}, [sortedParticipants, currentPage]);

	if (loading) return <p>Chargement...</p>;
	if (error) return <p className="text-red-500">Erreur : {error}</p>;

	return (
		<div>
			<h1 className="font-bold py-4 uppercase text-gray-800">Demandes de participation</h1>

			<div className="mb-4">
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="border p-2 rounded"
				>
					<option value="Tous">Tous</option>
					<option value="En Attente">En Attente</option>
					<option value="Inscrit">Inscrit</option>
					<option value="Refusé">Refusé</option>
					<option value="Annulé">Annulé</option>
				</select>
			</div>

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
									key={label}
									className="py-3 px-2 cursor-pointer text-left"
									onClick={() => handleSort(key)}
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
							{paginatedParticipants.map((p) => (
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
										<span className="hover:underline cursor-pointer" onClick={() => navigate(`/profile/${p.userId}`)}>
											{p.name} {p.lastname}
										</span>
									</td>
									<td className="py-3 px-2 hover:underline cursor-pointer" onClick={() => navigate(`/event/${p.eventId}`)}>
										{p.eventTitle}
									</td>
									<td className={`py-3 px-2 font-semibold ${getStatusColor(p.status)}`}>{p.status}</td>
									<td className="py-3 px-2">{new Date(p.joinedAt).toLocaleDateString()}</td>
									<td className="py-3 px-2 text-indigo-600">
										<i
											className="fas fa-sync-alt hover:text-yellow-600 cursor-pointer"
											onClick={() => handleStatusUpdate(p)}
										></i>
									</td>
								</motion.tr>
							))}
						</AnimatePresence>
					</tbody>
				</table>
			</div>

			{sortedParticipants.length > participantsPerPage && (
				<div className="flex justify-center items-center space-x-2 my-4">
					{Array.from({ length: Math.ceil(sortedParticipants.length / participantsPerPage) }).map((_, index) => (
						<motion.button
							key={index + 1}
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setCurrentPage(index + 1)}
							className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition ${currentPage === index + 1
								? 'bg-blue-500 text-white border-blue-500'
								: 'border-blue-500 text-blue-500 hover:bg-blue-100'}`}
						>
							{index + 1}
						</motion.button>
					))}
				</div>
			)}
		</div>
	);
};

export default ParticipantSection;