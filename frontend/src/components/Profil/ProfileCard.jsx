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

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';

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
		<main className="profile-page overflow-hidden">
			<section className="block relative h-[600px]">
				<div
					className="-top-[112px] absolute bg-cover bg-center pt-[112px] w-full h-full"
					style={{
						backgroundImage: `url('${user.bannerImage
							? `${REACT_APP_API_BASE_URL}${user.bannerImage}`
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
							className="bg-gradient-to-tr from-[#580FCA] to-[#F929BB] px-10 py-6 rounded-xl text-white text-center">
							<h1 className="font-bold text-[56px] xs:text-[45px] md:text-[50px] anim-text">Profile</h1>
							<ul className="inline-flex items-center mt-2 font-medium text-lg">
								<li className="opacity-80 mr-2 hover:text-[#C320C0] cursor-pointer anim-text">
									<a href="/">Home</a>
								</li>
								<li><i className="fa-angle-right fa-solid"></i></li>
								<li><i className="fa-angle-right fa-solid"></i></li>
								<li className="ml-2 current-page anim-text">Profile</li>
							</ul>
						</div>
					</div>


					{editable && (
						<div
							className="right-4 bottom-[13rem] z-10 absolute bg-white shadow-md p-2 rounded-full hover:scale-105 transition-transform cursor-pointer"
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

			<section className="relative bg-blueGray-200 py-16">
				<div className="mx-auto px-4 container">
					<div className="relative flex flex-col bg-white -mt-64 mb-6 rounded-lg w-full min-w-0 break-words">
						<div className="z-[1] relative">
							<div className="relative flex flex-col items-center -mt-20">
								<div className="flex justify-center items-center w-full">
									{user.profileImage ? (
										<div className="flex justify-center items-center order-2 px-4 w-4/12">
											<div className="relative">
												<img
													src={`${REACT_APP_API_BASE_URL}${user.profileImage}`}
													alt="Profile"
													className="shadow-xl border-4 border-white rounded-full w-40 h-40 object-cover"
													onClick={() => editable && document.getElementById('profileImageInput').click()}
												/>
												{editable && (
													<div
														className="top-[15px] right-0 z-10 absolute bg-white shadow-md p-2 rounded-full hover:scale-110 transition cursor-pointer"
														onClick={() => document.getElementById('profileImageInput').click()}
														title="Modifier la photo de profil"
													>
														<FiEdit2 size={20} className="text-pink-600" />
													</div>
												)}
											</div>
										</div>
									) : (
										<div className="flex justify-center items-center order-2 px-4 w-4/12">
											<div className="relative">
												<div
													className="flex justify-center items-center bg-gray-300 rounded-full w-40 h-40 cursor-pointer"
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
										<div className="right-0 absolute mt-8 mr-4 flex flex-col space-y-2">
											<a
												href="/report"
												className="bg-[#C72EBF] hover:bg-[#BA28C0] shadow px-4 py-2 rounded-lg text-white text-sm transition-all text-center"
											>
												Voir vos reports
											</a>

											{user.ratingsCount > 1 && ( 
												<a
													href="/ratings"
													className="bg-purple-600 hover:bg-purple-700 shadow px-4 py-2 rounded-lg text-white text-sm transition-all text-center"
												>
													Vos notes créées
												</a>
											)}
										</div>
									)}

								</div>

								<div className="relative flex justify-center items-center gap-3 mt-8 w-full">
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
												className="bg-white bg-clip-padding mx-1 px-2 py-2 border-4 border-transparent rounded outline-none overflow-hidden font-[Rubik font-bold text-4xl text-center resize-none Dirt]"
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

								<div className="mt-12 px-4 w-4/12 sm:w-full">
									<div className="grid grid-cols-3 bg-gradient-to-tr from-[#580FCA] to-[#F929BB] shadow-xl rounded-2xl overflow-hidden text-white">
										<div className="flex flex-col justify-center items-center hover:bg-[#C320C0]/20 py-6 transition-all duration-300">
											<span className="drop-shadow font-extrabold text-4xl animate__animated animate__fadeIn">{user.eventsParticipated || 0}</span>
											<span className="opacity-90 mt-2 text-xs uppercase tracking-wide anim-text">Participés</span>
										</div>
										<div className="flex flex-col justify-center items-center hover:bg-[#C320C0]/20 py-6 border-white/30 border-r border-l transition-all duration-300">
											<span className="drop-shadow font-extrabold text-4xl animate__animated animate__fadeIn">{user.eventsCreated || 0}</span>
											<span className="opacity-90 mt-2 text-xs uppercase tracking-wide anim-text">Créés</span>
										</div>
										<div className="flex flex-col justify-center items-center hover:bg-[#C320C0]/20 py-6 transition-all duration-300">
											<span className="drop-shadow font-extrabold text-4xl animate__animated animate__fadeIn">{user.commentsPosted || 0}</span>
											<span className="opacity-90 mt-2 text-xs uppercase tracking-wide anim-text">Commentaires</span>
										</div>
									</div>
								</div>

								<div className="flex justify-center mt-[1rem]" onClick={onClickRating} style={{ cursor: 'pointer' }}>
									<StarRating rating={user.rating || 0} />
								</div>

								<div className="mt-10 pb-10 border-[#C320C0] border-t text-center">
									<div className="flex flex-wrap justify-center">
										<div className="px-4 w-full lg:w-9/12">
											<motion.div
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ duration: 0.6 }}
												className="mt-10 px-4 sm:px-6 text-center"
											>
												<div className="inline-block bg-gradient-to-tr from-[#580FCA] to-[#F929BB] shadow-lg mb-4 p-4 rounded-full">
													<i className="text-white text-2xl fa-solid fa-feather-pointed"></i>
												</div>

												<h3 className="mb-4 font-semibold text-[#580FCA] text-2xl sm:text-3xl">Bio</h3>

												<div className="relative bg-white bg-clip-padding bg-opacity-70 shadow-lg mx-auto p-4 sm:p-6 border-2 border-transparent rounded-xl max-w-full sm:max-w-2xl"
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
																		className="p-3 sm:p-4 border border-[#C320C0] rounded-lg focus:outline-none focus:ring-[#580FCA] focus:ring-2 w-full h-40 sm:h-60 font-light text-base sm:text-lg resize-none"
																	/>

																	<div className="mt-2 text-sm">
																		<span className={`font-medium ${editedBio.length < 30 || editedBio.length > 1000 ? 'text-red-500' : 'text-green-600'}`}>
																			{editedBio.length} / 1000 caractères
																		</span>
																		{editedBio.length < 30 && (
																			<p className="mt-1 text-red-500 text-sm">Minimum 30 caractères requis</p>
																		)}
																		{editedBio.length > 1000 && (
																			<p className="mt-1 text-red-500 text-sm">Maximum 1000 caractères autorisés</p>
																		)}
																	</div>

																	<div className="flex sm:flex-row flex-col gap-2 sm:gap-4 mt-4 w-full sm:w-auto">
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
																			className="hover:bg-gray-100 px-6 py-2 border border-gray-400 rounded-xl w-full sm:w-auto text-gray-700 transition"
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
																			className="relative overflow-hidden"
																		>
																			<p
																				className="inline-block px-2 w-full text-[#333] text-base sm:text-lg text-start leading-relaxed whitespace-pre-wrap cursor-default"
																				onClick={() => setEditingBio(true)}
																			>
																				{user.bio || (
																					<span className="text-gray-400 italic">
																						Cliquez ici pour ajouter une bio à votre profil.
																					</span>
																				)}
																			</p>
																		</motion.div>
																		{user.bio && user.bio.split(' ').length > 30 && (
																			<button
																				className="mt-2 font-medium text-[#580FCA] text-sm"
																				onClick={() => setShowFullBio(!showFullBio)}
																			>
																				{showFullBio ? 'Voir moins' : 'Voir plus'}
																			</button>
																		)}

																		<motion.div
																			whileHover={{ scale: 1.05 }}
																			className="-top-14 right-2 absolute cursor-pointer"
																			onClick={() => setEditingBio(true)}
																		>
																			<span className="text-[#580FCA] text-sm italic">Modifier</span>
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
																className="relative overflow-hidden"
															>
																<p
																	className={`text-base sm:text-lg leading-relaxed whitespace-pre-wrap px-2 inline-block w-full text-[#333] ${user.bio ? 'text-start' : 'text-center'
																		}`}
																>
																	{user.bio || (
																		<span className="text-gray-400 italic">
																			Cet utilisateur n’a pas encore ajouté de bio.
																		</span>
																	)}
																</p>
															</motion.div>
															{user.bio && user.bio.split(' ').length > 30 && (
																<button
																	className="mt-2 font-medium text-[#580FCA] text-sm"
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

								<div className="space-y-4 mx-auto mt-12 w-full max-w-md text-[#333] text-xl">

									<div className="flex items-center shadow-md border-[#C320C0] border-2 rounded-md overflow-hidden">
										<div className="flex justify-center items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] w-12 h-12">
											<i className="text-white text-xl fa-solid fa-venus-mars"></i>
										</div>
										{editable && editingField === 'gender' ? (
											<select
												className="bg-white px-4 py-1 focus:outline-none w-full h-12 font-medium text-[#580FCA]"
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

									<div className="flex items-center shadow-md border-[#C320C0] border-2 rounded-md overflow-hidden">
										<div className="flex justify-center items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] w-12 h-12">
											<i className="text-white text-xl fa-solid fa-envelope"></i>
										</div>
										{editingField === 'email' && editable ? (
											<input
												type="email"
												defaultValue={user.email || ''}
												placeholder="Votre email"
												className="bg-white px-4 py-1 focus:outline-none w-full h-12 font-medium text-[#580FCA]"
												onBlur={(e) => {
													handleFieldChange('email', e.target.value);
													setEditingField(null);
												}}
											/>
										) : (
											<span onClick={() => editable && setEditingField('email')} className={`${editable ? "cursor-pointer" : ""} text-[#580FCA] font-medium px-4`}>
												{user.email || <span className="text-gray-400 italic">Aucune adresse email</span>}
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

									<div className="flex items-center shadow-md border-[#C320C0] border-2 rounded-md overflow-hidden">
										<div className="flex justify-center items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] w-12 h-12">
											<i className="text-white text-xl fa-solid fa-phone"></i>
										</div>
										{editingField === 'phone' && editable ? (
											<input
												type="text"
												defaultValue={user.phone || ''}
												placeholder="Votre téléphone"
												className="bg-white px-4 py-1 focus:outline-none w-full h-12 font-medium text-[#580FCA]"
												onBlur={(e) => {
													handleFieldChange('phone', e.target.value);
													setEditingField(null);
												}}
											/>
										) : (
											<span onClick={() => editable && setEditingField('phone')} className={`${editable ? "cursor-pointer" : ""} text-[#580FCA] font-medium px-4`}>
												{user.phone || <span className="text-gray-400 italic">Aucun numéro de téléphone</span>}
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

									<div className="flex items-center shadow-md border-[#C320C0] border-2 rounded-md overflow-hidden">
										<div className="flex justify-center items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] w-12 h-12">
											<i className="text-white text-xl fa-solid fa-cake-candles"></i>
										</div>
										{editingField === 'birthdate' && editable ? (
											<input
												type="date"
												defaultValue={user.birthdate || ''}
												className="bg-white px-4 py-1 focus:outline-none w-full h-12 font-medium text-[#580FCA]"
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
											<span className="px-4 text-gray-400 italic">Aucune date de naissance</span>
										)}
										{editable && editingField !== 'birthdate' && (
											<button onClick={() => setEditingField('birthdate')} className="px-3 text-gray-500 hover:text-[#580FCA]">🖊️</button>
										)}
									</div>

									<div className="flex items-center shadow-md border-[#C320C0] border-2 rounded-md overflow-hidden">
										<div className="flex justify-center items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] w-12 h-12">
											<i className="text-white text-xl fa-brands fa-linkedin"></i>
										</div>
										{editingField === 'linkedinUrl' && editable ? (
											<input
												type="text"
												defaultValue={user.linkedinUrl || ''}
												placeholder="Lien LinkedIn"
												className="bg-white px-4 py-1 focus:outline-none w-full h-12 font-medium text-[#580FCA]"
												onBlur={(e) => {
													handleFieldChange('linkedinUrl', e.target.value.trim());
													setEditingField(null);
												}}
											/>
										) : user.linkedinUrl ? (
											<a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="px-4 font-medium text-[#580FCA] underline">
												LinkedIn
											</a>
										) : (
											<span className="px-4 text-gray-400 italic">Aucun LinkedIn</span>
										)}
										{editable && editingField !== 'linkedinUrl' && (
											<button onClick={() => setEditingField('linkedinUrl')} className="px-3 text-gray-500 hover:text-[#580FCA]">🖊️</button>
										)}
									</div>

									<div className="flex items-center shadow-md border-[#C320C0] border-2 rounded-md overflow-hidden">
										<div className="flex justify-center items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] w-12 h-12">
											<i className="text-white text-xl fa-brands fa-instagram"></i>
										</div>
										{editingField === 'instaUrl' && editable ? (
											<input
												type="text"
												defaultValue={user.instaUrl || ''}
												placeholder="Lien Instagram"
												className="bg-white px-4 py-1 focus:outline-none w-full h-12 font-medium text-[#580FCA]"
												onBlur={(e) => {
													handleFieldChange('instaUrl', e.target.value.trim());
													setEditingField(null);
												}}
											/>
										) : user.instaUrl ? (
											<a href={user.instaUrl} target="_blank" rel="noreferrer" className="px-4 font-medium text-[#F929BB] underline">
												Instagram
											</a>
										) : (
											<span className="px-4 text-gray-400 italic">Aucun Instagram</span>
										)}
										{editable && editingField !== 'instaUrl' && (
											<button onClick={() => setEditingField('instaUrl')} className="px-3 text-gray-500 hover:text-[#F929BB]">🖊️</button>
										)}
									</div>

									<div className="flex items-center shadow-md border-[#C320C0] border-2 rounded-md overflow-hidden">
										<div className="flex justify-center items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] w-12 h-12">
											<i className="text-white text-xl fa-solid fa-globe"></i>
										</div>
										{editingField === 'websiteUrl' && editable ? (
											<input
												type="text"
												defaultValue={user.websiteUrl || ''}
												placeholder="Lien Site Web"
												className="bg-white px-4 py-1 focus:outline-none w-full h-12 font-medium text-[#580FCA]"
												onBlur={(e) => {
													handleFieldChange('websiteUrl', e.target.value.trim());
													setEditingField(null);
												}}
											/>
										) : user.websiteUrl ? (
											<a href={user.websiteUrl} target="_blank" rel="noreferrer" className="px-4 font-medium text-[#580FCA] underline">
												Site Web
											</a>
										) : (
											<span className="px-4 text-gray-400 italic">Aucun site web</span>
										)}
										{editable && editingField !== 'websiteUrl' && (
											<button onClick={() => setEditingField('websiteUrl')} className="px-3 text-gray-500 hover:text-[#580FCA]">🖊️</button>
										)}
									</div>

								</div>

								{editable && (
									<>
										<motion.div
											className="mt-6 w-full max-w-md"
											initial={{ width: firstVisit ? 0 : `${profileCompletion}%` }}
											animate={{ width: `${profileCompletion}%` }}
											transition={
												firstVisit
													? { type: "spring", stiffness: 120, damping: 16, duration: 1.2 }
													: { duration: 0 }
											}
										>
											<div className="bg-gradient-to-tr from-[#580FCA]/30 to-[#F929BB]/30 shadow-inner rounded-full h-5 overflow-hidden">
												<motion.div
													className="rounded-full h-full"
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
												className="bg-clip-text bg-gradient-to-r from-[#580FCA] to-[#F929BB] mt-2 font-medium text-transparent text-sm text-center animate__animated animate__fadeIn"
												initial={{ opacity: firstVisit ? 0 : 1 }}
												animate={{ opacity: 1 }}
												transition={{ delay: firstVisit ? 0.5 : 0 }}
											>
												Profil complété à {profileCompletion}%
											</motion.p>
										</motion.div>

										<div className="mx-auto mt-6 w-full max-w-md">
											<AnimatePresence>
												{animatedSteps.map((step) => (
													<motion.div
														key={step.label}
														initial={{ opacity: 0, x: 50 }}
														animate={{ opacity: 1, x: 0 }}
														exit={{ opacity: 0, x: -50, scale: 0.8 }}
														transition={{ duration: 0.5 }}
														className="flex justify-between items-center bg-gradient-to-r from-[#580FCA]/20 to-[#F929BB]/20 shadow-md backdrop-blur-sm mb-3 p-4 rounded-xl text-[#580FCA]"
													>
														<span className="font-semibold">{step.label}</span>
														<motion.div
															whileTap={{ scale: 0.9, rotate: 20 }}
															onClick={() => handleCheckAndRemove(step.label)}
															className="text-[#F929BB] hover:text-[#C320C0] transition-colors duration-300 cursor-pointer"
														>
															<FiX size={20} />
														</motion.div>
													</motion.div>
												))}
											</AnimatePresence>
										</div>
									</>
								)}

							</div>

							<div className="mt-10 pb-[2.5rem] border-t border-blueGray-200 text-center">
								<div className="space-y-10 mt-10">
									{extraSections}
								</div>
							</div>

							<div className="*:-z-[1] *:absolute mt">
								<div className="-top-[195px] -left-[519px] bg-gradient-to-b from-etPurple to-etPink blur-[230px] rounded-full w-[688px] aspect-square"></div>
								<div className="-right-[319px] bottom-[300px] bg-gradient-to-b from-etPink to-etPink blur-[230px] rounded-full w-[588px] aspect-square"></div>
								<img src={vector1} alt="vector" className="top-0 left-0 opacity-25" />
								<img src={vector1} alt="vector" className="right-0 bottom-0 opacity-25 rotate-180" />
								<img src={vector2} alt="vector" className="top-[33px] -right-[175px] animate-[etSpin_7s_linear_infinite]" />
								<img src={vector2} alt="vector" className="top-[1033px] -left-[175px] animate-[etSpin_7s_linear_infinite]" />
							</div>

						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default ProfileCard;