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
		// <motion.div
		// 	className="bg-white shadow-lg rounded-lg p-8 flex flex-col md:justify-between items-center"
		// 	initial={{ opacity: 0, y: -20 }}
		// 	animate={{ opacity: 1, y: 0 }}
		// 	transition={{ duration: 0.5 }}
		// >
		// 	{/* Partie gauche : image + note */}
		// 	<div className="flex flex-col items-center md:items-start">
		// 		<div className="relative">
		// 			{user.profileImage ? (
		// 				<img
		// 					src={`http://localhost:8080${user.profileImage}`}
		// 					alt="Profile"
		// 					className="w-40 h-40 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover cursor-pointer"
		// 					onClick={() =>
		// 						editable && document.getElementById('profileImageInput').click()
		// 					}
		// 				/>
		// 			) : (
		// 				<div
		// 					className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
		// 					onClick={() =>
		// 						editable && document.getElementById('profileImageInput').click()
		// 					}
		// 				>
		// 					<FiUser size={48} className="text-white" />
		// 				</div>
		// 			)}
		// 			{editable && (
		// 				<div
		// 					className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer"
		// 					onClick={() => document.getElementById('profileImageInput').click()}
		// 				>
		// 					<FiEdit2 size={20} />
		// 				</div>
		// 			)}
		// 			<input
		// 				type="file"
		// 				id="profileImageInput"
		// 				className="hidden"
		// 				accept="image/*"
		// 				onChange={handleImageChange}
		// 			/>
		// 		</div>
		// 		<div className="mt-4 text-center">
		// 			<StarRating rating={user.rating || 0} />
		// 			<div className="text-2xl font-bold mt-2">
		// 				{user.rating !== undefined && user.rating !== null
		// 					? user.rating.toFixed(1)
		// 					: 'NA'}
		// 			</div>
		// 		</div>
		// 	</div>

		// 	{/* Partie droite : infos */}
		// 	<div className="flex-1 mt-6 md:mt-0 md:ml-12 w-full">
		// 		<div className="space-y-6">
		// 			{['name', 'lastname'].map((field) => (
		// 				<div key={field} className="flex items-center border-b border-gray-300 pb-2">
		// 					<label className="w-40 font-bold capitalize text-lg">
		// 						{field} :
		// 					</label>
		// 					{editable ? (
		// 						<input
		// 							type="text"
		// 							defaultValue={user[field]}
		// 							className="flex-1 text-base sm:text-lg md:text-3xl outline-none"
		// 							onBlur={(e) => handleFieldChange(field, e.target.value)}
		// 						/>
		// 					) : (
		// 						<span className="text-base sm:text-lg md:text-3xl">{user[field]}</span>
		// 					)}
		// 				</div>
		// 			))}

		// 			{/* Email visible seulement si editable */}
		// 			{editable && (
		// 				<div className="flex items-center border-b border-gray-300 pb-2">
		// 					<label className="w-40 font-bold capitalize text-lg">email :</label>
		// 					<input
		// 						type="email"
		// 						defaultValue={user.email}
		// 						className="flex-1 text-base sm:text-lg md:text-2xl outline-none"
		// 						onBlur={(e) => handleFieldChange('email', e.target.value)}
		// 					/>
		// 				</div>
		// 			)}

		// 			<div className="flex items-center border-b border-gray-300 pb-2">
		// 				<label className="w-40 font-bold text-lg">Événements Participés :</label>
		// 				<span className="text-base sm:text-lg md:text-2xl">{user.eventsParticipated || 0}</span>
		// 			</div>

		// 			<div className="flex items-center">
		// 				<label className="w-40 font-bold text-lg">Événements <br /> Créés :</label>
		// 				<span className="text-base sm:text-lg md:text-2xl">{user.eventsCreated || 0}</span>
		// 			</div>
		// 		</div>
		// 	</div>
		// </motion.div>

		<main class="profile-page">
			<section class="relative block h-500-px">
				<div class="absolute top-0 w-full h-full bg-center bg-cover">
					<span id="blackOverlay" class="w-full h-full absolute opacity-50 bg-black"></span>
				</div>
				<div class="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style={{ transform: 'translateZ(0px)' }}
>
					<svg class="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
						<polygon class="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
					</svg>
				</div>
			</section>
			<section class="relative py-16 bg-blueGray-200">
				<div class="container mx-auto px-4">
					<div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
						<div class="px-6">
							<div class="flex flex-wrap justify-center">
								<div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
									<div class="relative">
										<img alt="..." src="https://demos.creative-tim.com/notus-js/assets/img/team-2-800x800.jpg" class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px">
										</img>
									</div>
								</div>
								<div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
									<div class="py-6 px-3 mt-32 sm:mt-0">
										<button class="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
											Connect
										</button>
									</div>
								</div>
								<div class="w-full lg:w-4/12 px-4 lg:order-1">
									<div class="flex justify-center py-4 lg:pt-4 pt-8">
										<div class="mr-4 p-3 text-center">
											<span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">22</span><span class="text-sm text-blueGray-400">Friends</span>
										</div>
										<div class="mr-4 p-3 text-center">
											<span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">10</span><span class="text-sm text-blueGray-400">Photos</span>
										</div>
										<div class="lg:mr-4 p-3 text-center">
											<span class="text-xl font-bold block uppercase tracking-wide text-blueGray-600">89</span><span class="text-sm text-blueGray-400">Comments</span>
										</div>
									</div>
								</div>
							</div>
							<div class="text-center mt-12">
								<h3 class="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
									Jenna Stones
								</h3>
								<div class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
									<i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
									Los Angeles, California
								</div>
								<div class="mb-2 text-blueGray-600 mt-10">
									<i class="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>Solution Manager - Creative Tim Officer
								</div>
								<div class="mb-2 text-blueGray-600">
									<i class="fas fa-university mr-2 text-lg text-blueGray-400"></i>University of Computer Science
								</div>
							</div>
							<div class="mt-10 py-10 border-t border-blueGray-200 text-center">
								<div class="flex flex-wrap justify-center">
									<div class="w-full lg:w-9/12 px-4">
										<p class="mb-4 text-lg leading-relaxed text-blueGray-700">
											An artist of considerable range, Jenna the name taken by
											Melbourne-raised, Brooklyn-based Nick Murphy writes,
											performs and records all of his own music, giving it a
											warm, intimate feel with a solid groove structure. An
											artist of considerable range.
										</p>
										<a href="#pablo" class="font-normal text-pink-500">Show more</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<footer class="relative bg-blueGray-200 pt-8 pb-6 mt-8">
					<div class="container mx-auto px-4">
						<div class="flex flex-wrap items-center md:justify-between justify-center">
							<div class="w-full md:w-6/12 px-4 mx-auto text-center">
								<div class="text-sm text-blueGray-500 font-semibold py-1">
									Made with <a href="https://www.creative-tim.com/product/notus-js" class="text-blueGray-500 hover:text-gray-800" target="_blank">Notus JS</a> by <a href="https://www.creative-tim.com" class="text-blueGray-500 hover:text-blueGray-800" target="_blank"> Creative Tim</a>.
								</div>
							</div>
						</div>
					</div>
				</footer>
			</section>
		</main>
	);
};

export default ProfileCard;
