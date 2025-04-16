import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../../config/authHeader';
import useAllUsers from '../../hooks/Admin/useAllUsers';
import useUpdateUserStatus from '../../hooks/Admin/useUpdateUserStatus';
import useDeleteUser from '../../hooks/Admin/useDeleteUser';
import { showConfirmation } from '../../utils/showConfirmation';

import RowSkeleton from '../SkeletonLoading/RowSkeleton';

const sortIcon = (direction) => {
	return direction === 'asc'
		? <i className="fas fa-sort-up text-gray-500" />
		: <i className="fas fa-sort-down text-gray-500" />;
};

const LastUsersSection = ({ showAll = false }) => {
	const { user: authUser } = useAuth();
	const updateStatus = useUpdateUserStatus(authUser?.token);
	const deleteUser = useDeleteUser(authUser?.token);

	const { users, loading, error, refetch: fetchUsers } = useAllUsers(); 

	const [sortField, setSortField] = useState(null);
	const [sortDirection, setSortDirection] = useState('asc');

	const theadRef = useRef();

	const handleSort = (field) => {
		if (sortField === field) {
			setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (theadRef.current && !theadRef.current.contains(e.target)) {
				setSortField(null);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSuspendToggle = async (user) => {
		const newStatus = user.status === 'Suspended' ? 'Approved' : 'Suspended';
		const action = newStatus === 'Approved' ? 'débannir' : 'suspendre';

		const { isConfirmed } = await showConfirmation({
			title: `Voulez-vous ${action} ${user.name} ${user.lastname} ?`,
			text: 'Cette action prendra effet immédiatement.',
			icon: 'warning',
			confirmText: `Oui, ${action}`,
		});

		if (isConfirmed) {
			await updateStatus(user.id, newStatus);
			await fetchUsers();
		}
	};

	const handleDelete = async (user) => {
		const { isConfirmed } = await showConfirmation({
			title: 'Supprimer cet utilisateur ?',
			text: `${user.name} ${user.lastname} - Cette action est irréversible !`,
			icon: 'error',
			confirmText: 'Oui, supprimer',
		});

		if (isConfirmed) {
			await deleteUser(user.id);
			await fetchUsers();
		}
	};

	const sortedUsers = useMemo(() => {
		let sorted = [...(users || [])];

		if (!showAll) {
			sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
		}

		if (sortField) {
			sorted.sort((a, b) => {
				let valA = a[sortField]?.toString().toLowerCase() || '';
				let valB = b[sortField]?.toString().toLowerCase() || '';

				if (sortField === 'role' || sortField === 'status') {
					const order = sortField === 'role'
						? ['administrateur', 'utilisateur']
						: ['approved', 'suspended'];
					valA = order.indexOf(valA);
					valB = order.indexOf(valB);
				}

				if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
				if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return sorted;
	}, [users, showAll, sortField, sortDirection]);

	if (loading) {
		return (
			<div className="overflow-x-auto rounded-lg shadow-md bg-white">
				<table className="w-full whitespace-nowrap text-sm sm:text-xs">
					<thead className="bg-indigo-100 text-indigo-700">
						<tr>
							{['Nom', 'Email', 'Rôle', 'Statut', 'Actions'].map((field, i) => (
								<th key={i} className={`text-left py-3 px-2 ${i === 0 ? 'rounded-l-lg' : ''}`}>
									{field}
								</th>
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
		<div id="last-users">
			{!showAll && (
				<h1 className="font-bold py-4 uppercase text-gray-800">Last 5 Users</h1>
			)}

			<div className="overflow-x-auto rounded-lg shadow-md bg-white">
				<table className="w-full whitespace-nowrap text-sm sm:text-xs">
					<thead ref={theadRef} className="bg-indigo-100 text-indigo-700">
						<tr>
							{['name', 'email', 'role', 'status'].map((field, index) => (
								<th
									key={field}
									className={`text-left py-3 px-2 cursor-pointer ${index === 0 ? 'rounded-l-lg' : ''}`}
									onClick={() => handleSort(field)}
								>
									<span className="flex items-center gap-x-1.5 capitalize">
										{field}
										{sortField === field && sortIcon(sortDirection)}
									</span>
								</th>
							))}
							<th className="text-left py-3 px-2 rounded-r-lg">Actions</th>
						</tr>
					</thead>
					<tbody>
						<AnimatePresence>
							{sortedUsers.map((user) => (
								<motion.tr
									key={user.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
									className="border-b border-gray-200 hover:bg-gray-50 transition"
								>
									<td className="py-3 px-2 font-bold text-gray-800">
										<div className="inline-flex space-x-3 items-center">
											<img
												className="rounded-full w-8 h-8 object-cover"
												src={`http://localhost:8080${user.profileImage || '/default-avatar.png'}`}
												alt={`${user.name}`}
											/>
											<span>{user.name} {user.lastname}</span>
										</div>
									</td>
									<td className="py-3 px-2 text-gray-600">{user.email}</td>
									<td className="py-3 px-2 text-gray-600">{user.role}</td>
									<td className={`py-3 px-2 font-medium ${user.status === 'Approved' ? 'text-green-600' : 'text-red-500'}`}>
										{user.status}
									</td>
									<td className="py-3 px-2">
										<div className="inline-flex items-center space-x-3 text-indigo-500 text-lg">
											<Link to={`/profile/${user?.id}`} title="Voir profil" className="hover:text-indigo-700 transition">
												<i className="fas fa-pen" />
											</Link>

											<button
												onClick={() => handleSuspendToggle(user)}
												title={user.status === 'Suspended' ? 'Débannir' : 'Suspendre'}
												className={`transition ${user.status === 'Suspended' ? 'hover:text-green-600' : 'hover:text-yellow-600'}`}
											>
												<i className={`fas ${user.status === 'Suspended' ? 'fa-lock-open' : 'fa-ban'}`} />
											</button>

											<button
												onClick={() => handleDelete(user)}
												title="Supprimer"
												className="hover:text-red-600 transition"
											>
												<i className="fas fa-trash-alt" />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</AnimatePresence>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default LastUsersSection;