import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAllUsers from '../../hooks/Admin/useAllUsers';
import useReports from '../../hooks/Report/useReports';
import useEvents from '../../hooks/Events/useEvents';

const StatsSection = () => {
	const navigate = useNavigate();

	const { users } = useAllUsers();
	const { reports } = useReports();
    const filters = useMemo(() => ({}), []);
	const { total } = useEvents(filters, 1, 1);

	const cardClasses = "cursor-pointer bg-white shadow-md hover:shadow-lg transition duration-200 p-6 rounded-lg";

	return (
		<div id="24h">
			<h1 className="font-bold py-4 text-gray-800 uppercase">Last 24h Statistics</h1>
			<div id="stats" className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">

				{/* Users */}
				<div className={cardClasses} onClick={() => navigate('/users')}>
					<div className="flex flex-row space-x-4 items-center">
                        <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a3 3 0 110-6 3 3 0 010 6zM12 9a6 6 0 100 12 6 6 0 000-12z" />
                        </svg>
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Users</p>
							<p className="text-gray-900 font-bold text-2xl">{users?.length || 0}</p>
						</div>
					</div>
				</div>

				{/* Events */}
				<div className={cardClasses} onClick={() => navigate('/events')}>
					<div className="flex flex-row space-x-4 items-center">
                        <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M3 9.75h18M5.25 4.5a.75.75 0 01.75.75v.75h12v-.75a.75.75 0 111.5 0V6h.75a.75.75 0 01.75.75v12.75a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V6.75a.75.75 0 01.75-.75h.75v-.75a.75.75 0 01.75-.75z" />
                        </svg>
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Events</p>
							<p className="text-gray-900 font-bold text-2xl">{total || 0}</p>
						</div>
					</div>
				</div>

				{/* Reports */}
				<div className={cardClasses} onClick={() => navigate('/reports')}>
					<div className="flex flex-row space-x-4 items-center">
                        <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v-.008H12v.008zM4.5 19.5l15-15M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                        </svg>
						<div>
							<p className="text-indigo-600 text-sm font-medium uppercase leading-4">Reports</p>
							<p className="text-gray-900 font-bold text-2xl">{reports?.length || 0}</p>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
};

export default StatsSection;
