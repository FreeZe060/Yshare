import React from 'react';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';

const Sidebar = ({
	user,
	active,
	setActive,
	version,
	openSubMenu,
	setOpenSubMenu,
	handleClick,
	sidebarRef,
	Link
}) => {

	if (!user || !user.id) return null;

	const navItems = [
		{ key: 'dashboard', icon: 'fa-house', label: 'Dashboard', desc: 'Data overview' },
		{ key: 'reports', icon: 'fa-file-alt', label: 'Reports', desc: 'Manage Reports' },
		{ key: 'users', icon: 'fa-user', label: 'Users', desc: 'Manage Users' },
		{ key: 'events', icon: 'fa-calendar', label: 'Events', desc: 'Manage Events', hasSub: true },
		{ key: 'comments', icon: 'fa-comments', label: 'Comments', desc: 'Manage Comments' },
		{ key: 'news', icon: 'fa-newspaper', label: 'News', desc: 'Manage News' },
		{ key: 'categories', icon: 'fa-folder', label: 'Categories', desc: 'Manage Categories' },
		{ key: 'ratings', icon: 'fa-star', label: 'Ratings', desc: 'Manage Ratings' },
	];

	const eventSubItems = [
		{ key: 'all-events', label: 'All Events' },
		{ key: 'participants', label: 'Participants' }
	];

	const isEventsSubItem = ['all-events', 'participants'].includes(active);

	return (
		<div ref={sidebarRef} className="bg-white shadow-xl col-span-3 md:col-span-9 lg:mt-4 md:flex flex-col md:justify-between md:items-center rounded-lg p-4">
			<div className="md:flex md:justify-between md:w-full">
				<div className="flex flex-col">
					<h1 className="font-bold md:text-lg text-3xl bg-gradient-to-br from-[#C72EBF] via-[#EE7AB5] to-[#DD9ED5] bg-clip-text text-transparent">
						Dashboard<span className="text-[#B926C1]">.</span>
					</h1>
					<p className="text-gray-500 text-sm mb-2 md:mb-0">Welcome back,</p>
				</div>
				<Link
					to={`/profile/${user?.id}`}
					className="flex flex-col md:flex-col items-center justify-center mb-5 md:mb-0 space-y-2 md:space-y-2 hover:bg-indigo-50 group transition duration-150 ease-linear rounded-lg w-full pb-[0.75rem] px-2"
				>
					<img
						className="rounded-full w-16 h-16 object-cover"
						src={user.profileImage ? `${REACT_APP_API_BASE_URL}${user.profileImage}` : "https://via.placeholder.com/40"}
						alt={user?.name}
					/>
					<div className="text-center">
						<p className="font-medium text-gray-800 group-hover:text-[#B926C1] leading-4">
							{user?.name} {user?.lastname}
						</p>
						<span className="text-xs text-gray-400">{user?.role}</span>
					</div>
				</Link>
			</div>

			<hr className="my-2 border-gray-200" />

			<div className="flex flex-col md:flex-row md:gap-2 md:justify-start md:items-end md:w-full space-y-2 my-5 xs:overflow-x-auto xs:whitespace-nowrap">
				{navItems.map(({ key, icon, label, desc, hasSub }) => {
					const isActive = active === key;
					return (
						<React.Fragment key={key}>
							<button
								onClick={() => handleClick(key, hasSub)}
								className={`text-left w-full transition duration-300 ease-in-out rounded-lg py-3 px-2 group ${key === 'events' && isEventsSubItem ? 'bg-indigo-50' : active === key ? 'bg-indigo-50' : 'hover:bg-indigo-50'
									}`}
							>
								<div className="flex flex-row md:flex-col items-center gap-4">
									{key === 'dashboard' ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className={`w-6 h-6 ${isActive ? 'text-[#B926C1]' : 'text-black'} group-hover:text-[#EE7AB5]`}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
											/>
										</svg>
									) : (
										<i className={`fa-regular ${icon} text-2xl md:text-xl ${isActive || (key === 'events' && isEventsSubItem) ? 'text-[#B926C1]' : 'text-black'} group-hover:text-[#B926C1]`} />
									)}
									<div className="text-left md:text-center">
										<p className={`font-bold text-lg md:text-base ${key === 'events' && isEventsSubItem ? 'text-[#B926C1]' :
											active === key ? 'text-[#B926C1]' : 'text-gray-800'
											} group-hover:text-[#B926C1]`}>
											{label}
										</p>
										<p className="text-gray-400 text-sm block md:hidden">{desc}</p>
									</div>
								</div>
							</button>


							{hasSub && openSubMenu && key === 'events' && (
								<div className="ml-6 mt-1 md:flex md:flex-col space-y-1 transition-all">
									{eventSubItems.map(sub => (
										<button
											key={sub.key}
											onClick={() => setActive(sub.key)}
											className={`block text-sm text-left w-full px-4 py-2 rounded hover:bg-[#F6E2F2] ${active === sub.key ? 'text-[#C72EBF] font-semibold' : 'text-gray-600'}`}
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