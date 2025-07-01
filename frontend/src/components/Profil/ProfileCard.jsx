import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { FiUser, FiEdit2, FiX } from 'react-icons/fi';
import { FaMapMarkerAlt, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../config/authHeader';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import useSlideUpAnimation from '../../hooks/Animations/useSlideUpAnimation';
import useTextAnimation from '../../hooks/Animations/useTextAnimation';

import vector1 from "../../assets/img/et-3-event-vector.svg";
import vector2 from "../../assets/img/et-3-event-vector-2.svg";

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

const ProfileCard = ({ user, onUpdateProfileImage, onUpdateProfileField, extraSections, ratings, ratingsLoading, onClickRating }) => {
	useSlideUpAnimation();
	useTextAnimation();

	const auth = useAuth();
	const currentUser = auth?.user;
	const editable = currentUser?.id === user.id || currentUser?.role === "Administrateur";
	const profileCompletion = calculateProfileCompletion(user);
	const [showFullBio, setShowFullBio] = useState(false);
	const [editingBio, setEditingBio] = useState(false);
	const [editedBio, setEditedBio] = useState(user.bio || '');
	const [editingField, setEditingField] = useState(null);
	const [birthdateError, setBirthdateError] = useState(null);

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

	// const shortBio = (bio) => {
	// 	if (!bio) return '';
	// 	const words = bio.split(' ');
	// 	if (words.length > 30) {
	// 		return words.slice(0, 30).join(' ') + '...';
	// 	}
	// 	return bio;
	// };

	return (
		<main className="profile-page">
			<section className="relative block h-[600px]">
				<div
					className="absolute -top-[112px] pt-[112px] w-full h-full bg-center bg-cover"
					style={{
						backgroundImage: `url('${user.bannerImage
							? `http://localhost:8080${user.bannerImage}`
							: 'https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&auto=format&fit=crop&w=2710&q=80'
							}')`,
					}}
				>

					<div className="flex justify-center items-center pt-12">
						<div style={{
							backgroundImage: `linear-gradient(to top right, #580FCA, #F929BB), url(${vector1})`,
							backgroundRepeat: 'no-repeat',
							backgroundBlendMode: 'overlay',
						}}
							className="px-10 py-6 rounded-xl text-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] text-white">
							<h1 className="font-bold text-[56px] md:text-[50px] xs:text-[45px] anim-text">Profile</h1>
							<ul className="inline-flex items-center font-medium text-lg mt-2">
								<li className="opacity-80 cursor-pointer hover:text-[#C320C0] mr-2 anim-text">
									<a href="/">Home</a>
								</li>
								<li><i className="fa-solid fa-angle-right"></i></li>
								<li><i className="fa-solid fa-angle-right"></i></li>
								<li className="current-page ml-2 anim-text">Profile</li>
							</ul>
						</div>
					</div>


					{editable && (
						<div
							className="absolute bottom-[13rem] right-4 bg-white p-2 rounded-full shadow-md cursor-pointer z-10 hover:scale-105 transition-transform"
							onClick={() => document.getElementById('bannerImageInput').click()}
							title="Modifier la bannière"
						>
							<FiEdit2 size={24} className="text-pink-700" />
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
								<div className="flex w-full justify-center items-center">
									{user.profileImage ? (
										<div className=" w-4/12 px-4 order-2 flex items-center justify-center">
											<div className="relative">
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
														<FiEdit2 size={20} className="text-pink-600" />
													</div>
												)}
											</div>
										</div>
									) : (
										<div className=" w-4/12 px-4 order-2 flex items-center justify-center">
											<div className="relative">
												<div
													className="h-40 w-40 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
													onClick={() => editable && document.getElementById('profileImageInput').click()}
												>
													<FiUser size={48} className="text-white" />
												</div>
											</div>
										</div>
									)}
									<input
										type="file"
										id="profileImageInput"
										className="hidden"
										accept="image/*"
										onChange={handleImageChange}
									/>
									{user.hasReported && (
										<div className="absolute right-0 mt-8 mr-4">
											<a
												href="/report"
												className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all text-sm"
											>
												Voir vos reports
											</a>
										</div>
									)}
								</div>



								<div className="relative flex justify-center items-center mt-8 w-full gap-3">
									<img
										src={vector2}
										alt="Festif"
										className="w-20 h-20 animate__animated animate__fadeInLeft animate__slow"
									/>

									{['name', 'lastname'].map((field, index) =>
										editable ? (
											<input
												key={field}
												type="text"
												defaultValue={user[field]}
												className="text-4xl font-bold outline-none font-[Rubik Dirt] py-2 px-2 mx-1 text-center rounded bg-white border-4 border-transparent bg-clip-padding overflow-hidden resize-none"
												style={{
													width: `${user[field]?.length + 1}ch`,
													backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #580FCA, #F929BB)',
													backgroundOrigin: 'border-box',
													backgroundClip: 'padding-box, border-box'
												}}
												onBlur={(e) => handleFieldChange(field, e.target.value)}
											/>
										) : (
											<span
												key={field}
												className={`text-4xl font-[Rubik Dirt] font-bold mx-1 px-2 ${index === 0 ? 'text-[#580FCA]' : 'text-[#F929BB]'
													}`}
												style={{
													border: '4px solid transparent',
													borderRadius: '0.375rem',
													backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #580FCA, #F929BB)',
													backgroundOrigin: 'border-box',
													backgroundClip: 'padding-box, border-box'
												}}
											>
												{user[field]}
											</span>
										)
									)}

									<img
										src={vector2}
										alt="Festif"
										className="w-20 h-20 animate__animated animate__fadeInRight animate__slow"
									/>
								</div>

								<div className="w-4/12 sm:w-full px-4 mt-12">
									<div className="grid grid-cols-3 bg-gradient-to-tr from-[#580FCA] to-[#F929BB] rounded-2xl shadow-xl overflow-hidden text-white">
										<div className="flex flex-col items-center justify-center py-6 hover:bg-[#C320C0]/20 transition-all duration-300">
											<span className="text-4xl font-extrabold drop-shadow animate__animated animate__fadeIn">{user.eventsParticipated || 0}</span>
											<span className="text-xs mt-2 uppercase tracking-wide opacity-90 anim-text">Participés</span>
										</div>
										<div className="flex flex-col items-center justify-center py-6 border-l border-r border-white/30 hover:bg-[#C320C0]/20 transition-all duration-300">
											<span className="text-4xl font-extrabold drop-shadow animate__animated animate__fadeIn">{user.eventsCreated || 0}</span>
											<span className="text-xs mt-2 uppercase tracking-wide opacity-90 anim-text">Créés</span>
										</div>
										<div className="flex flex-col items-center justify-center py-6 hover:bg-[#C320C0]/20 transition-all duration-300">
											<span className="text-4xl font-extrabold drop-shadow animate__animated animate__fadeIn">{user.commentsPosted || 0}</span>
											<span className="text-xs mt-2 uppercase tracking-wide opacity-90 anim-text">Commentaires</span>
										</div>
									</div>
								</div>

								<div className="mt-[1rem] flex justify-center" onClick={onClickRating} style={{ cursor: 'pointer' }}>
									<StarRating rating={user.rating || 0} />
								</div>

								{/* Bio Section */}
								<div className="mt-10 pb-10 border-t border-[#C320C0] text-center">
									<div className="flex flex-wrap justify-center">
										<div className="w-full lg:w-9/12 px-4">
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.6 }}
												className="mt-10 px-4 sm:px-6 text-center"
											>
												<div className="inline-block mb-4 p-4 rounded-full bg-gradient-to-tr from-[#580FCA] to-[#F929BB] shadow-lg">
													<i className="fa-solid fa-feather-pointed text-white text-2xl"></i>
												</div>

												<h3 className="text-2xl sm:text-3xl font-semibold mb-4 text-[#580FCA]">Bio</h3>

												<div className="relative bg-white bg-opacity-70 border-2 border-transparent bg-clip-padding rounded-xl shadow-lg p-4 sm:p-6 max-w-full sm:max-w-2xl mx-auto"
													style={{ borderImage: 'linear-gradient(to right, #580FCA, #F929BB) 1' }}>
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
																		className="w-full h-40 sm:h-60 p-3 sm:p-4 border border-[#C320C0] rounded-lg text-base sm:text-lg font-light focus:outline-none focus:ring-2 focus:ring-[#580FCA] resize-none"
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

																	<div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
																		<button
																			onClick={() => {
																				if (editedBio.length >= 30 && editedBio.length <= 1000) {
																					handleSaveBio();
																				}
																			}}
																			disabled={editedBio.length < 30 || editedBio.length > 1000}
																			className={`w-full sm:w-auto px-6 py-2 rounded-xl transition ${editedBio.length >= 30 && editedBio.length <= 1000
																				? 'bg-gradient-to-tr from-[#580FCA] to-[#F929BB] text-white hover:opacity-90'
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
																			className="w-full sm:w-auto px-6 py-2 border border-gray-400 text-gray-700 rounded-xl hover:bg-gray-100 transition"
																		>
																			Annuler
																		</button>
																	</div>
																</motion.div>
															) : (
																<div className="relative">
																	<div className="mx-auto">
																		<motion.div
																			initial={false}
																			animate={{ height: showFullBio ? 'auto' : 120 }}
																			transition={{ duration: 0.4, ease: 'easeInOut' }}
																			className="overflow-hidden relative"
																		>
																			<p
																				className="text-base sm:text-lg text-start text-[#333] leading-relaxed whitespace-pre-wrap px-2 inline-block cursor-default w-full"
																				onClick={() => setEditingBio(true)}
																			>
																				{user.bio || (
																					<span className="italic text-gray-400">
																						Cliquez ici pour ajouter une bio à votre profil.
																					</span>
																				)}
																			</p>
																		</motion.div>
																		{user.bio && user.bio.split(' ').length > 30 && (
																			<button
																				className="mt-2 text-sm text-[#580FCA] font-medium"
																				onClick={() => setShowFullBio(!showFullBio)}
																			>
																				{showFullBio ? 'Voir moins' : 'Voir plus'}
																			</button>
																		)}

																		<motion.div
																			whileHover={{ scale: 1.05 }}
																			className="absolute -top-14 right-2 cursor-pointer"
																			onClick={() => setEditingBio(true)}
																		>
																			<span className="text-sm text-[#580FCA] italic">Modifier</span>
																		</motion.div>
																	</div>
																</div>
															)}
														</div>
													) : (
														<div className="mx-auto">
															<motion.div
																initial={false}
																animate={{ height: showFullBio ? 'auto' : 120 }}
																transition={{ duration: 0.4, ease: 'easeInOut' }}
																className="overflow-hidden relative"
															>
																<p
																	className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap px-2 inline-block w-full text-[#333] ${user.bio ? 'text-start' : 'text-center'
																		}`}
																>
																	{user.bio || (
																		<span className="italic text-gray-400">
																			Cet utilisateur n’a pas encore ajouté de bio.
																		</span>
																	)}
																</p>
															</motion.div>
															{user.bio && user.bio.split(' ').length > 30 && (
																<button
																	className="mt-2 text-sm text-[#580FCA] font-medium"
																	onClick={() => setShowFullBio(!showFullBio)}
																>
																	{showFullBio ? 'Voir moins' : 'Voir plus'}
																</button>
															)}
														</div>
													)}
												</div>
											</motion.div>
										</div>
									</div>
								</div>

								{/* Profile Champs */}
								<div className="mt-12 space-y-4 text-xl w-full max-w-md mx-auto text-[#333]">

									{/* GENDER */}
									<div className="flex items-center border-2 border-[#C320C0] rounded-md shadow-md overflow-hidden">
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#580FCA] to-[#F929BB]">
											<i className="fa-solid fa-venus-mars text-white text-xl"></i>
										</div>
										{editable && editingField === 'gender' ? (
											<select
												className="w-full h-12 px-4 py-1 bg-white text-[#580FCA] font-medium focus:outline-none"
												defaultValue={user.gender || ''}
												onBlur={(e) => {
													handleFieldChange('gender', e.target.value);
													setEditingField(null);
												}}
											>
												<option value="">Sélectionnez votre genre</option>
												<option value="Homme">Homme</option>
												<option value="Femme">Femme</option>
												<option value="Autre">Autre</option>
												<option value="Préféré ne pas dire">Préféré ne pas dire</option>
											</select>
										) : (
											<span onClick={() => editable && setEditingField('gender')} className={`${editable ? "cursor-pointer" : ""} text-[#580FCA] font-medium px-4`}>
												{user.gender || "Genre non spécifié"}
											</span>
										)}
										{editable && editingField !== 'gender' && (
											<button onClick={() => setEditingField('gender')} className="px-3 text-gray-500 hover:text-[#580FCA]">🖊️</button>
										)}
									</div>

									{/* EMAIL */}
									<div className="flex items-center border-2 border-[#C320C0] rounded-md shadow-md overflow-hidden">
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#580FCA] to-[#F929BB]">
											<i className="fa-solid fa-envelope text-white text-xl"></i>
										</div>
										{editingField === 'email' && editable ? (
											<input
												type="email"
												defaultValue={user.email || ''}
												placeholder="Votre email"
												className="w-full h-12 px-4 py-1 bg-white text-[#580FCA] font-medium focus:outline-none"
												onBlur={(e) => {
													handleFieldChange('email', e.target.value);
													setEditingField(null);
												}}
											/>
										) : (
											<span onClick={() => editable && setEditingField('email')} className={`${editable ? "cursor-pointer" : ""} text-[#580FCA] font-medium px-4`}>
												{user.email || <span className="italic text-gray-400">Aucune adresse email</span>}
											</span>
										)}
										{editable && (
											<button
												onClick={() => handleFieldChange('showEmail', !user.showEmail)}
												className="px-3 text-gray-500 hover:text-[#580FCA]"
												title={user.showEmail ? "Cacher l'email" : "Afficher l'email"}
											>
												{user.showEmail ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
											</button>
										)}
									</div>

									{/* PHONE */}
									<div className="flex items-center border-2 border-[#C320C0] rounded-md shadow-md overflow-hidden">
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#580FCA] to-[#F929BB]">
											<i className="fa-solid fa-phone text-white text-xl"></i>
										</div>
										{editingField === 'phone' && editable ? (
											<input
												type="text"
												defaultValue={user.phone || ''}
												placeholder="Votre téléphone"
												className="w-full h-12 px-4 py-1 bg-white text-[#580FCA] font-medium focus:outline-none"
												onBlur={(e) => {
													handleFieldChange('phone', e.target.value);
													setEditingField(null);
												}}
											/>
										) : (
											<span onClick={() => editable && setEditingField('phone')} className={`${editable ? "cursor-pointer" : ""} text-[#580FCA] font-medium px-4`}>
												{user.phone || <span className="italic text-gray-400">Aucun numéro de téléphone</span>}
											</span>
										)}
										{editable && (
											<button
												onClick={() => handleFieldChange('showPhone', !user.showPhone)}
												className="px-3 text-gray-500 hover:text-[#580FCA]"
												title={user.showPhone ? "Cacher le téléphone" : "Afficher le téléphone"}
											>
												{user.showPhone ? <i className="fa-regular fa-eye"></i> : <i className="fa-regular fa-eye-slash"></i>}
											</button>
										)}
									</div>

									{/* BIRTHDAY */}
									<div className="flex items-center border-2 border-[#C320C0] rounded-md shadow-md overflow-hidden">
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#580FCA] to-[#F929BB]">
											<i className="fa-solid fa-cake-candles text-white text-xl"></i>
										</div>
										{editingField === 'birthdate' && editable ? (
											<input
												type="date"
												defaultValue={user.birthdate || ''}
												className="w-full h-12 px-4 py-1 bg-white text-[#580FCA] font-medium focus:outline-none"
												onBlur={(e) => {
													handleFieldChange('birthdate', e.target.value);
													setEditingField(null);
												}}
											/>
										) : user.birthdate ? (
											<span onClick={() => editable && setEditingField('birthdate')} className={`${editable ? "cursor-pointer" : ""} text-[#580FCA] font-medium px-4`}>
												{new Date(user.birthdate).toLocaleDateString('fr-FR')}
											</span>
										) : (
											<span className="italic text-gray-400 px-4">Aucune date de naissance</span>
										)}
										{editable && editingField !== 'birthdate' && (
											<button onClick={() => setEditingField('birthdate')} className="px-3 text-gray-500 hover:text-[#580FCA]">🖊️</button>
										)}
									</div>

									{/* LINKEDIN */}
									<div className="flex items-center border-2 border-[#C320C0] rounded-md shadow-md overflow-hidden">
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#580FCA] to-[#F929BB]">
											<i className="fa-brands fa-linkedin text-white text-xl"></i>
										</div>
										{editingField === 'linkedinUrl' && editable ? (
											<input
												type="text"
												defaultValue={user.linkedinUrl || ''}
												placeholder="Lien LinkedIn"
												className="w-full h-12 px-4 py-1 bg-white text-[#580FCA] font-medium focus:outline-none"
												onBlur={(e) => {
													handleFieldChange('linkedinUrl', e.target.value.trim());
													setEditingField(null);
												}}
											/>
										) : user.linkedinUrl ? (
											<a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#580FCA] underline font-medium px-4">
												LinkedIn
											</a>
										) : (
											<span className="italic text-gray-400 px-4">Aucun LinkedIn</span>
										)}
										{editable && editingField !== 'linkedinUrl' && (
											<button onClick={() => setEditingField('linkedinUrl')} className="px-3 text-gray-500 hover:text-[#580FCA]">🖊️</button>
										)}
									</div>

									{/* INSTAGRAM */}
									<div className="flex items-center border-2 border-[#C320C0] rounded-md shadow-md overflow-hidden">
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#580FCA] to-[#F929BB]">
											<i className="fa-brands fa-instagram text-white text-xl"></i>
										</div>
										{editingField === 'instaUrl' && editable ? (
											<input
												type="text"
												defaultValue={user.instaUrl || ''}
												placeholder="Lien Instagram"
												className="w-full h-12 px-4 py-1 bg-white text-[#580FCA] font-medium focus:outline-none"
												onBlur={(e) => {
													handleFieldChange('instaUrl', e.target.value.trim());
													setEditingField(null);
												}}
											/>
										) : user.instaUrl ? (
											<a href={user.instaUrl} target="_blank" rel="noreferrer" className="text-[#F929BB] underline font-medium px-4">
												Instagram
											</a>
										) : (
											<span className="italic text-gray-400 px-4">Aucun Instagram</span>
										)}
										{editable && editingField !== 'instaUrl' && (
											<button onClick={() => setEditingField('instaUrl')} className="px-3 text-gray-500 hover:text-[#F929BB]">🖊️</button>
										)}
									</div>

									{/* WEBSITE */}
									<div className="flex items-center border-2 border-[#C320C0] rounded-md shadow-md overflow-hidden">
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#580FCA] to-[#F929BB]">
											<i className="fa-solid fa-globe text-white text-xl"></i>
										</div>
										{editingField === 'websiteUrl' && editable ? (
											<input
												type="text"
												defaultValue={user.websiteUrl || ''}
												placeholder="Lien Site Web"
												className="w-full h-12 px-4 py-1 bg-white text-[#580FCA] font-medium focus:outline-none"
												onBlur={(e) => {
													handleFieldChange('websiteUrl', e.target.value.trim());
													setEditingField(null);
												}}
											/>
										) : user.websiteUrl ? (
											<a href={user.websiteUrl} target="_blank" rel="noreferrer" className="text-[#580FCA] underline font-medium px-4">
												Site Web
											</a>
										) : (
											<span className="italic text-gray-400 px-4">Aucun site web</span>
										)}
										{editable && editingField !== 'websiteUrl' && (
											<button onClick={() => setEditingField('websiteUrl')} className="px-3 text-gray-500 hover:text-[#580FCA]">🖊️</button>
										)}
									</div>

								</div>

								{/* Profile Completion Bar */}
								{editable && (
									<>
										<motion.div
											className="w-full max-w-md mt-6"
											initial={{ width: firstVisit ? 0 : `${profileCompletion}%` }}
											animate={{ width: `${profileCompletion}%` }}
											transition={
												firstVisit
													? { type: "spring", stiffness: 120, damping: 16, duration: 1.2 }
													: { duration: 0 }
											}
										>
											<div className="h-5 rounded-full overflow-hidden bg-gradient-to-tr from-[#580FCA]/30 to-[#F929BB]/30 shadow-inner">
												<motion.div
													className="h-full rounded-full"
													style={{
														background: `linear-gradient(to right, ${profileCompletion < 50
															? '#f87171'
															: profileCompletion < 80
																? '#fbbf24'
																: '#34d399'
															}, ${profileCompletion < 50
																? '#fb7185'
																: profileCompletion < 80
																	? '#facc15'
																	: '#10b981'
															})`,
													}}
													initial={{ width: firstVisit ? 0 : `${profileCompletion}%` }}
													animate={{ width: `${profileCompletion}%` }}
													transition={
														firstVisit
															? { type: "spring", stiffness: 120, damping: 16 }
															: { duration: 0 }
													}
												/>
											</div>
											<motion.p
												className="text-center text-sm mt-2 font-medium bg-gradient-to-r from-[#580FCA] to-[#F929BB] text-transparent bg-clip-text animate__animated animate__fadeIn"
												initial={{ opacity: firstVisit ? 0 : 1 }}
												animate={{ opacity: 1 }}
												transition={{ delay: firstVisit ? 0.5 : 0 }}
											>
												Profil complété à {profileCompletion}%
											</motion.p>
										</motion.div>

										<div className="mt-6 w-full max-w-md mx-auto">
											<AnimatePresence>
												{animatedSteps.map((step) => (
													<motion.div
														key={step.label}
														initial={{ opacity: 0, x: 50 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: -50, scale: 0.8 }}
														transition={{ duration: 0.5 }}
														className="flex justify-between items-center bg-gradient-to-r from-[#580FCA]/20 to-[#F929BB]/20 text-[#580FCA] p-4 rounded-xl mb-3 shadow-md backdrop-blur-sm"
													>
														<span className="font-semibold">{step.label}</span>
														<motion.div
															whileTap={{ scale: 0.9, rotate: 20 }}
															onClick={() => handleCheckAndRemove(step.label)}
															className="cursor-pointer text-[#F929BB] hover:text-[#C320C0] transition-colors duration-300"
														>
															<FiX size={20} />
														</motion.div>
													</motion.div>
												))}
											</AnimatePresence>
										</div>
									</>
								)}

								<div className="*:-z-[1] *:absolute">
									<h3 className="xl:hidden top-[420px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">Event</h3>
									<div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
									<div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
									<img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
									<img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
									<img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
									<img src={vector2} alt="vector" className="top-[1033px] -left-[175px] animate-[etSpin_7s_linear_infinite]" />
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

				<div className="*:-z-[1] *:absolute">
					<h3 className="xl:hidden top-[420px] left-[68px] xxl:left-[8px] et-outlined-text h-max font-bold text-[65px] uppercase tracking-widest -scale-[1] anim-text et-vertical-txt">Event</h3>
					<div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
					<div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
					<img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
					<img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
					<img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
					<img src={vector2} alt="vector" className="top-[1033px] -left-[175px] animate-[etSpin_7s_linear_infinite]" />
				</div>
			</section>
		</main>
	);
};

export default ProfileCard;