import React, { useState, useEffect } from 'react';
import sanitizeInput from '../utils/sanitizeInput';

import useRegister from '../hooks/User/useRegister';

import Swal from 'sweetalert2';
import 'animate.css';

import Header from '../components/Header';

import useTextAnimation from '../hooks/Animations/useTextAnimation';
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';

const Register = () => {
	const [name, setName] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [profileImage, setProfileImage] = useState(null);
	const [showPassword, setShowPassword] = useState(false);

	const handleNameChange = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setName(sanitized);
	};

	const handleLastnameChange = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setLastname(sanitized);
	};

	const handleEmailChange = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setEmail(sanitized);
	};

	const handlePasswordChange = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setPassword(sanitized);
	};

	const { register, loading, error } = useRegister();

	const [errors, setErrors] = useState({});

	useTextAnimation();
	useSlideUpAnimation();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	const handleFileChange = (e) => {
		setProfileImage(e.target.files[0]);
	};

	useEffect(() => {
		if (name.trim() && errors.name) {
			setErrors(prev => ({ ...prev, name: null }));
		}
		if (lastname.trim() && errors.lastname) {
			setErrors(prev => ({ ...prev, lastname: null }));
		}
		if (email.trim() && errors.email) {
			setErrors(prev => ({ ...prev, email: null }));
		}
		if (password && errors.password) {
			setErrors(prev => ({ ...prev, password: null }));
		}
	}, [name, lastname, email, password]);


	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = {};
		if (!name.trim()) newErrors.name = 'Veuillez entrer votre prénom';
		if (!lastname.trim()) newErrors.lastname = 'Veuillez entrer votre nom';
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) {
			newErrors.email = 'Veuillez entrer votre email';
		} else if (!emailRegex.test(email)) {
			newErrors.email = 'Veuillez entrer un email valide';
		}
		if (!password) newErrors.password = 'Veuillez entrer un mot de passe';

		if (Object.keys(newErrors).length > 0 || passwordStrength.level === 'weak') {
			setErrors(newErrors);
			return;
		}

		setErrors({});

		try {
			const userData = { name, lastname, email, password, profileImage };
			const result = await register(userData);

			localStorage.setItem('token', result.token);
			localStorage.setItem('username', result.name);

			Swal.fire({
				icon: 'success',
				title: 'Compte créé avec succès',
				showConfirmButton: false,
				timer: 1500,
			}).then(() => {
				window.location.href = '/';
			});
		} catch (err) {
			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: err.message,
			});
		}
	};

	const getPasswordStrength = (password) => {
		if (!password) return { level: 'empty', message: '' };

		const hasUppercase = /[A-Z]/.test(password);
		const hasNumber = /\d/.test(password);
		const hasMinLength = password.length >= 8;

		if (hasUppercase && hasNumber && hasMinLength) {
			return { level: 'strong', message: 'Mot de passe sécurisé' };
		} else if ((hasUppercase || hasNumber) && password.length >= 6) {
			return { level: 'medium', message: 'Mot de passe faible' };
		} else {
			return { level: 'weak', message: 'Au moins une majuscule, un chiffre et 8 caractères' };
		}
	};

	const passwordStrength = getPasswordStrength(password);

	const strengthStyle = {
		strong: {
			bg: 'bg-green-50',
			border: 'border-green-400',
			text: 'text-green-700',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path
						fillRule="evenodd"
						d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		medium: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-400',
			text: 'text-yellow-700',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fillRule="evenodd"
						d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		weak: {
			bg: 'bg-red-50',
			border: 'border-red-400',
			text: 'text-red-700',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fillRule="evenodd"
						d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
	};

	const [version, setVersion] = useState("");

	useEffect(() => {
		fetch("/version.txt")
			.then(response => response.text())
			.then(text => setVersion(text.trim()));
	}, []);

	return (
		<>
			<Header />
			<div className="h-screen flex flex-row md:flex-col">
				<div className="relative overflow-hidden flex w-1/2 md:w-full md:mb-6 bg-gradient-to-tr from-[#580FCA] to-[#F929BB] justify-around items-center p-6">
					<div>
						<h1 class="text-white font-bold text-4xl font-sans anim-text">Yshare</h1>
						<p class="text-white mt-2 anim-text">Organisez, partagez, vibrez.</p>
						<button type="submit" class=" w-28 bg-white text-[#C421C0] mt-4 py-2 rounded-2xl font-bold mb-2 rev-slide-up">Savoir plus</button>
					</div>
					<div class="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
					<div class="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
					<div class="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
					<div class="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>

					<div className="right-0 bottom-0 absolute">
						<p className="p-5 px-10 font-bold text-white text-sm" style={{ fontFamily: "'Source Code Pro', monospace" }}>v{version}</p>
					</div>
				</div>

				<div class="flex w-1/2 justify-center py-10 items-center bg-white rev-slide-up">
					<form onSubmit={handleSubmit} class="bg-white min-w-[20%]">
						<h1 className="text-gray-800 font-bold text-3xl mb-3 text-center anim-text">Créer un compte!</h1>
						<p className="text-base font-normal text-gray-600 mb-6 text-center anim-text">Rejoignez-nous</p>

						{/* {[
							{ value: name, onChange: setName, placeholder: 'Prénom', type: 'text', name: 'name' },
							{ value: lastname, onChange: setLastname, placeholder: 'Nom', type: 'text', name: 'lastname' },
							{ value: email, onChange: setEmail, placeholder: 'Adresse e-mail', type: 'email', name: 'email' },
						].map((input, index) => (
							<div key={index} className="flex items-center border-2 py-3 px-4 rounded-2xl mb-4 w-full">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4 4-4-4" />
								</svg>
								<input
									className="pl-3 outline-none border-none w-full w-full text-sm bg-transparent"
									type={input.type}
									name={input.name}
									placeholder={input.placeholder}
									value={input.value}
									onChange={(e) => input.onChange(e.target.value)}
									required
								/>
							</div>
						))} */}

						<div className="flex flex-col items-center mb-5">
							<label htmlFor="profileImage" className="cursor-pointer group relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#C421C0] hover:opacity-90 transition duration-300">
								{profileImage ? (
									<img
										src={URL.createObjectURL(profileImage)}
										alt="Profile Preview"
										className="w-full h-full object-cover"
									/>
								) : (
										<div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#C421C0] transition duration-300 text-sm">
										<i className="fas fa-camera text-xl" />
									</div>
								)}
								<input
									id="profileImage"
									type="file"
									name="profileImage"
									accept="image/*"
									className="hidden"
									onChange={handleFileChange}
								/>
							</label>
							<p className="mt-2 text-xs text-gray-500">Cliquez pour choisir une photo</p>
						</div>

						<div className={`flex items-center border-2 py-2 px-3 rounded-2xl ${errors.name ? 'border-red-400 bg-red-50' : 'mb-4'}`}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
							</svg>
							<input
								className="pl-2 outline-none border-none w-full bg-transparent"
								type="text"
								name="name"
								placeholder="Prénom"
								value={name}
								onChange={handleNameChange}
							/>
						</div>
						{errors.name && <p className="w-full text-center text-red-500 text-xs mt-1 mb-2">{errors.name}</p>}

						<div className={`flex items-center border-2 py-2 px-3 rounded-2xl ${errors.lastname ? 'border-red-400 bg-red-50' : 'mb-4'}`}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clip-rule="evenodd" />
							</svg>
							<input class="pl-2 outline-none border-none w-full bg-transparent" type="text" name="lastname" value={lastname} placeholder="Nom de Famille" 
							onChange={handleLastnameChange} />
						</div>
						{errors.lastname && <p className="w-full text-center text-red-500 text-xs mt-1 mb-2">{errors.lastname}</p>}

						<div className={`flex items-center border-2 py-2 px-3 rounded-2xl ${errors.email ? 'border-red-400 bg-red-50' : 'mb-4'}`}>
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
							<input class="pl-2 outline-none border-none w-full bg-transparent" type="text" name="email" placeholder="Email" value={email} 
							onChange={handleEmailChange} />
						</div>
						{errors.email && <p className="w-full text-center text-red-500 text-xs mt-1 mb-2">{errors.email}</p>}

						<div
							className={`relative flex items-center border-2 py-2 px-3 pr-10 rounded-2xl
								${errors.password || passwordStrength.level === 'weak' ? 'border-red-400 bg-red-50' : strengthStyle[passwordStrength.level]?.border || ''}
								${!errors.password && !password ? 'mb-4' : ''}
							`}
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clipRule="evenodd"
								/>
							</svg>
							<input
								className="pl-2 outline-none border-none w-full bg-transparent"
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={password}
								onChange={handlePasswordChange}
								placeholder="Mot de passe"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 text-gray-400 focus:outline-none"
							>
								{showPassword ? (
									<i className="fa-solid fa-eye" />
								) : (
									<i className="fa-solid fa-eye-slash" />
								)}
							</button>
						</div>

						{errors.password ? (
							<p className="w-full text-center text-red-500 text-xs mt-1 mb-2">{errors.password}</p>
						) : password && (
							<div className={`flex items-center text-xs mb-2 ${strengthStyle[passwordStrength.level]?.text}`}>
								{strengthStyle[passwordStrength.level]?.icon}
								<p className="ml-1 flex flex-wrap">{passwordStrength.message}</p>
							</div>
						)}

						{error && (
							<p className="text-center mt-3 text-red-500 text-sm">{error}</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="block w-full bg-[#C421C0] py-3 rounded-2xl text-white font-medium mb-4 text-sm hover:scale-105 transition-all duration-300 ease-in-out"
						>
							{loading ? (
								<i className="fas fa-spinner fa-spin mr-2 animate-spin"></i>
							) : (
								"Créer un compte"
							)}
						</button>

						<span className="text-sm text-center hover:text-blue-500 cursor-pointer block">
							Déjà un compte ?{' '}
							<a href="/login" className="text-blue-500">
								Se connecter ici
							</a>
						</span>
					</form>
				</div>
			</div>
		</>
	);
};

export default Register;
