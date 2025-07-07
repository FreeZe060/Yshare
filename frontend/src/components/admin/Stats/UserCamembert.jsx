import React from 'react';
import Swal from 'sweetalert2';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';

Chart.register(ArcElement, Tooltip, Legend);

const UserCamembert = ({ setActiveSection, Link, users, stats, usersError, statsError, usersLoading, statsLoading, onSuspend,
    onDelete }) => {

	if (usersLoading || statsLoading) return <div>Chargement...</div>;
	if (usersError) return <div className="text-red-500">Erreur utilisateurs : {usersError}</div>;
	if (statsError) return <div className="text-red-500">Erreur stats : {statsError}</div>;

	const lastUsers = users.slice(-5).reverse();
	const avgPct = stats.avgParticipation;
	const totalUsers = users.length;
	const totalEvents = Object.values(stats.eventsPerCategory).reduce((a, b) => a + b, 0);

	const pieData = {
		labels: ['Participation moyenne (%)', 'Inactif'],
		datasets: [{
			data: [avgPct, 100 - avgPct],
			backgroundColor: ['#6366F1', '#E0E7FF'],
			borderWidth: 0,
		}]
	};

	return (
		<div className="flex md:flex-col flex-row gap-8 w-full items-stretch mt-4">
			<div className="md:w-full w-1/2">
				<div className="flex justify-between items-center mb-4">
					<h2 className="font-bold text-lg text-gray-800 uppercase">Derniers utilisateurs</h2>
				</div>

				<div className="bg-white shadow-md rounded-lg p-4 space-y-3">
					{lastUsers.map(user => (
						<div key={user.id} className="flex items-center justify-between border-b last:border-none py-2">
							<div className="flex items-center space-x-3">
								<Link to={`/profile/${user.id}`}>
									<img
										src={`${REACT_APP_API_BASE_URL}${user.profileImage || '/default-avatar.png'}`}
										alt={`${user.name}`}
										className="w-10 h-10 rounded-full object-cover"
									/>
								</Link>
								<div>
									<p className="font-semibold text-gray-800">{user.name} {user.lastname}</p>
									<p className={`text-sm ${user.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}>
										{user.status}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 text-[#C72EBF] text-lg">
								<motion.button whileHover={{ scale: 1.1 }} onClick={() => onSuspend(user)}>
									<i className={`fas ${user.status === 'Suspended' ? 'fa-lock-open' : 'fa-ban'}`} />
								</motion.button>
								<motion.button whileHover={{ scale: 1.1 }} onClick={() => onDelete(user)}>
									<i className="fas fa-trash-alt text-red-500" />
								</motion.button>
							</div>
						</div>
					))}
					<div className="text-right pt-3">
						<button
							onClick={() => setActiveSection('users')}
							className="text-[#C72EBF] hover:underline font-medium"
						>
							👤 Voir tous les utilisateurs
						</button>
					</div>
				</div>
			</div>

			<div className="md:w-full w-1/2">
				<h2 className="font-bold text-lg py-2 text-gray-800">Statistiques</h2>
				<div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center min-h-[440px]">
					<div className="w-70 h-70">
						<Pie data={pieData} />
					</div>

					<div className="mt-4 w-full text-sm">
						<button
							onClick={() => setActiveSection('all-events')}
							className="flex justify-between w-full text-gray-700 hover:underline"
						>
							<span>📅 Événements :</span>
							<span className="font-semibold">{totalEvents}</span>
						</button>

						<button
							onClick={() => setActiveSection('users')}
							className="flex justify-between w-full text-gray-700 hover:underline"
						>
							<span>👥 Utilisateurs :</span>
							<span className="font-semibold">{totalUsers}</span>
						</button>

						<div className="flex justify-between text-gray-700">
							<span>📊 Moy. participation :</span>
							<span className="font-semibold">{avgPct.toFixed(1)}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserCamembert;