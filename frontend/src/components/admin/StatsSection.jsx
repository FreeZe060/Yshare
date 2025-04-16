import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import useAllUsers from '../../hooks/Admin/useAllUsers';
import useReports from '../../hooks/Report/useReports';
import useEvents from '../../hooks/Events/useEvents';

const StatsSection = ({ setActiveSection }) => {
	const { users } = useAllUsers();
	const { reports } = useReports();
	const filters = useMemo(() => ({}), []);
	const { total } = useEvents(filters, 1, 1);

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

				{/* Users */}
				<motion.div
					className={`cursor-pointer ${cardClasses}`}
					onClick={() => setActiveSection('users')}
					whileHover={hoverAnimation}
				>
					<div className="flex flex-row space-x-4 items-center">
						<i className="fa-regular fa-user text-indigo-500 text-3xl xxs:text-xl" />
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Users</p>
							<p className="text-gray-900 font-bold text-2xl">{users?.length || 0}</p>
						</div>
					</div>
				</motion.div>

				{/* Events */}
				<motion.div
					className={`cursor-pointer ${cardClasses}`}
					onClick={() => setActiveSection('events')}
					whileHover={hoverAnimation}
				>
					<div className="flex flex-row space-x-4 items-center">
						<i className="fa-regular fa-calendar text-indigo-500 text-3xl xxs:text-xl" />
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Events</p>
							<p className="text-gray-900 font-bold text-2xl">{total || 0}</p>
						</div>
					</div>
				</motion.div>

				{/* Reports */}
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
		</div>
	);
};

export default StatsSection;

// import React, { useMemo } from 'react';
// import useAllUsers from '../../hooks/Admin/useAllUsers';
// import useReports from '../../hooks/Report/useReports';
// import useEvents from '../../hooks/Events/useEvents';

// const StatsSection = ({ setActiveSection }) => {
// 	const { users } = useAllUsers();
// 	const { reports } = useReports();
// 	const filters = useMemo(() => ({}), []);
// 	const { total } = useEvents(filters, 1, 1);

// 	const cardClasses = "cursor-pointer bg-white shadow-md hover:shadow-lg transition duration-200 p-6 rounded-lg";

// 	return (
// 		<div id="24h">
// 			<h1 className="font-bold py-4 text-gray-800 uppercase">Last 24h Statistics</h1>
// 			<div id="stats" className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">

// 				{/* Users */}
// 				<div className={cardClasses} onClick={() => setActiveSection('users')}>
// 					<div className="flex flex-row space-x-4 items-center">
// 						<i className="fa-regular fa-user text-indigo-500 text-3xl xxs:text-xl" />
// 						<div>
// 							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Users</p>
// 							<p className="text-gray-900 font-bold text-2xl">{users?.length || 0}</p>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Events */}
// 				<div className={cardClasses} onClick={() => setActiveSection('events')}>
// 					<div className="flex flex-row space-x-4 items-center">
// 						<i className="fa-regular fa-calendar text-indigo-500 text-3xl xxs:text-xl" />
// 						<div>
// 							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Events</p>
// 							<p className="text-gray-900 font-bold text-2xl">{total || 0}</p>
// 						</div>
// 					</div>
// 				</div>

// 				{/* Reports */}
// 				<div className={cardClasses} onClick={() => setActiveSection('reports')}>
// 					<div className="flex flex-row space-x-4 items-center">
// 						<i className="fa-regular fa-file-alt text-indigo-500 text-3xl xxs:text-xl" />
// 						<div>
// 							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Reports</p>
// 							<p className="text-gray-900 font-bold text-2xl">{reports?.length || 0}</p>
// 						</div>
// 					</div>
// 				</div>

// 			</div>
// 		</div>
// 	);
// };

// export default StatsSection;