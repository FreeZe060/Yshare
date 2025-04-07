// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/User/useLogin';
import Swal from 'sweetalert2';
import 'animate.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, error } = useLogin();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login({ email, password });
            localStorage.setItem('token', result.token);
            localStorage.setItem('username', result.name || result.email);
            
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

    return (
        <>
			<Header />
            <div className="h-screen flex flex-row md:flex-col">
                <div className="relative overflow-hidden flex w-1/2 md:w-full md:mb-6 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center p-8">
                    <div className="text-left md:text-center">
                        <h1 className="text-white font-bold text-8xl md:text-9xl font-sans animate__animated animate__fadeInDown">
                            GoFinance
                        </h1>
                        <p className="text-white mt-6 text-3xl md:text-4xl animate__animated animate__fadeInUp">
                            The most popular peer to peer lending at SEA
                        </p>
                        <button
                            type="button"
                            className="mt-8 block w-48 bg-white text-indigo-800 py-4 rounded-2xl font-bold transition transform hover:scale-105 animate__animated animate__zoomIn"
                        >
                            Read More
                        </button>
                    </div>
                    <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                    <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
                </div>

                <div className="flex w-1/2 md:w-full justify-center items-center bg-white p-8">
                    <form onSubmit={handleSubmit} className="bg-white flex w-full max-w-xl flex-col animate__animated animate__fadeIn">
                        <h1 className="text-gray-800 font-bold text-5xl mb-4 text-center">Hello Again!</h1>
                        <p className="text-xl font-normal text-gray-600 mb-8 text-center">Welcome Back</p>

                        <div className="flex items-center border-2 py-6 px-6 rounded-3xl mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4 4-4-4m8-4l-4 4-4-4" />
                            </svg>
                            <input
                                className="pl-4 pr-16 outline-none border-none w-full text-2xl !bg-transparent"
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative flex items-center border-2 py-6 px-6 rounded-3xl mb-8">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11m6 0c0 1.657 1.343 3 3 3s3-1.343 3-3m-9 0v1a1 1 0 001 1h2a1 1 0 001-1v-1" />
                            </svg>
                            <input
                                className="pl-4 pr-16 outline-none border-none w-full text-2xl !bg-transparent"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-gray-500 focus:outline-none"
                            >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.959 9.959 0 014.073-7.073m2.156-1.84A9.953 9.953 0 0112 3c5.523 0 10 4.477 10 10 0 1.364-.27 2.657-.764 3.855M15 12a3 3 0 11-6 0 3 3 0 016 0" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="block w-full bg-indigo-600 py-6 rounded-3xl text-white font-semibold mb-6 transition transform hover:scale-105 text-2xl"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                        <span className="text-xl text-center hover:text-blue-500 cursor-pointer block">
                            Forgot Password ?
                        </span>
                        {error && <p className="text-center mt-4 text-red-500 text-xl">{error}</p>}
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Login;