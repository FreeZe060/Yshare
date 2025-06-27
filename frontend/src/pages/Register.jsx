import React, { useState, useEffect } from 'react';
import sanitizeInput from '../utils/sanitizeInput';

import useRegister from '../hooks/User/useRegister';

import Swal from 'sweetalert2';
import 'animate.css';

import Header from '../components/Partials/Header';

import useTextAnimation from '../hooks/Animations/useTextAnimation';
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';

const Register = () => {
	const [name, setName] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [gender, setGender] = useState('');
	const [profileImage, setProfileImage] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [invalidPasswordRules, setInvalidPasswordRules] = useState([]);
	const [shakeRules, setShakeRules] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);


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

	const handleGenderChange = (e) => {
		const sanitized = sanitizeInput(e.target.value);
		setGender(sanitized);
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
		if (gender && errors.gender) {
			setErrors(prev => ({ ...prev, gender: null }));
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
		if (!gender) newErrors.gender = 'Veuillez sélectionner votre genre';

		const rules = checkPasswordRules(password);
		const failedRules = rules.filter(r => !r.isValid);

		if (Object.keys(newErrors).length > 0 || failedRules.length > 0) {
			if (failedRules.length > 0) {
				const failedMessages = failedRules.map(r => `• ${r.label}`).join('\n');
				await Swal.fire({
					icon: 'error',
					title: 'Mot de passe invalide',
					html: `Votre mot de passe ne respecte pas les conditions suivantes :<br><strong>${failedRules.map(r => r.label).join('<br>')}</strong>`,
					confirmButtonText: 'OK'
				});
				setShakeRules(true);
				setTimeout(() => setShakeRules(false), 1000);
			}
			setErrors({ ...newErrors });
			return;
		}

		setErrors({});

		try {
			const userData = { name, lastname, gender, email, password, profileImage };
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

	const checkPasswordRules = (password) => {
		return [
			{ label: 'Au moins 8 caractères', isValid: password.length >= 8 },
			{ label: 'Une majuscule', isValid: /[A-Z]/.test(password) },
			{ label: 'Un chiffre', isValid: /\d/.test(password) }
		];
	};

	const getPasswordLevel = (rules) => {
		const validCount = rules.filter(r => r.isValid).length;
		if (validCount === 3) return 'strong';
		if (validCount === 2) return 'medium';
		return 'weak';
	};

	const passwordRules = checkPasswordRules(password);
	const passwordLevel = getPasswordLevel(passwordRules);


	const strengthStyle = {
		strong: {
			bg: 'bg-green-50',
			border: 'border-green-400',
			text: 'text-green-700',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
				<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
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
				<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
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
			<div className="relative flex flex-row md:flex-col h-screen">
				<div className="relative flex justify-around items-center bg-gradient-to-tr from-[#580FCA] to-[#F929BB] p-6 w-1/2 md:w-full md:h-full overflow-hidden">
					<div class="md:hidden">
						<h1 class="font-sans font-bold text-white text-4xl anim-text">Yshare</h1>
						<p class="mt-2 text-white anim-text">Organisez, partagez, vibrez.</p>
						<button type="submit" class="bg-white mt-4 mb-2 py-2 rounded-2xl w-28 font-bold text-[#C421C0] rev-slide-up">Savoir plus</button>
					</div>
					<div class="-bottom-32 -left-40 absolute border-4 border-t-8 border-opacity-30 rounded-full w-80 h-80"></div>
					<div class="-bottom-40 -left-20 absolute border-4 border-t-8 border-opacity-30 rounded-full w-80 h-80"></div>
					<div class="-top-40 -right-0 absolute border-4 border-t-8 border-opacity-30 rounded-full w-80 h-80"></div>
					<div class="-top-20 -right-20 absolute border-4 border-t-8 border-opacity-30 rounded-full w-80 h-80"></div>

					<div className="right-0 bottom-0 absolute">
						<p className="p-5 px-10 font-bold text-white text-sm" style={{ fontFamily: "'Source Code Pro', monospace" }}>v{version}</p>
					</div>
				</div>

				<div class="md:absolute flex justify-center items-center bg-white md:bg-transparent mt-[104px] xs:mt-0 py-10 w-1/2 md:w-full md:h-full rev-slide-up">
					<form onSubmit={handleSubmit} class="bg-white md:p-6 md:rounded-xl min-w-[20%]">
						<h1 className="mb-3 font-bold text-gray-800 text-3xl text-center anim-text">Créer un compte!</h1>
						<p className="mb-6 font-normal text-gray-600 text-base text-center anim-text">Rejoignez-nous</p>

						{/* {[
							{ value: name, onChange: setName, placeholder: 'Prénom', type: 'text', name: 'name' },
							{ value: lastname, onChange: setLastname, placeholder: 'Nom', type: 'text', name: 'lastname' },
							{ value: email, onChange: setEmail, placeholder: 'Adresse e-mail', type: 'email', name: 'email' },
						].map((input, index) => (
							<div key={index} className="flex items-center mb-4 px-4 py-3 border-2 rounded-2xl w-full">
								<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4 4-4-4" />
								</svg>
								<input
									className="bg-transparent pl-3 border-none outline-none w-full w-full text-sm"
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
							<label htmlFor="profileImage" className="group relative hover:opacity-90 border-[#C421C0] border-4 rounded-full w-24 h-24 overflow-hidden transition duration-300 cursor-pointer">
								{profileImage ? (
									<img
										src={URL.createObjectURL(profileImage)}
										alt="Profile Preview"
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="flex justify-center items-center bg-gray-100 w-full h-full text-gray-400 group-hover:text-[#C421C0] text-sm transition duration-300">
										<i className="text-xl fas fa-camera" />
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
							<p className="mt-2 text-gray-500 text-xs">Cliquez pour choisir une photo</p>
						</div>

						<div className={`flex items-center border-2 py-2 px-3 rounded-2xl ${errors.name ? 'border-red-400 bg-red-50' : 'mb-4'}`}>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
							</svg>
							<input
								className="bg-transparent pl-2 border-none outline-none w-full"
								type="text"
								name="name"
								placeholder="Prénom"
								value={name}
								onChange={handleNameChange}
							/>
						</div>
						{errors.name && <p className="mt-1 mb-2 w-full text-red-500 text-xs text-center">{errors.name}</p>}

						<div className={`flex items-center border-2 py-2 px-3 rounded-2xl ${errors.lastname ? 'border-red-400 bg-red-50' : 'mb-4'}`}>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
									clip-rule="evenodd" />
							</svg>
							<input class="bg-transparent pl-2 border-none outline-none w-full" type="text" name="lastname" value={lastname} placeholder="Nom de Famille"
								onChange={handleLastnameChange} />
						</div>
						{errors.lastname && <p className="mt-1 mb-2 w-full text-red-500 text-xs text-center">{errors.lastname}</p>}

						<div className={`flex items-center border-2 py-2 px-3 rounded-2xl ${errors.gender ? 'border-red-400 bg-red-50' : 'mb-4'}`}>
							<i className="flex justify-center items-center w-5 h-5 text-gray-400 fa-solid fa-venus-mars"></i>
							<select
								name="gender"
								value={gender}
								onChange={handleGenderChange}
								className={`bg-transparent pl-2 border-none outline-none w-full ${gender === '' ? 'text-gray-400' : 'text-gray-700'}`}
							>
								<option value="" disabled hidden className="text-gray-400">Genre</option>
								<option value="Homme">Homme</option>
								<option value="Femme">Femme</option>
								<option value="Autre">Autre</option>
								<option value="Préféré ne pas dire">Préféré ne pas dire</option>
							</select>
						</div>

						{errors.gender && <p className="mt-1 mb-2 w-full text-red-500 text-xs text-center">{errors.gender}</p>}

						<div className={`flex items-center border-2 py-2 px-3 rounded-2xl ${errors.email ? 'border-red-400 bg-red-50' : 'mb-4'}`}>
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
							<input class="bg-transparent pl-2 border-none outline-none w-full" type="text" name="email" placeholder="Email" value={email}
								onChange={handleEmailChange} />
						</div>
						{errors.email && <p className="mt-1 mb-2 w-full text-red-500 text-xs text-center">{errors.email}</p>}

						<div className={`relative flex items-center border-2 py-2 px-3 pr-10 rounded-2xl
							${passwordLevel === 'strong' ? 'border-green-400 bg-green-50' : ''}
							${passwordLevel === 'medium' ? 'border-yellow-400 bg-yellow-50' : ''}
							${passwordLevel === 'weak' && password ? 'border-red-400 bg-red-50' : ''}
							${!password ? 'mb-4' : ''}
						`}>
							<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clipRule="evenodd"
								/>
							</svg>
							<input
								className="bg-transparent pl-2 border-none outline-none w-full"
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={password}
								onFocus={() => setPasswordFocused(true)}
								onBlur={() => setPasswordFocused(password.length > 0)}
								onChange={handlePasswordChange}
								placeholder="Mot de passe"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="right-3 absolute focus:outline-none text-gray-400"
							>
								<div class="w-6">
									{showPassword ? (
										<i className="fa-solid fa-eye" />
									) : (
										<i className="fa-solid fa-eye-slash" />
									)}
								</div>
							</button>
						</div>
						{password && (
							<p className={`text-xs mt-1 mb-2 text-center transition-all duration-300 ${passwordLevel === 'strong' ? 'text-green-600' :
									passwordLevel === 'medium' ? 'text-yellow-600' :
										'text-red-600'
								}`}>
								{passwordLevel === 'strong' ? 'Mot de passe sécurisé' :
									passwordLevel === 'medium' ? 'Mot de passe moyen' :
										'Mot de passe faible'}
							</p>
						)}
						{passwordFocused && (
							<div className="flex flex-col mt-2 mb-4 text-xs">
								{checkPasswordRules(password).map((rule, idx) => {
									const shouldShake = shakeRules && !rule.isValid;
									return (
										<div
											key={idx}
											className={`
												flex items-center gap-2 px-3 rounded-xl transition-all duration-300 text-sm
												${rule.isValid ? 'text-green-700 animate__fadeIn animate__animated' : 'text-red-600'}
												${shouldShake ? 'animate__animated animate__headShake' : ''}
											`}
										>
											<span className={`w-2 h-2 rounded-full ${rule.isValid ? 'bg-green-500' : 'bg-red-500'}`} />
											{rule.label}
										</div>
									);
								})}
							</div>
						)}

						{error && (
							<p className="mt-3 text-red-500 text-sm text-center">{error}</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="block bg-[#C421C0] mb-2 py-3 rounded-2xl w-full font-medium text-white text-sm hover:scale-105 transition-all duration-300 ease-in-out"
						>
							{loading ? (
								<i className="mr-2 animate-spin fas fa-spinner fa-spin"></i>
							) : (
								"Créer un compte"
							)}
						</button>

						<span className="block text-gray-400 text-xs text-center">
							En créant un compte, vous acceptez nos{' '}
							<a href="/conditions-utilisation" className="hover:text-[#C421C0] underline transition">Conditions d'utilisation</a>.
						</span>

						<span className="block mt-2 hover:text-blue-500 text-sm text-center transition-all duration-300 ease-in-out cursor-pointer">
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