import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { capitalizeFirstLetter } from '../utils/format';
import { showStatusSelection, showConfirmation } from '../utils/alert';
import { useAuth } from '../config/authHeader';
import useEvents from '../hooks/Events/useEvents';
import useReports from '../hooks/Report/useReports';
import useAllUsers from '../hooks/Admin/useAllUsers';
import useDeleteUser from '../hooks/Admin/useDeleteUser';
import useCategories from '../hooks/Categorie/useCategories';
import useDashboardStats from '../hooks/Admin/useDashboardStats';
import useAdminCreateUser from '../hooks/Admin/useAdminCreateUser';
import useUpdateUserStatus from '../hooks/Admin/useUpdateUserStatus';
import useCreateCategorie from '../hooks/Categorie/useCreateCategorie';
import useUpdateCategorie from '../hooks/Categorie/useUpdateCategorie';
import useDeleteCategorie from '../hooks/Categorie/useDeleteCategorie';
import useUpdateEventStatus from '../hooks/Events/useUpdateEventStatus';
import useAllParticipantsForAdmin from '../hooks/Admin/useAllParticipantsForAdmin';
import useUpdateParticipantStatus from '../hooks/Participant/useUpdateParticipantStatus';
import useSortedAndPaginatedData from '../hooks/Utils/useSortedAndPaginatedData';
import { getStatusColor, getStatusOptions } from '../utils/status';
import useAdminRatings from '../hooks/Admin/useAdminRatings';
import useDeleteRating from '../hooks/Admin/useDeleteRating';
import useUpdateReportStatus from '../hooks/Report/useUpdateReportStatus';
import useDeleteEvent from '../hooks/Events/useDeleteEvent';
import useAllComments from '../hooks/Comments/useAllComments';
import useDeleteComment from '../hooks/Comments/useDeleteComment';
import useUpdateComment from '../hooks/Comments/useUpdateComment';
import useDeleteNews from '../hooks/News/useDeleteNews';
import useAllNews from '../hooks/News/useAllNews';


///////////////////// COMPONENTS /////////////////////

import Sidebar from '../components/admin/Sidebar/Sidebar';
import StatsSection from '../components/admin/Stats/StatsSection';
import LastEventSection from '../components/admin/Stats/LestEventSection';
import LastUsersSection from '../components/admin/User/UserSection';
import ReportSection from '../components/admin/Report/ReportSection';
import ParticipantSection from '../components/admin/Participant/ParticipantSection';
import CommentSection from '../components/admin/Comment/CommentSection';
import EventSection from '../components/admin/Event/EventSection';
import NewsSection from '../components/admin/News/NewsSection';
import UserCamembert from '../components/admin/Stats/UserCamembert';
import CategorySection from '../components/admin/Categorie/CategorySection';
import AdminRatingSection from '../components/admin/Rating/AdminRatingSection';
import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';

export default function DashboardPage() {
	/**
	* dashboard:
	*/
	const navigate = useNavigate();
	const { user: authUser } = useAuth();
	const [activeSection, setActiveSection] = useState(() => {
		return localStorage.getItem('activeSection') || 'dashboard';
	});
	/**
	* stats:
	*/
	const { stats, loading: loadingStats, error: errorStats } = useDashboardStats();
	/**
	* reports:
	*/
	const { reports, refetch: fetchReports, loading: loadingReports, error: errorReports } = useReports();
	const { updateStatus: updateReportStatus, loading: loadingUpdateReportStatus } = useUpdateReportStatus();
	/**
	* user:
	*/
	const updateStatus = useUpdateUserStatus(authUser?.token);
	const { users, loading, error, refetch: fetchUsers } = useAllUsers();
	const { create: createUser, loading: creatingUser } = useAdminCreateUser();
	const deleteUser = useDeleteUser(authUser?.token);
	/**
	* events:
	*/
	const filters = useMemo(() => ({}), []);
	const { handleDeleteEvent } = useDeleteEvent();
	const { events, loading: loadingEvents, error: errorEvents } = useEvents(filters, 1, 5);
	const { categories, loading: loadingCategories, error: errorCategories, refetch: refetchCategories } = useCategories();
	/**
	* participants:
	*/
	const { participants, loading: loadingParticipants, error: errorParticipants, refetch: refetchParticipants } = useAllParticipantsForAdmin();
	const { updateStatus: updateParticipantStatus } = useUpdateParticipantStatus();
	/**
	* comments:
	*/
	const { comments, loading: loadingComments, error: errorComments, refetch: refetchComments } = useAllComments();
	const { remove: deleteComment } = useDeleteComment();
	const { update: updateComment } = useUpdateComment();
	/**
	* news:
	*/
	const { news, loading: loadingNews, error: errorNews, refetch: refetchNews } = useAllNews();
	const { remove: deleteNews } = useDeleteNews();
	/**
	* categories:
	*/
	const { create: createCategory } = useCreateCategorie();
	const { remove: deleteCategory } = useDeleteCategorie();
	const { update: updateCategory } = useUpdateCategorie();
	/**
	* ratings:
	*/
	const { ratings, loading: loadingRatings, error: errorRatings, refetch: refetchRatings } = useAdminRatings();
	const { remove: deleteRating } = useDeleteRating();

	/***********
	* SIDEBAR:
	************/

	useEffect(() => {
		localStorage.setItem('activeSection', activeSection);
	}, [activeSection]);

	const [version, setVersion] = useState("");
	const [openSubMenu, setOpenSubMenu] = useState(
		activeSection === 'all-events' || activeSection === 'participants'
	);
	const sidebarRef = useRef(null);

	const handleSidebarClick = (key, hasSub) => {
		if (hasSub) {
			setOpenSubMenu(prev => key === 'events' ? !prev : true);
		} else {
			setActiveSection(key);
			if (!['all-events', 'participants'].includes(key)) {
				setOpenSubMenu(false);
			}
		}
	};

	useEffect(() => {
		fetch("/version.txt")
			.then(res => res.text())
			.then(text => setVersion(text.trim()));
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
				setOpenSubMenu(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	/***********
	* USERS:
	************/

	const handleSuspendToggle = async (user) => {
		const isSuspended = user.status === 'Suspended';
		const nextStatus = isSuspended ? 'Approved' : 'Suspended';
		const action = isSuspended ? 'débannir' : 'suspendre';

		const { isConfirmed } = await showConfirmation({
			title: `Voulez-vous ${action} ${user.name} ${user.lastname} ?`,
			text: `Cette action ${isSuspended ? 'restaurera l’accès' : 'restreindra l’accès'} à l’utilisateur.`,
			icon: 'warning',
			confirmText: `Oui, ${action}`
		});

		if (!isConfirmed) return;

		try {
			await updateStatus(user.id, nextStatus);
			await fetchUsers();
		} catch (err) {
			console.error(`❌ Erreur lors de la mise à jour du statut de ${user.name} :`, err.message);
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
			try {
				await deleteUser(user.id);
				await fetchUsers();
			} catch (err) {
				console.error(`❌ Erreur lors de la suppression de ${user.name} :`, err.message);
			}
		}
	};

	const handleCreateUser = async () => {
		const { value: formValues } = await Swal.fire({
			title: 'Créer un nouvel utilisateur',
			html:
				'<input id="swal-name" class="swal2-input" placeholder="Prénom">' +
				'<input id="swal-lastname" class="swal2-input" placeholder="Nom">' +
				'<input id="swal-email" class="swal2-input" placeholder="Email">' +
				'<input id="swal-password" type="password" class="swal2-input" placeholder="Mot de passe">',
			focusConfirm: false,
			showCancelButton: true,
			confirmButtonText: 'Créer',
			cancelButtonText: 'Annuler',
			preConfirm: () => {
				const name = document.getElementById('swal-name').value;
				const lastname = document.getElementById('swal-lastname').value;
				const email = document.getElementById('swal-email').value;
				const password = document.getElementById('swal-password').value;

				if (!name || !lastname || !email || !password) {
					Swal.showValidationMessage('Tous les champs sont requis');
					return;
				}
				return { name, lastname, email, password };
			}
		});

		if (!formValues) return;

		try {
			await createUser(formValues);
			await fetchUsers();
			Swal.fire('Succès', 'Utilisateur créé avec succès', 'success');
		} catch (err) {
			Swal.fire('Erreur', err.message, 'error');
		}
	};

	/***********
	* REPORTS:
	************/

	const handleUpdateReportStatus = async (report) => {
		const normalizedStatus = report.status?.trim().toLowerCase();
		const options = {
			"en attente": ["Validé", "Rejeté"],
			"validé": ["En attente", "Rejeté"],
			"rejeté": ["En attente", "Validé"]
		}[normalizedStatus];

		if (!options) return;

		const result = await Swal.fire({
			title: "Mettre à jour le statut",
			text: "Choisissez le nouveau statut pour ce signalement.",
			icon: "question",
			showCancelButton: true,
			showDenyButton: true,
			confirmButtonText: options[0],
			denyButtonText: options[1],
			cancelButtonText: "Annuler"
		});

		const finalStatus = result.isConfirmed ? options[0] : result.isDenied ? options[1] : null;

		if (finalStatus) {
			await updateReportStatus(report.id, finalStatus);
			await fetchReports();
			Swal.fire("Statut mis à jour", `Le signalement est maintenant "${finalStatus}".`, "success");
		}
	};

	/***********
	* EVENTS:
	************/

	const [currentPageEvents, setCurrentPageEvents] = useState(1);
	const [sortOption, setSortOption] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const { updateStatus: updateEventStatus } = useUpdateEventStatus();

	const eventFilters = useMemo(() => {
		const f = {};
		if (statusFilter) f.status = statusFilter;
		if (sortOption === 'a-z') f.sort = 'title_asc';
		else if (sortOption === 'date-newest') f.sort = 'start_time_desc';
		else if (sortOption === 'date-oldest') f.sort = 'start_time_asc';
		return f;
	}, [statusFilter, sortOption]);

	const { events: paginatedEvents, total: totalEvents, loading: loadingAllEvents, error: errorAllEvents } = useEvents(eventFilters, currentPageEvents, 6, true);
	const totalEventPages = Math.ceil(totalEvents / 6);

	const handleUpdateEventStatus = async (eventId) => {
		const { value: newStatus } = await Swal.fire({
			title: 'Modifier le statut de l’événement',
			input: 'select',
			inputOptions: {
				Planifié: 'Planifié',
				'En Cours': 'En Cours',
				Terminé: 'Terminé',
				Annulé: 'Annulé',
			},
			inputPlaceholder: 'Choisir un statut',
			showCancelButton: true,
			confirmButtonText: 'Mettre à jour',
			cancelButtonText: 'Annuler',
			confirmButtonColor: '#2563eb',
			inputValidator: value => {
				if (!value) return 'Vous devez sélectionner un statut';
			}
		});

		if (newStatus) {
			try {
				await updateEventStatus(eventId, newStatus, authUser?.token);
				Swal.fire({
					icon: 'success',
					title: 'Statut mis à jour !',
					text: `Le statut est maintenant "${newStatus}"`,
					timer: 2000,
					showConfirmButton: false,
				});
			} catch (error) {
				Swal.fire({
					icon: 'error',
					title: 'Erreur',
					text: error.message,
				});
			}
		}
	};

	const handleDeleteEventConfirm = async (event) => {
		const result = await Swal.fire({
			title: 'Supprimer cet événement ?',
			text: `"${event.title}" - Cette action est irréversible.`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Oui, supprimer',
			cancelButtonText: 'Annuler'
		});

		if (result.isConfirmed) {
			try {
				await handleDeleteEvent(event.id);
				Swal.fire('Supprimé', 'Événement supprimé avec succès.', 'success');
			} catch (err) {
				console.error('Erreur lors de la suppression de l’événement :', err.message);
				Swal.fire('Erreur', err.message, 'error');
			}
		}
	};

	/***********
	* PARTICIPANTS:
	************/

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

	const handleUpdateParticipantStatus = async (participant) => {
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
			await updateParticipantStatus(participant.eventId, participant.id, newStatus, authUser.token);
			await refetchParticipants();
			Swal.fire("Succès", `Le statut a été mis à jour en "${newStatus}"`, "success");
		} catch (err) {
			console.error("❌ Erreur lors de la mise à jour :", err);
			Swal.fire("Erreur", "Impossible de mettre à jour le statut.", "error");
		} finally {
			setUpdatingId(null);
		}
	};

	/***********
	* COMMENTS:
	************/

	const handleDeleteComment = async (comment) => {
		const result = await Swal.fire({
			title: 'Supprimer ce commentaire ?',
			text: comment.message,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Oui, supprimer',
			cancelButtonText: 'Annuler',
		});
		if (!result.isConfirmed) return;
		try {
			await deleteComment(comment.id);
			await refetchComments();
			Swal.fire('Supprimé !', 'Le commentaire a été supprimé.', 'success');
		} catch (err) {
			Swal.fire('Erreur', err.message, 'error');
		}
	};

	const handleUpdateComment = async (comment) => {
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
				await updateComment(comment.id, { message });
				await refetchComments();
				Swal.fire('Modifié', 'Le commentaire a été mis à jour.', 'success');
			} catch (err) {
				Swal.fire('Erreur', err.message, 'error');
			}
		}
	};

	/***********
	* NEWS:
	************/

	const handleDeleteNews = async (item) => {
		const { isConfirmed } = await Swal.fire({
			title: 'Supprimer cette actualité ?',
			text: item.title,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Oui, supprimer',
			cancelButtonText: 'Annuler',
		});

		if (!isConfirmed) return;

		try {
			await deleteNews(item.id, authUser?.token);
			await refetchNews();
			Swal.fire('Supprimé', 'Actualité supprimée avec succès.', 'success');
		} catch (err) {
			Swal.fire('Erreur', err.message, 'error');
		}
	};


	/***********
	* CATEGORIES:
	************/

	const MySwal = withReactContent(Swal);

	const toast = (message) => {
		MySwal.fire({
			toast: true,
			position: 'bottom-end',
			showConfirmButton: false,
			timer: 3000,
			icon: 'success',
			title: message,
		});
	};

	const handleCreateCategory = async () => {
		const parentOptions = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
		const { value: formValues } = await MySwal.fire({
			title: 'Ajouter une catégorie',
			html: `
					<input id="swal-input-name" class="swal2-input" placeholder="Nom de la catégorie">
					<select id="swal-input-parent" class="swal2-select">
						<option value="">Aucune catégorie parent</option>
						${parentOptions}
					</select>
				`,
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				const name = document.getElementById('swal-input-name').value.trim();
				const parent_id = document.getElementById('swal-input-parent').value || null;
				if (!name) return Swal.showValidationMessage('Le nom est requis');
				return { name, parent_id };
			}
		});

		if (formValues) {
			try {
				await createCategory(formValues);
				toast('Catégorie créée avec succès');
				refetchCategories();
			} catch (err) {
				Swal.fire('Erreur', err.message, 'error');
			}
		}
	};

	const handleEditCategory = async (cat) => {
		const parentOptions = categories
			.filter(c => c.id !== cat.id)
			.map(c => `<option value="${c.id}" ${c.id === cat.parent_id ? 'selected' : ''}>${c.name}</option>`)
			.join('');

		const { value: formValues } = await MySwal.fire({
			title: 'Modifier la catégorie',
			html: `
					<input id="swal-input-name" class="swal2-input" value="${cat.name}">
					<select id="swal-input-parent" class="swal2-select">
						<option value="">Aucune catégorie parent</option>
						${parentOptions}
					</select>
				`,
			focusConfirm: false,
			showCancelButton: true,
			preConfirm: () => {
				const name = document.getElementById('swal-input-name').value.trim();
				const parent_id = document.getElementById('swal-input-parent').value || null;
				if (!name) return Swal.showValidationMessage('Le nom est requis');
				return { name, parent_id };
			}
		});

		if (formValues && (formValues.name !== cat.name || formValues.parent_id !== cat.parent_id)) {
			try {
				await updateCategory(cat.id, formValues);
				toast('Catégorie modifiée avec succès');
				refetchCategories();
			} catch (err) {
				Swal.fire('Erreur', err.message, 'error');
			}
		}
	};

	const handleDeleteCategory = async (cat) => {
		const result = await Swal.fire({
			title: 'Supprimer cette catégorie ?',
			text: cat.name,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Oui, supprimer',
			cancelButtonText: 'Annuler',
		});
		if (result.isConfirmed) {
			try {
				await deleteCategory(cat.id);
				toast('Catégorie supprimée avec succès');
				refetchCategories();
			} catch (err) {
				Swal.fire('Erreur', err.message, 'error');
			}
		}
	};

	/***********
	* RATINGS:
	************/

	const ratingsUtils = useSortedAndPaginatedData(
		ratings || [],
		() => true,
		8,
		(a, b, field) => {
			if (field === 'user') {
				const nameA = `${a.user?.name || ''} ${a.user?.lastname || ''}`.toLowerCase();
				const nameB = `${b.user?.name || ''} ${b.user?.lastname || ''}`.toLowerCase();
				return nameA.localeCompare(nameB);
			}
			if (field === 'event') {
				return (a.event?.title || '').localeCompare(b.event?.title || '');
			}
			const valA = a[field]?.toString().toLowerCase?.() || '';
			const valB = b[field]?.toString().toLowerCase?.() || '';
			return valA.localeCompare(valB);
		}
	);

	const handleDeleteRating = async (rating) => {
		const result = await Swal.fire({
			title: 'Supprimer cette note ?',
			text: `Note de ${rating.user?.name} ${rating.user?.lastname} pour l'événement ${rating.event?.title}`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Oui, supprimer',
			cancelButtonText: 'Annuler',
		});

		if (result.isConfirmed) {
			try {
				await deleteRating(rating.id);
				toast('Note supprimée avec succès');
				refetchRatings();
			} catch (err) {
				Swal.fire('Erreur', err.message, 'error');
			}
		}
	};

	/***********
	* RENDER CONTENT:
	************/

	const renderContent = () => {
		switch (activeSection) {
			case 'dashboard':
				return (
					<>
						<StatsSection
							setActiveSection={setActiveSection}
							stats={stats}
							loading={loadingStats}
							error={errorStats}
							reports={reports}
						/>
						<LastEventSection events={events} loading={loadingEvents} error={errorEvents} Link={Link} />
						<UserCamembert
							setActiveSection={setActiveSection}
							Link={Link}
							users={users}
							stats={stats}
							usersError={error}
							statsError={errorStats}
							usersLoading={loading}
							statsLoading={loadingStats}
							onSuspend={handleSuspendToggle}
							onDelete={handleDelete}
						/>
					</>
				);
			case 'users':
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
					>
						<h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
						<LastUsersSection
							users={users}
							loading={loading}
							error={error}
							fetchUsers={fetchUsers}
							updateStatus={updateStatus}
							deleteUser={deleteUser}
							createUser={createUser}
							creatingUser={creatingUser}
							onSuspend={handleSuspendToggle}
							onDelete={handleDelete}
							onCreate={handleCreateUser}
							capitalizeFirstLetter={capitalizeFirstLetter}
							Link={Link}
							AnimatePresence={AnimatePresence}
							showAll
						/>
					</motion.div>
				);
			case 'reports':
				return (
					<motion.div
						className="text-gray-800"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<ReportSection
							reports={reports}
							loading={loadingReports}
							error={errorReports}
							onUpdateStatus={handleUpdateReportStatus}
						/>
					</motion.div>
				);
			case 'all-events':
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<EventSection
							events={paginatedEvents}
							loading={loadingAllEvents}
							error={errorAllEvents}
							currentPage={currentPageEvents}
							setCurrentPage={setCurrentPageEvents}
							sortOption={sortOption}
							setSortOption={setSortOption}
							statusFilter={statusFilter}
							setStatusFilter={setStatusFilter}
							totalPages={totalEventPages}
							onUpdateStatus={handleUpdateEventStatus}
							onDelete={handleDeleteEventConfirm}
							Link={Link}
						/>
					</motion.div>
				);
			case 'participants':
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<ParticipantSection
							navigate={navigate}
							user={authUser}
							participants={participants}
							loading={loadingParticipants}
							error={errorParticipants}
							onUpdateStatus={handleUpdateParticipantStatus}
							updatingId={updatingId}
							token={authUser?.token}
							showAssignModal={showAssignModal}
							setShowAssignModal={setShowAssignModal}
							refetchParticipants={refetchParticipants}
							AnimatePresence={AnimatePresence}
							useSortedAndPaginatedData={useSortedAndPaginatedData}
							statusFilter={statusFilter}
							setStatusFilter={setStatusFilter}
							theadRef={theadRef}
							capitalizeFirstLetter={capitalizeFirstLetter}
							getStatusColor={getStatusColor}
						/>
					</motion.div>
				);
			case 'comments':
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<CommentSection
							comments={comments}
							loading={loadingComments}
							error={errorComments}
							onDelete={handleDeleteComment}
							onEdit={handleUpdateComment}
							refetch={refetchComments}
						/>
					</motion.div>
				);
			case 'news':
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<NewsSection
							news={news}
							loading={loadingNews}
							error={errorNews}
							onDelete={handleDeleteNews}
							refetch={refetchNews}
							Link={Link}
						/>
					</motion.div>
				);
			case 'categories':
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<CategorySection
							categories={categories}
							loading={loadingCategories}
							error={errorCategories}
							onCreate={handleCreateCategory}
							onEdit={handleEditCategory}
							onDelete={handleDeleteCategory}
						/>
					</motion.div>
				);
			case 'ratings':
				return (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
					>
						<AdminRatingSection
							loading={loadingRatings}
							error={errorRatings}
							paginatedItems={ratingsUtils.paginatedItems}
							sort={ratingsUtils.sort}
							pagination={ratingsUtils.pagination}
							onDelete={handleDeleteRating}
							Link={Link}
						/>
					</motion.div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Header />
			<div className="antialiased bg-gradient-to-br from-white via-[#F6E2F2] to-[#DD9ED5] w-full min-h-screen text-slate-300 relative py-20">
				<div className="grid md:grid-cols-1 grid-cols-12 mx-auto gap-2 md:gap-4 sm:gap-6 max-w-7xl my-10 px-2">
					<Sidebar
						user={authUser}
						active={activeSection}
						setActive={setActiveSection}
						version={version}
						openSubMenu={openSubMenu}
						setOpenSubMenu={setOpenSubMenu}
						handleClick={handleSidebarClick}
						sidebarRef={sidebarRef}
						Link={Link}
					/>
					<div id="content" className="bg-white lg:mt-4 shadow-xl col-span-9 rounded-lg p-6">
						<AnimatePresence mode="wait">
							{renderContent()}
						</AnimatePresence>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}