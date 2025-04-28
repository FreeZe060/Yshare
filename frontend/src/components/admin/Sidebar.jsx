import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../config/authHeader';

const Sidebar = ({ active, setActive }) => {
	const { user } = useAuth();
	const [version, setVersion] = useState("");
	const [openSubMenu, setOpenSubMenu] = useState(active === 'all-events' || active === 'participants');

	const handleClick = (key, hasSub) => {
		if (hasSub) {
			if (active === 'events') {
				setOpenSubMenu(prev => !prev);
			} else {
				setOpenSubMenu(true);
			}
		} else {
			setActive(key);
			setOpenSubMenu(false);
		}
	};

	useEffect(() => {
		fetch("/version.txt")
			.then(response => response.text())
			.then(text => setVersion(text.trim()));
	}, []);

	if (!user || !user.id) return null;

	const navItems = [
		{ key: 'dashboard', icon: null, label: 'Dashboard', desc: 'Data overview' },
		{ key: 'reports', icon: 'fa-file-alt', label: 'Reports', desc: 'Manage Reports' },
		{ key: 'users', icon: 'fa-user', label: 'Users', desc: 'Manage Users' },
		{ key: 'events', icon: 'fa-calendar', label: 'Events', desc: 'Manage Events', hasSub: true },
		{ key: 'comments', icon: 'fa-comments', label: 'Comments', desc: 'Manage Comments' },
		{ key: 'news', icon: 'fa-newspaper', label: 'News', desc: 'Manage News' },
	];

	const eventSubItems = [
		{ key: 'all-events', label: 'All Events' },
		{ key: 'participants', label: 'Participants' }
	];

	const isEventsSubItem = ['all-events', 'participants'].includes(active);

	return (
		<div className="bg-white shadow-xl col-span-3 xxs:flex xxs:flex-row sm:flex-col xxs:justify-between xxs:items-center rounded-lg p-4">
			<h1 className="font-bold text-lg sm:text-3xl bg-gradient-to-br from-indigo-600 via-indigo-400 to-indigo-300 bg-clip-text text-transparent">
				Dashboard<span className="text-indigo-500">.</span>
			</h1>
			<p className="text-gray-500 text-sm mb-2">Welcome back,</p>

			<Link
				to={`/profile/${user?.id}`}
				className="flex flex-col space-y-2 xxs:space-y-0 xxs:flex-row mb-5 items-center xxs:space-x-2 hover:bg-indigo-50 group transition duration-150 ease-linear rounded-lg w-full py-3 px-2"
			>
				<img className="rounded-full w-10 h-10 object-cover" src={user.profileImage ? `http://localhost:8080${user.profileImage}` : "https://via.placeholder.com/40"} alt={user?.name} />
				<div>
					<p className="font-medium text-gray-800 group-hover:text-indigo-500 leading-4">{user?.name} {user?.lastname}</p>
					<span className="text-xs text-gray-400">{user?.role}</span>
				</div>
			</Link>

			<hr className="my-2 border-gray-200" />

			<div className="flex flex-col xxs:flex-wrap xxs:gap-2 space-y-2 my-5">
				{navItems.map(({ key, icon, label, desc, hasSub }) => {
					const isActive = active === key;
					return (
						<React.Fragment key={key}>
							<button
								onClick={() => handleClick(key, hasSub)}
								className={`text-left w-full transition duration-300 ease-in-out rounded-lg py-3 px-2 group ${
									key === 'events' && isEventsSubItem ? 'bg-indigo-50' : active === key ? 'bg-indigo-50' : 'hover:bg-indigo-50'
								}`}
							>
								<div className="flex flex-row xxs:flex-col items-center gap-4">
									<i className={`fa-regular ${icon} text-2xl xxs:text-xl ${
										key === 'events' && isEventsSubItem ? 'text-indigo-500' :
										active === key ? 'text-indigo-500' : 'text-black'
									} group-hover:text-indigo-500`} />
									<div className="text-left xxs:text-center">
										<p className={`font-bold text-lg xxs:text-base ${
											key === 'events' && isEventsSubItem ? 'text-indigo-500' :
											active === key ? 'text-indigo-500' : 'text-gray-800'
										} group-hover:text-indigo-500`}>
											{label}
										</p>
										<p className="text-gray-400 text-sm block sm:hidden">{desc}</p>
									</div>
								</div>
							</button>


							{hasSub && openSubMenu && key === 'events' && (
								<div className="ml-6 mt-1 space-y-1 transition-all">
									{eventSubItems.map(sub => (
										<button
											key={sub.key}
											onClick={() => setActive(sub.key)}
											className={`block text-sm text-left w-full px-4 py-2 rounded hover:bg-indigo-100 ${active === sub.key ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}
										>
											{sub.label}
										</button>
									))}
								</div>
							)}
						</React.Fragment>
					);
				})}
			</div>

			<p className="text-sm text-center text-gray-400" style={{ fontFamily: "'Source Code Pro', monospace" }}>
				v{version} | &copy; 2025 YShare
			</p>
		</div>
	);
};

export default Sidebar;