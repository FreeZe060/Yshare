import React, { useState, useEffect } from 'react';
import StarRating from '../StarRating';
import { FiUser, FiEdit2, FiX } from 'react-icons/fi';
import { FaMapMarkerAlt, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../config/authHeader';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const calculateProfileCompletion = (user) => {
	let score = 0;
	if (user.profileImage) score += 10;
	if (user.bannerImage) score += 10;
	if (user.name && user.lastname) score += 10;
	if (user.email) score += 10;
	if (user.street || user.streetNumber || user.city) score += 10;
	if (user.bio) score += 20;
	if (user.eventsCreated && user.eventsCreated > 0) score += 10;
	if (user.eventsParticipated && user.eventsParticipated > 0) score += 10;
	if (user.commentsPosted && user.commentsPosted > 0) score += 10;
	return score;
};

const ProfileCard = ({ user, onUpdateProfileImage, onUpdateProfileField, extraSections }) => {
	const auth = useAuth();
	const currentUser = auth?.user;
	const isAdmin = auth?.isAdmin;
	const editable = currentUser?.id === user.id || isAdmin;
	const profileCompletion = calculateProfileCompletion(user);
	const [showFullBio, setShowFullBio] = useState(false);
	const [editingBio, setEditingBio] = useState(false);
	const [editedBio, setEditedBio] = useState(user.bio || '');

	const handleSaveBio = () => {
		if (onUpdateProfileField) {
			onUpdateProfileField('bio', editedBio);
			setEditingBio(false);
		}
	};

	useEffect(() => {
		setEditedBio(user.bio || '');
	}, [user.bio]);

	const [animatedSteps, setAnimatedSteps] = useState([]);
	const [firstVisit, setFirstVisit] = useState(false);

	useEffect(() => {
		const steps = [
			{ label: "Ajoutez une photo de profil", done: !!user.profileImage },
			{ label: "Ajoutez une image de bannière", done: !!user.bannerImage },
			{ label: "Complétez votre prénom et nom", done: !!(user.name && user.lastname) },
			{ label: "Ajoutez votre email", done: !!user.email },
			{ label: "Ajoutez votre adresse", done: !!(user.street || user.city) },
			{ label: "Ajoutez une biographie", done: !!user.bio },
			{ label: "Créez un événement", done: !!(user.eventsCreated && user.eventsCreated > 0) },
			{ label: "Participez à un événement", done: !!(user.eventsParticipated && user.eventsParticipated > 0) },
			{ label: "Postez votre premier commentaire", done: !!(user.commentsPosted && user.commentsPosted > 0) }
		].filter(step => !step.done);

		setAnimatedSteps(steps);
	}, [user]);

	useEffect(() => {
		const alreadyVisited = localStorage.getItem('profileFirstVisit');
		if (!alreadyVisited) {
			setFirstVisit(true);
			localStorage.setItem('profileFirstVisit', 'true');
		}
	}, []);

	useEffect(() => {
		const alreadyCelebrated = localStorage.getItem('profileConfettiDone');
		if (profileCompletion === 100 && !alreadyCelebrated) {
			confetti({
				particleCount: 150,
				spread: 70,
				origin: { y: 0.6 },
			});
			localStorage.setItem('profileConfettiDone', 'true');
		}
	}, [profileCompletion]);

	const handleCheckAndRemove = (label) => {
		setAnimatedSteps((prev) => prev.filter((s) => s.label !== label));
	};

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
					<div className="container mx-auto max-w-[1200px] px-[12px] xl:max-w-full text-center text-white pt-12">
						<h1 className="font-bold text-[56px] md:text-[50px] xs:text-[45px]">Profile</h1>
						<ul className="inline-flex items-center font-medium text-lg mt-2">
							<li className="opacity-80 cursor-pointer hover:text-blue-400 mr-2">
								<a href="/">Home</a>
							</li>
							<li><i className="fa-solid fa-angle-right"></i></li>
							<li><i className="fa-solid fa-angle-right"></i></li>
							<li className="current-page ml-2">Profile</li>
						</ul>
					</div>

					{editable && (
						<div
							className="absolute bottom-[13rem] right-4 bg-white p-2 rounded-full shadow-md cursor-pointer z-10 hover:scale-105 transition-transform"
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

			<section className="relative py-16 bg-blueGray-200">
				<div className="container mx-auto px-4">
					<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
						<div className="px-6">
							<div className="flex flex-col items-center -mt-20 relative">
								<div className="flex w-full justify-start items-center">
									{user.profileImage ? (
										<div class=" w-4/12 px-4 order-2 flex items-center justify-center">
											<div class="relative">
												<img
													src={`http://localhost:8080${user.profileImage}`}
													alt="Profile"
													className="shadow-xl rounded-full h-40 w-40 object-cover border-4 border-white"
													onClick={() => editable && document.getElementById('profileImageInput').click()}
												/>
												{editable && (
													<div
														className="absolute top-[15px] right-0 bg-white rounded-full p-2 shadow-md cursor-pointer z-10 hover:scale-110 transition"
														onClick={() => document.getElementById('profileImageInput').click()}
														title="Modifier la photo de profil"
													>
														<FiEdit2 size={20} className="text-blue-600" />
													</div>
												)}
											</div>
										</div>
									) : (
										<div
											className="h-40 w-40 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
											onClick={() => editable && document.getElementById('profileImageInput').click()}
										>
											<FiUser size={48} className="text-white" />
										</div>
									)}
									<input
										type="file"
										id="profileImageInput"
										className="hidden"
										accept="image/*"
										onChange={handleImageChange}
									/>

									<div class="w-4/12 px-4 order-1 mt-12">
										<div class="flex py-4 lg:pt-4 pt-8">
											<div className="mr-4 p-3 text-center">
												<span className="font-bold block text-xl">{user.eventsParticipated || 0}</span>
												<span className="text-sm">événements participés</span>
											</div>
											<div className="mr-4 p-3 text-center">
												<span className="font-bold block text-xl">{user.eventsCreated || 0}</span>
												<span className="text-sm">événements créés</span>
											</div>
											<div className="mr-4 p-3 text-center">
												<span className="font-bold block text-xl">{user.commentsPosted || 0}</span>
												<span className="text-sm">commentaires postés</span>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-[1rem]">
									<StarRating rating={user.rating || 0} />
								</div>

								{editable && (
									<>
										<motion.div
											className="w-full max-w-md mt-4"
											initial={{ width: firstVisit ? 0 : `${profileCompletion}%` }}
											animate={{ width: `${profileCompletion}%` }}
											transition={firstVisit ? {
												type: "spring",
												stiffness: 120,
												damping: 16,
												duration: 1.2,
											} : { duration: 0 }}
										>
											<div className="h-4 bg-gray-300 rounded-full overflow-hidden">
												<motion.div
													className="h-full rounded-full"
													style={{
														background: profileCompletion < 50
															? '#f87171'
															: profileCompletion < 80
																? '#fbbf24'
																: '#34d399',
													}}
													initial={{ width: firstVisit ? 0 : `${profileCompletion}%` }}
													animate={{ width: `${profileCompletion}%` }}
													transition={firstVisit ? {
														type: "spring",
														stiffness: 120,
														damping: 16,
													} : { duration: 0 }}
												/>
											</div>
											<motion.p
												className="text-center text-sm mt-2 text-blueGray-600 font-medium"
												initial={{ opacity: firstVisit ? 0 : 1 }}
												animate={{ opacity: 1 }}
												transition={{ delay: firstVisit ? 0.5 : 0 }}
											>
												Profil complété à {profileCompletion}%
											</motion.p>
										</motion.div>

										<div className="mt-4 w-full max-w-md mx-auto">
											<AnimatePresence>
												{animatedSteps.map((step) => (
													<motion.div
														key={step.label}
														initial={{ opacity: 0, x: 50 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: -50, scale: 0.8 }}
														transition={{ duration: 0.5 }}
														className="flex justify-between items-center bg-blue-100 text-blue-800 p-3 rounded-lg mb-2 shadow-sm"
													>
														<span>{step.label}</span>
														<motion.div
															whileTap={{ scale: 0.9, rotate: 20 }}
															onClick={() => handleCheckAndRemove(step.label)}
															className="cursor-pointer"
														>
															<FiX />
														</motion.div>
													</motion.div>
												))}
											</AnimatePresence>
										</div>
									</>
								)}

								<div className="flex justify-center mt-8 w-full">
									{['name', 'lastname'].map((field) =>
										editable ? (
											<input
												type="text"
												defaultValue={user[field]}
												className="text-4xl font-serif font-bold outline-none px-0 w-fit"
												onBlur={(e) => handleFieldChange(field, e.target.value)}
												style={{ width: `${user[field]?.length + 1}ch` }}
											/>

										) : (
											<span key={field} className="text-4xl font-bold font-serif">
												{user[field]}
											</span>
										)
									)}
								</div>

								<div className="mt-12 space-y-4 text-blueGray-600 text-xl w-full max-w-md mx-auto">
									{(user.street || user.streetNumber || user.city) && (
										<div className="flex items-center">
											<FaMapMarkerAlt className="mr-4 text-blue-600 text-2xl" />
											<span>
												{user.streetNumber ? `${user.streetNumber} ` : ''}
												{user.street ? `${user.street}, ` : ''}
												{user.city || ''}
											</span>
										</div>
									)}
									{user.email && (
										<div className="flex items-center">
											<FaEnvelope className="mr-4 text-blue-600 text-2xl" />
											<span>{user.email}</span>
										</div>
									)}
									{user.role && (
										<div className="flex items-center">
											<FaBriefcase className="mr-4 text-blue-600 text-2xl" />
											<span>{user.role}</span>
										</div>
									)}
									{user.status && (
										<div className="flex items-center">
											<FaBriefcase className="mr-4 text-blue-600 text-2xl" />
											<span>Votre status : {user.status}</span>
										</div>
									)}
								</div>
							</div>

							<div className="mt-10 pb-[2.5rem] border-t border-blueGray-200 text-center">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-9/12 px-4">
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.5 }}
											className="mt-10 px-6 text-center"
										>
											<h3 className="text-3xl font-semibold mb-4 text-blueGray-700">Bio</h3>

											{editable ? (
												<div className="relative">
													{editingBio ? (
														<motion.div
															initial={{ opacity: 0, y: -10 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.3 }}
															className="flex flex-col items-center"
														>
															<textarea
																value={editedBio}
																onChange={(e) => setEditedBio(e.target.value)}
																className="w-full max-w-2xl h-60 p-6 border border-blue-300 rounded-lg text-xl font-light focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
															/>

															<div className="mt-2 text-sm">
																<span className={`font-medium ${editedBio.length < 30 || editedBio.length > 1000 ? 'text-red-500' : 'text-green-600'}`}>
																	{editedBio.length} / 1000 caractères
																</span>
																{editedBio.length < 30 && (
																	<p className="text-red-500 text-sm mt-1">Minimum 30 caractères requis</p>
																)}
																{editedBio.length > 1000 && (
																	<p className="text-red-500 text-sm mt-1">Maximum 1000 caractères autorisés</p>
																)}
															</div>

															<div className="mt-4 flex gap-4">
																<button
																	onClick={() => {
																		if (editedBio.length >= 30 && editedBio.length <= 1000) {
																			handleSaveBio();
																		}
																	}}
																	disabled={editedBio.length < 30 || editedBio.length > 1000}
																	className={`px-6 py-2 rounded-xl transition ${editedBio.length >= 30 && editedBio.length <= 1000
																		? 'bg-blue-600 text-white hover:bg-blue-700'
																		: 'bg-gray-300 text-gray-500 cursor-not-allowed'
																		}`}
																>
																	Enregistrer
																</button>
																<button
																	onClick={() => {
																		setEditingBio(false);
																		setEditedBio(user.bio || '');
																	}}
																	className="px-6 py-2 border border-gray-400 text-gray-700 rounded-xl hover:bg-gray-100 transition"
																>
																	Annuler
																</button>
															</div>
														</motion.div>
													) : (
														<div className="relative">
															<div className="mx-auto max-w-xl">
																<motion.div
																	initial={false}
																	animate={{ height: showFullBio ? 'auto' : 120 }}
																	transition={{ duration: 0.4, ease: 'easeInOut' }}
																	className="overflow-hidden relative"
																>
																	<p
																		className="text-lg text-start text-blueGray-600 leading-relaxed whitespace-pre-wrap px-2 inline-block cursor-default w-full"
																		onClick={() => setEditingBio(true)}
																	>
																		{user.bio || (
																			<span className="italic text-blueGray-400">
																				Cliquez ici pour ajouter une bio à votre profil.
																			</span>
																		)}
																	</p>
																</motion.div>
																{user.bio && user.bio.split(' ').length > 30 && (
																	<button
																		className="mt-2 text-sm text-blue-500 font-medium"
																		onClick={() => setShowFullBio(!showFullBio)}
																	>
																		{showFullBio ? 'Voir moins' : 'Voir plus'}
																	</button>
																)}

																<motion.div
																	whileHover={{ scale: 1.05 }}
																	className="absolute top-0 right-0 cursor-pointer"
																	onClick={() => setEditingBio(true)}
																>
																	<span className="text-sm text-blue-500 italic">Modifier</span>
																</motion.div>
															</div>
														</div>
													)}
												</div>
											) : (
												<div className="mx-auto max-w-xl">
													<motion.div
														initial={false}
														animate={{ height: showFullBio ? 'auto' : 120 }}
														transition={{ duration: 0.4, ease: 'easeInOut' }}
														className="overflow-hidden relative"
													>
														<p className="text-lg text-start text-blueGray-600 leading-relaxed whitespace-pre-wrap px-2 inline-block w-full">
															{user.bio || (
																<span className="italic text-blueGray-400">
																	Cet utilisateur n’a pas encore ajouté de bio.
																</span>
															)}
														</p>
													</motion.div>
													{user.bio && user.bio.split(' ').length > 30 && (
														<button
															className="mt-2 text-sm text-blue-500 font-medium"
															onClick={() => setShowFullBio(!showFullBio)}
														>
															{showFullBio ? 'Voir moins' : 'Voir plus'}
														</button>
													)}
												</div>
											)}
										</motion.div>
									</div>
								</div>
							</div>

							<div className="mt-10 pb-[2.5rem] border-t border-blueGray-200 text-center">
								<div className="mt-10 space-y-10">
									{extraSections}
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