import React from 'react';
import StarRating from '../StarRating';
import { FiUser, FiEdit2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../config/authHeader'; // Assurez-vous que le chemin est correct

const ProfileCard = ({ user, onUpdateProfileImage, onUpdateProfileField }) => {
	const auth = useAuth();
	const currentUser = auth?.user;
	const isAdmin = auth?.isAdmin;

	const editable = currentUser?.id === user.id || isAdmin;

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

	return (
		<>
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
			<main className="profile-page">
				<section className="relative block h-[500px]">
					<div
						className="absolute top-0 w-full h-full bg-center bg-cover"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
						}}
					>
						<span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
					</div>
					<div
						className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-[70px]"
						style={{ transform: 'translateZ(0px)' }}
					>
						<svg
							className="absolute bottom-0 overflow-hidden"
							xmlns="http://www.w3.org/2000/svg"
							preserveAspectRatio="none"
							version="1.1"
							viewBox="0 0 2560 100"
							x="0"
							y="0"
						>
							<polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100" />
						</svg>
					</div>
				</section>

				<section className="relative py-16 bg-blueGray-200">
					<div className="container mx-auto px-4">
						<div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
							<div className="px-6">
								<div className="flex flex-wrap justify-center">
									<div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
										<div className="relative">
											<img
												alt="Profile"
												src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg"
												className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]"
											/>
										</div>
									</div>
									<div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
										<div className="py-6 px-3 mt-32 sm:mt-0">
											<button
												className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
												type="button"
											>
												Connecter
											</button>
										</div>
									</div>
									<div className="w-full lg:w-4/12 px-4 lg:order-1">
										<div className="flex justify-center py-4 lg:pt-4 pt-8">
											<div className="mr-4 p-3 text-center">
												<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
													22
												</span>
												<span className="text-sm text-blueGray-400">Amis</span>
											</div>
											<div className="mr-4 p-3 text-center">
												<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
													10
												</span>
												<span className="text-sm text-blueGray-400">Photos</span>
											</div>
											<div className="lg:mr-4 p-3 text-center">
												<span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">
													89
												</span>
												<span className="text-sm text-blueGray-400">Commentaires</span>
											</div>
										</div>
									</div>
								</div>

								<div className="text-center mt-12">
									<h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
										Jenna Stones
									</h3>
									<div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
										<i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
										Los Angeles, California
									</div>
									<div className="mb-2 text-blueGray-600 mt-10">
										<i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
										Solution Manager - Creative Tim
									</div>
									<div className="mb-2 text-blueGray-600">
										<i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
										University of Computer Science
									</div>
								</div>

								<div className="mt-10 py-10 border-t border-blueGray-200 text-center">
									<div className="flex flex-wrap justify-center">
										<div className="w-full lg:w-9/12 px-4">
											<p className="mb-4 text-lg leading-relaxed text-blueGray-700">
												Une artiste polyvalente, Jenna, le nom pris par Nick Murphy, élevé à Melbourne
												et basé à Brooklyn, écrit, interprète et enregistre toute sa musique lui-même,
												lui donnant une sensation chaleureuse, intime, avec une structure rythmique solide.
											</p>
											<a href="#pablo" className="font-normal text-pink-500">
												En savoir plus
											</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<footer className="relative bg-blueGray-200 pt-8 pb-6 mt-8">
						<div className="container mx-auto px-4">
							<div className="flex flex-wrap items-center md:justify-between justify-center">
								<div className="w-full md:w-6/12 px-4 mx-auto text-center">
									<div className="text-sm text-blueGray-500 font-semibold py-1">
										Fabriqué avec ❤️ par{' '}
										<a
											href="https://www.creative-tim.com/product/notus-js"
											className="text-blueGray-500 hover:text-gray-800"
											target="_blank" rel="noreferrer"
										>
											Notus JS
										</a>{' '}
										par{' '}
										<a
											href="https://www.creative-tim.com"
											className="text-blueGray-500 hover:text-blueGray-800"
											target="_blank" rel="noreferrer"
										>
											Creative Tim
										</a>
										.
									</div>
								</div>
							</div>
						</div>
					</footer>
				</section>
			</main>

		</>
	);
};

export default ProfileCard;
