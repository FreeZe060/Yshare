import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogin from '../hooks/User/useLogin';
import Swal from 'sweetalert2';
import 'animate.css';
import Header from "../components/Partials/Header";
import { useAuth } from '../config/authHeader';
import useTextAnimation from '../hooks/Animations/useTextAnimation';
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const { login, loading, error } = useLogin();
	const navigate = useNavigate();
	const location = useLocation();
	const { login: loginContext } = useAuth() || {};

	useTextAnimation();
	useSlideUpAnimation();

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}, []);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');

		if (token) {
			localStorage.setItem('token', token);
			loginContext({ token });
			const lastVisited = localStorage.getItem('lastVisited') || '/';
			localStorage.removeItem('lastVisited');
			window.location.href = lastVisited;
		}
	}, [location]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await login({ email, password });

			localStorage.setItem('token', result.token);
			loginContext(result);

			Swal.fire({
				icon: 'success',
				title: 'Connexion réussie',
				showConfirmButton: false,
				timer: 1500,
			}).then(() => {
				const lastVisited = localStorage.getItem('lastVisited') || '/';
				localStorage.removeItem('lastVisited');
				window.location.href = lastVisited;
			});
		} catch (err) {
			Swal.fire({
				icon: 'error',
				title: 'Erreur',
				text: err.message,
			});
		}
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

				<div class="md:absolute flex justify-center items-center bg-white md:bg-transparent py-10 pt-[104px] xs:pt-[0px] pb-[0px] xs:pb-[104px] w-1/2 md:w-full md:h-full rev-slide-up">
					<form onSubmit={handleSubmit} class="bg-white md:p-6 md:rounded-xl min-w-[20%]">
						<h1 className="mb-3 font-bold text-gray-800 text-3xl text-center anim-text">Bonjour!</h1>
						<p className="mb-6 font-normal text-gray-600 text-base text-center anim-text">Content de te revoir</p>

						<div class="flex items-center mb-4 px-3 py-2 border-2 rounded-2xl">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
							<input class="pl-2 border-none outline-none w-full" type="email"
								name="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required />
						</div>

						<div class="relative flex items-center px-3 py-2 border-2 rounded-2xl">
							<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-400" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clip-rule="evenodd" />
							</svg>
							<input class="pl-2 border-none outline-none w-full" type={showPassword ? "text" : "password"}
								name="password"
								placeholder="Mot de passe"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required />
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="right-3 focus:outline-none text-gray-400"
							>
								<div class="w-6">
									{showPassword ? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i>}
								</div>
							</button>
						</div>

						<p className={`text-center m-4 text-red-500 text-sm`}>{error}</p>

						<button
							type="submit"
							disabled={loading}
							className="block bg-[#C421C0] mb-4 py-3 rounded-2xl w-full font-medium text-white text-sm hover:scale-105 transition-all duration-300 ease-in-out"
						>
							{loading ? (
								<i className="mr-2 animate-spin fas fa-spinner fa-spin"></i>
							) : (
								"Se Connecter"
							)}
						</button>

						<div className="flex justify-center items-center mt-4 mb-2">
							<a
								href={`${REACT_APP_API_BASE_URL}auth/google`}
								className="flex items-center hover:bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg transition"
							>
								<img src="/google-icon.svg" alt="Google" className="mr-2 w-5 h-5" />
								<span className="font-medium text-gray-700 text-sm">Se connecter avec Google</span>
							</a>
						</div>

						<span className="block mb-3 hover:text-[#D232BE] text-sm text-center transition-all duration-300 ease-in-out cursor-pointer">
							Mot de passe oublié?
						</span>

						<span className="block hover:text-[#D232BE] text-sm text-center transition-all duration-300 ease-in-out cursor-pointer">
							Pas de compte ?{' '}
							<a href="/register" className="text-[#D232BE]">
								S'inscrire ici
							</a>
						</span>

					</form>
				</div>
			</div>
		</>
	);
};

export default Login;