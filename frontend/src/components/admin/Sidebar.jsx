import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../config/authHeader'; // ou le bon chemin vers ton context

const Sidebar = () => {
	const { user } = useAuth();

    if (!user || !user.id) {
		return null; // Ou un loader si tu préfères
	}

	return (
		<div id="menu" className="bg-white shadow-xl col-span-3 rounded-lg p-4">
			<h1 className="font-bold text-lg sm:text-3xl bg-gradient-to-br from-indigo-600 via-indigo-400 to-indigo-300 bg-clip-text text-transparent">
				Dashboard<span className="text-indigo-500">.</span>
			</h1>
			<p className="text-gray-500 text-sm mb-2">Welcome back,</p>

			{/* Profile Link */}
			<Link to={`/profile/${user?.id}`} className="flex flex-col space-y-2 xxs:space-y-0 xxs:flex-row mb-5 items-center xxs:space-x-2 hover:bg-indigo-50 group transition duration-150 ease-linear rounded-lg w-full py-3 px-2">
				<div>
					<img
						className="rounded-full w-10 h-10 relative object-cover"
						src={user.profileImage ? `http://localhost:8080${user.profileImage}` : "https://via.placeholder.com/40"}
						alt={user?.name}
					/>
				</div>
				<div>
					<p className="font-medium text-gray-800 group-hover:text-indigo-500 leading-4">
						{user?.name} {user?.lastname}
					</p>
					<span className="text-xs text-gray-400">{user?.role}</span>
				</div>
			</Link>

			<hr className="my-2 border-gray-200" />

			<div id="menu" className="flex flex-col space-y-2 my-5">

				<Link to="/dashboard" className="hover:bg-indigo-50 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
					<div className="flex flex-col space-y-2 xxs:flex-row xxs:space-y-0 space-x-2 items-center">
						<svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l8.25-8.25c.3-.3.8-.3 1.1 0L21 12M4.5 10.5v9c0 .414.336.75.75.75H9.75v-3.75c0-.414.336-.75.75-.75h3c.414 0 .75.336.75.75V21h4.5c.414 0 .75-.336.75-.75v-9" />
						</svg>
						<div>
							<p className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-indigo-500">Dashboard</p>
							<p className="text-gray-400 text-sm hidden xxs:block">Data overview</p>
						</div>
					</div>
				</Link>

				<Link to="/reports" className="hover:bg-indigo-50 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
					<div className="flex flex-col space-y-2 xxs:flex-row xxs:space-y-0 space-x-2 items-center">
						<svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M9 14h6m-3-3v6m-3 3a9 9 0 1118 0 9 9 0 01-18 0z" />
						</svg>
						<div>
							<p className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-indigo-500">Reports</p>
							<p className="text-gray-400 text-sm hidden xxs:block">Manage Reports</p>
						</div>
					</div>
				</Link>

				<Link to="/users" className="hover:bg-indigo-50 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
					<div className="flex flex-col space-y-2 xxs:flex-row xxs:space-y-0 space-x-2 items-center">
						<svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M5 20h14M9 4a3 3 0 016 0v2a2 2 0 002 2h1a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h1a2 2 0 002-2V4z" />
						</svg>
						<div>
							<p className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-indigo-500">Users</p>
							<p className="text-gray-400 text-sm hidden xxs:block">Manage Users</p>
						</div>
					</div>
				</Link>

				<Link to="/events" className="hover:bg-indigo-50 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
					<div className="flex flex-col space-y-2 xxs:flex-row xxs:space-y-0 space-x-2 items-center">
						<svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M3 9.75h18M5.25 4.5a.75.75 0 01.75.75V6h12v-.75a.75.75 0 011.5 0V6h.75a.75.75 0 01.75.75v12.75a.75.75 0 01-.75.75H4.5a.75.75 0 01-.75-.75V6.75a.75.75 0 01.75-.75h.75v-.75a.75.75 0 01.75-.75z" />
						</svg>
						<div>
							<p className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-indigo-500">Events</p>
							<p className="text-gray-400 text-sm hidden xxs:block">Manage Events</p>
						</div>
					</div>
				</Link>

				<Link to="/comments" className="hover:bg-indigo-50 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
					<div className="flex flex-col space-y-2 xxs:flex-row xxs:space-y-0 space-x-2 items-center">
						<svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M7.5 12h9m-9 4h6m1.5-10.5h-9A1.5 1.5 0 006 7.5v9A1.5 1.5 0 007.5 18h9A1.5 1.5 0 0018 16.5v-9A1.5 1.5 0 0016.5 6z" />
						</svg>
						<div>
							<p className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-indigo-500">Comments</p>
							<p className="text-gray-400 text-sm hidden xxs:block">Manage Comments</p>
						</div>
					</div>
				</Link>

				<Link to="/news" className="hover:bg-indigo-50 transition duration-150 ease-linear rounded-lg py-3 px-2 group">
					<div className="flex flex-col space-y-2 xxs:flex-row xxs:space-y-0 space-x-2 items-center">
						<svg className="w-6 h-6 text-gray-700 group-hover:text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3h15a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H4.5A.75.75 0 013.75 20.25V3.75A.75.75 0 014.5 3zM7.5 6.75h9M7.5 9.75h9m-9 3h6m-6 3h6" />
						</svg>
						<div>
							<p className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-indigo-500">News</p>
							<p className="text-gray-400 text-sm hidden xxs:block">Manage News</p>
						</div>
					</div>
				</Link>

			</div>

			<p className="text-sm text-center text-gray-400">v2.0.0.3 | &copy; 2022 Pantazi Soft</p>
		</div>
	);
};

export default Sidebar;