import React from 'react';
import { motion } from 'framer-motion';
import useDashboardStats from '../../../hooks/Admin/useDashboardStats';
import useReports from '../../../hooks/Report/useReports';

const StatsSection = ({ setActiveSection }) => {
	const { stats, loading, error } = useDashboardStats();
	const { reports } = useReports();

	const cardClasses = "bg-white shadow-md p-6 rounded-lg";

	const hoverAnimation = {
		scale: 1.05,
		rotate: 1,
		transition: { duration: 0.3, ease: 'easeInOut' },
	};

	return (
		<div id="24h">
			<h1 className="font-bold py-4 text-gray-800 uppercase">Last 24h Statistics</h1>
			<div id="stats" className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">

				<motion.div
					className={`cursor-pointer ${cardClasses}`}
					onClick={() => setActiveSection('users')}
					whileHover={hoverAnimation}
				>
					<div className="flex flex-row space-x-4 items-center">
						<i className="fa-regular fa-user text-indigo-500 text-3xl xxs:text-xl" />
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Active Users</p>
							<p className="text-gray-900 font-bold text-2xl">
								{loading ? '...' : stats?.activeUsers ?? 0}
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					className={`cursor-pointer ${cardClasses}`}
					onClick={() => setActiveSection('participants')}
					whileHover={hoverAnimation}
				>
					<div className="flex flex-row space-x-4 items-center">
						<i className="fa-regular fa-calendar text-indigo-500 text-3xl xxs:text-xl" />
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Total Participants</p>
							<p className="text-gray-900 font-bold text-2xl">
								{loading ? '...' : stats?.totalParticipants ?? 0}
							</p>
						</div>
					</div>
				</motion.div>

				<motion.div
					className={`cursor-pointer ${cardClasses}`}
					onClick={() => setActiveSection('reports')}
					whileHover={hoverAnimation}
				>
					<div className="flex flex-row space-x-4 items-center">
						<i className="fa-regular fa-file-alt text-indigo-500 text-3xl xxs:text-xl" />
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Reports</p>
							<p className="text-gray-900 font-bold text-2xl">{reports?.length || 0}</p>
						</div>
					</div>
				</motion.div>

			</div>
			{error && <p className="text-red-500 mt-4">Erreur : {error}</p>}
		</div>
	);
};

export default StatsSection;