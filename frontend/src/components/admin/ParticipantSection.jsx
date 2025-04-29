import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAllParticipantsForAdmin from '../../hooks/Admin/useAllParticipantsForAdmin';

const sortIcon = (direction) => (
	direction === 'asc'
		? <i className="fas fa-sort-up text-gray-500" />
		: <i className="fas fa-sort-down text-gray-500" />
);

const ParticipantSection = () => {
	const { participants, loading, error } = useAllParticipantsForAdmin();
	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');
	const [currentPage, setCurrentPage] = useState(1);
	const participantsPerPage = 8;
	const [statusFilter, setStatusFilter] = useState('Tous');
	const theadRef = useRef();

	useEffect(() => {
		document.addEventListener('mousedown', (e) => {
			if (theadRef.current && !theadRef.current.contains(e.target)) setSortField(null);
		});
		return () => document.removeEventListener('mousedown', () => {});
	}, []);

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortField(field);
			setSortDirection('asc');
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
				<table className="w-full text-sm">
					<thead ref={theadRef} className="bg-indigo-100 text-indigo-700">
						<tr>
							{['Nom', 'Événement', 'Statut', 'Date de demande'].map((field, index) => (
								<th
									key={field}
									className="py-3 px-2 cursor-pointer text-left"
									onClick={() => handleSort(field.toLowerCase())}
								>
									<span className="flex items-center gap-x-1.5">
										{field}
										{sortField === field.toLowerCase() && sortIcon(sortDirection)}
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
									<td className="py-3 px-2">{p.name} {p.lastname}</td>
									<td className="py-3 px-2">{p.eventTitle}</td>
									<td className="py-3 px-2">{p.status}</td>
									<td className="py-3 px-2">{new Date(p.joinedAt).toLocaleDateString()}</td>
									<td className="py-3 px-2 text-indigo-600">
										<i className="fas fa-check hover:text-green-500 cursor-pointer mr-2"></i>
										<i className="fas fa-times hover:text-red-500 cursor-pointer"></i>
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
