import React from 'react';
import { Link } from 'react-router-dom';
import useAllUsers from '../../hooks/Admin/useAllUsers';

const LastUsersSection = () => {
	const { users, loading, error } = useAllUsers();

	// Prendre les 5 derniers utilisateurs créés (triés par date de création décroissante)
	const lastFiveUsers = [...(users || [])]
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	if (loading) return <p>Chargement des utilisateurs...</p>;
	if (error) return <p className="text-red-500">Erreur : {error}</p>;

	return (
		<div id="last-users">
			<h1 className="font-bold py-4 uppercase text-gray-800">Last 5 Users</h1>

			<div className="overflow-x-auto rounded-lg shadow-md bg-white">
				<table className="w-full whitespace-nowrap text-sm sm:text-xs">
					<thead className="bg-indigo-100 text-indigo-700">
						<tr>
							<th className="text-left py-3 px-2 rounded-l-lg">Name</th>
							<th className="text-left py-3 px-2">Email</th>
							<th className="text-left py-3 px-2">Role</th>
							<th className="text-left py-3 px-2">Status</th>
							<th className="text-left py-3 px-2 rounded-r-lg">Actions</th>
						</tr>
					</thead>
					<tbody>
						{lastFiveUsers.map(user => (
							<tr
								key={user.id}
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
									<div className="inline-flex items-center space-x-3 text-indigo-500">
										<Link to={`/admin/edit-user/${user.id}`} title="Edit" className="hover:text-indigo-700 transition">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none"
												viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
												className="w-5 h-5">
												<path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688..." />
											</svg>
										</Link>
										<Link to={`/admin/edit-password/${user.id}`} title="Edit password" className="hover:text-indigo-700 transition">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none"
												viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
												className="w-5 h-5">
												<path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0..." />
											</svg>
										</Link>
										<button onClick={() => console.log('TODO: suspend user', user.id)} title="Suspend user" className="hover:text-red-600 transition">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none"
												viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
												className="w-5 h-5">
												<path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0..." />
											</svg>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default LastUsersSection;
