import React, { useState } from 'react';
import StarRating from '../StarRating';
import { FiUser, FiEdit2 } from 'react-icons/fi';
import { FaMapMarkerAlt, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../config/authHeader';
import { motion } from 'framer-motion';

const calculateProfileCompletion = (user) => {
	let score = 0;
	if (user.profileImage) score += 20;
	if (user.bannerImage) score += 10;
	if (user.name) score += 10;
	if (user.lastname) score += 10;
	if (user.email) score += 10;
	if (user.street || user.streetNumber || user.city) score += 10;
	if (user.bio) score += 20;
	if (user.role) score += 10;
	return score;
  };
  

const ProfileCard = ({ user, onUpdateProfileImage, onUpdateProfileField }) => {
	const auth = useAuth();
	const currentUser = auth?.user;
	const isAdmin = auth?.isAdmin;
	const editable = currentUser?.id === user.id || isAdmin;
	const profileCompletion = calculateProfileCompletion(user);


	const [showFullBio, setShowFullBio] = useState(false);

	const handleImageChange = (e) => {
		if (onUpdateProfileImage) {
			const file = e.target.files[0];
			onUpdateProfileImage(file);
		}
	};

	const handleFieldChange = (field, value) => {
		if (onUpdateProfileField) {
			onUpdateProfileField(field, value);
		}
	};

	const shortBio = (bio) => {
		if (!bio) return '';
		const words = bio.split(' ');
		if (words.length > 30) {
			return words.slice(0, 30).join(' ') + '...';
		}
		return bio;
	};

	return (
		<main className="profile-page">
			{/* Section Bannière */}
			<section className="relative block h-[600px]">
				<div
					className="absolute top-0 w-full h-full bg-center bg-cover"
					style={{
						backgroundImage: `url('${user.bannerImage
							? `http://localhost:8080${user.bannerImage}`
							: 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&auto=format&fit=crop&w=2710&q=80'
							}')`,
					}}
				>
					{/* Navbar contenue au centre */}
					<div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full text-center text-white pt-12">
						<h1 className="font-bold text-[56px] md:text-[50px] xs:text-[45px]">Profile</h1>
						<ul className="inline-flex items-center gap-3 font-medium text-lg mt-2">
							<li className="opacity-80 cursor-pointer hover:text-blue-400">Home</li>
							<li><i className="fa-solid fa-angle-right"></i></li>
							<li className="current-page">Profile</li>
						</ul>
					</div>

					{/* Bouton modifier bannière */}
					{editable && (
						<div
							className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer z-10 hover:scale-105 transition-transform"
							onClick={() => document.getElementById('bannerImageInput').click()}
							title="Modifier la bannière"
						>
							<FiEdit2 size={24} className="text-blue-700" />
						</div>
					)}
				</div>

				{editable && (
					<input
						type="file"
						id="bannerImageInput"
						accept="image/*"
						className="hidden"
						onChange={(e) => {
							const file = e.target.files[0];
							if (file && onUpdateProfileImage) {
								onUpdateProfileImage(file, 'bannerImage');
							}
						}}
					/>
				)}
			</section>

			{/* Section Profil */}
			<section className="relative py-16 bg-blueGray-200">
				<div className="container mx-auto px-4">
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
						<div className="px-6">
							<div className="flex flex-col items-center -mt-20 relative">
								{/* Photo de profil */}
								<div className="relative">
									{user.profileImage ? (
										<img
											src={`http://localhost:8080${user.profileImage}`}
											alt="Profile"
											className="shadow-xl rounded-full h-40 w-40 object-cover border-4 border-white"
											onClick={() => editable && document.getElementById('profileImageInput').click()}
										/>
									) : (
										<div
											className="h-40 w-40 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
											onClick={() => editable && document.getElementById('profileImageInput').click()}
										>
											<FiUser size={48} className="text-white" />
										</div>
									)}
									{editable && (
										<div
											className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 hover:scale-110 transition"
											onClick={() => document.getElementById('profileImageInput').click()}
											title="Modifier la photo de profil"
										>
											<FiEdit2 size={20} className="text-blue-600" />
										</div>
									)}
									<input
										type="file"
										id="profileImageInput"
										className="hidden"
										accept="image/*"
										onChange={handleImageChange}
									/>
								</div>

								{/* Rating */}
								<div className="mt-4">
									<StarRating rating={user.rating || 0} />
								</div>

								<motion.div
									className="w-full max-w-md mt-4"
									initial={{ width: 0 }}
									animate={{ width: `${profileCompletion}%` }}
									transition={{ duration: 0.8 }}
								>
									<div className="h-4 bg-gray-300 rounded-full overflow-hidden">
										<div
											className="h-full rounded-full"
											style={{
												width: `${profileCompletion}%`,
												background: profileCompletion < 50 ? '#f87171' : profileCompletion < 80 ? '#fbbf24' : '#34d399',
												transition: 'width 0.8s ease, background 0.5s ease',
											}}
										></div>
									</div>
									<p className="text-center text-sm mt-2 text-blueGray-600 font-medium">
										Profil complété à {profileCompletion}%
									</p>
								</motion.div>


								{/* Nom + Prénom */}
								<div className="flex space-x-4 mt-4">
									{['name', 'lastname'].map((field) => (
										editable ? (
											<input
												key={field}
												type="text"
												defaultValue={user[field]}
												className="text-3xl font-bold text-center outline-none"
												onBlur={(e) => handleFieldChange(field, e.target.value)}
											/>
										) : (
											<span key={field} className="text-3xl font-bold">
												{user[field]}
											</span>
										)
									))}
								</div>

								{/* Infos complémentaires */}
								<div className="mt-8 space-y-4 text-blueGray-600 text-lg w-full max-w-md mx-auto">
									{(user.street || user.streetNumber || user.city) && (
										<div className="flex items-center">
											<FaMapMarkerAlt className="mr-3 text-blue-600" />
											<span>
												{user.streetNumber ? `${user.streetNumber} ` : ''}
												{user.street ? `${user.street}, ` : ''}
												{user.city || ''}
											</span>
										</div>
									)}
									{user.email && (
										<div className="flex items-center">
											<FaEnvelope className="mr-3 text-blue-600" />
											<span>{user.email}</span>
										</div>
									)}
									{user.role && (
										<div className="flex items-center">
											<FaBriefcase className="mr-3 text-blue-600" />
											<span>{user.role}</span>
										</div>
									)}
								</div>

								{/* BIO */}
								<div className="mt-10 px-6 text-center">
									<h3 className="text-2xl font-semibold mb-4 text-blueGray-700">Bio</h3>
									{user.bio ? (
										<>
											<p className="text-lg text-blueGray-600 leading-relaxed">
												{showFullBio ? user.bio : shortBio(user.bio)}
											</p>
											{user.bio.split(' ').length > 30 && (
												<button
													className="mt-2 text-blue-500 font-semibold"
													onClick={() => setShowFullBio(!showFullBio)}
												>
													{showFullBio ? 'Voir moins' : 'En savoir plus'}
												</button>
											)}
										</>
									) : (
										<p className="text-lg text-blueGray-400 italic">
											Vous n'avez pas encore ajouté de bio, ajoutez-en une dès maintenant pour compléter votre profil.
										</p>
									)}
								</div>

							</div>

							{/* Event stats */}
							<div className="mt-10 py-10 border-t border-blueGray-200 text-center">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-9/12 px-4">
										<div className="flex justify-around">
											<div className="text-center">
												<span className="block text-xl font-bold">{user.eventsParticipated || 0}</span>
												<span className="text-sm text-blueGray-400">Événements Participés</span>
											</div>
											<div className="text-center">
												<span className="block text-xl font-bold">{user.eventsCreated || 0}</span>
												<span className="text-sm text-blueGray-400">Événements Créés</span>
											</div>
											<div className="text-center">
												<span className="block text-xl font-bold">89</span>
												<span className="text-sm text-blueGray-400">Commentaires Postés</span>
											</div>
										</div>
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default ProfileCard;

{/* <motion.div
	className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:justify-between items-center"
	initial={{ opacity: 0, y: -20 }}
	animate={{ opacity: 1, y: 0 }}
	transition={{ duration: 0.5 }}
>
	<div className="flex flex-col items-center md:items-start">
		<div className="relative">
			{user.profileImage ? (
				<img
					src={`http://localhost:8080${user.profileImage}`}
					alt="Profile"
					className="w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover cursor-pointer"
					onClick={() =>
						editable && document.getElementById('profileImageInput').click()
					}
				/>
			) : (
				<div
					className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
					onClick={() =>
						editable && document.getElementById('profileImageInput').click()
					}
				>
					<FiUser size={48} className="text-white" />
				</div>
			)}
			{editable && (
				<div
					className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer"
					onClick={() => document.getElementById('profileImageInput').click()}
				>
					<FiEdit2 size={20} />
				</div>
			)}
			<input
				type="file"
				id="profileImageInput"
				className="hidden"
				accept="image/*"
				onChange={handleImageChange}
			/>
		</div>
		<div className="mt-4 text-center">
			<StarRating rating={user.rating || 0} />
			<div className="text-2xl font-bold mt-2">
				{user.rating !== undefined && user.rating !== null
					? user.rating.toFixed(1)
					: 'NA'}
			</div>
		</div>
	</div>

	<div className="flex-1 mt-6 md:mt-0 md:ml-12 w-full">
		<div className="space-y-6">
			{['name', 'lastname'].map((field) => (
				<div key={field} className="flex items-center border-b border-gray-300 pb-2">
					<label className="w-40 font-bold capitalize text-lg">
						{field} :
					</label>
					{editable ? (
						<input
							type="text"
							defaultValue={user[field]}
							className="flex-1 text-base sm:text-lg md:text-3xl outline-none"
							onBlur={(e) => handleFieldChange(field, e.target.value)}
						/>
					) : (
						<span className="text-base sm:text-lg md:text-3xl">{user[field]}</span>
					)}
				</div>
			))}

			{editable && (
				<div className="flex items-center border-b border-gray-300 pb-2">
					<label className="w-40 font-bold capitalize text-lg">email :</label>
					<input
						type="email"
						defaultValue={user.email}
						className="flex-1 text-base sm:text-lg md:text-2xl outline-none"
						onBlur={(e) => handleFieldChange('email', e.target.value)}
					/>
				</div>
			)}

			<div className="flex items-center border-b border-gray-300 pb-2">
				<label className="w-40 font-bold text-lg">Événements Participés :</label>
				<span className="text-base sm:text-lg md:text-2xl">{user.eventsParticipated || 0}</span>
			</div>

			<div className="flex items-center">
				<label className="w-40 font-bold text-lg">Événements <br /> Créés :</label>
				<span className="text-base sm:text-lg md:text-2xl">{user.eventsCreated || 0}</span>
			</div>
		</div>
	</div>
</motion.div> */}