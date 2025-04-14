import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogin from '../hooks/User/useLogin';
import Swal from 'sweetalert2';
import 'animate.css';
import Header from "../components/Header";
import { useAuth } from '../config/authHeader';
import useTextAnimation from '../hooks/Animations/useTextAnimation';
import useSlideUpAnimation from '../hooks/Animations/useSlideUpAnimation';

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
			navigate('/');
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
				navigate('/');
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
						<h1 className="text-gray-800 font-bold text-3xl mb-3 text-center anim-text">Bonjour!</h1>
						<p className="text-base font-normal text-gray-600 mb-6 text-center anim-text">Content de te revoir</p>

						<div class="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
							</svg>
							<input class="pl-2 outline-none border-none w-full" type="email"
								name="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required />
						</div>

						<div class="relative flex items-center border-2 py-2 px-3 rounded-2xl">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20"
								fill="currentColor">
								<path fill-rule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clip-rule="evenodd" />
							</svg>
							<input class="pl-2 outline-none border-none w-full" type={showPassword ? "text" : "password"}
								name="password"
								placeholder="Mot de passe"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required />
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 text-gray-400 focus:outline-none"
							>
								{showPassword ? <i class="fa-solid fa-eye"></i> : <i class="fa-solid fa-eye-slash"></i>}
							</button>
						</div>

						<p className={`text-center m-4 text-red-500 text-sm`}>{error}</p>

						<button
							type="submit"
							disabled={loading}
							className="block w-full bg-[#C421C0] py-3 rounded-2xl text-white font-medium mb-4 text-sm hover:scale-105 transition-all duration-300 ease-in-out"
						>
							{loading ? (
								<i className="fas fa-spinner fa-spin mr-2 animate-spin"></i>
							) : (
								"Se Connecter"
							)}
						</button>

						<div className="flex justify-center items-center mt-4 mb-2">
							<a
								href="http://localhost:8080/api/auth/google"
								className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
							>
								<img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
								<span className="text-sm text-gray-700 font-medium">Se connecter avec Google</span>
							</a>
						</div>

						<span className="text-sm text-center hover:text-blue-500 cursor-pointer block mb-3 transition-all duration-300 ease-in-out">
							Mot de passe oublié?
						</span>

						<span className="text-sm text-center hover:text-blue-500 cursor-pointer block transition-all duration-300 ease-in-out">
							Pas de compte ?{' '}
							<a href="/register" className="text-blue-500">
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
