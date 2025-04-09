import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogin from '../hooks/User/useLogin';
import Swal from 'sweetalert2';
import 'animate.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../config/authHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useAuth() || {};

  // 🔑 Handle OAuth token in URL
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

  return (
    <>
      <Header />
      <div className="h-screen flex flex-row md:flex-col">
        <div className="relative overflow-hidden flex w-1/2 md:w-full md:mb-6 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center p-6">
          <div className="text-left md:text-center">
            <h1 className="text-white font-bold text-5xl md:text-6xl font-sans animate__animated animate__fadeInDown">
              GoFinance
            </h1>
            <p className="text-white mt-4 text-lg md:text-xl animate__animated animate__fadeInUp">
              The most popular peer to peer lending at SEA
            </p>
            <button
              type="button"
              className="mt-6 block w-36 bg-white text-indigo-800 py-2 rounded-xl font-semibold text-sm transition transform hover:scale-105 animate__animated animate__zoomIn"
            >
              Read More
            </button>
          </div>
          <div className="absolute -bottom-32 -left-40 w-60 h-60 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -bottom-40 -left-20 w-60 h-60 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-40 -right-0 w-60 h-60 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-20 -right-20 w-60 h-60 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>

        <div className="flex w-1/2 md:w-full justify-center items-center bg-white p-6">
          <form onSubmit={handleSubmit} className="bg-white flex w-full max-w-md flex-col animate__animated animate__fadeIn">
            <h1 className="text-gray-800 font-bold text-3xl mb-3 text-center">Hello Again!</h1>
            <p className="text-base font-normal text-gray-600 mb-6 text-center">Welcome Back</p>

            <div className="flex items-center border-2 py-3 px-4 rounded-2xl mb-4">
              <input
                className="pl-3 pr-6 outline-none border-none w-full text-sm bg-transparent"
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative flex items-center border-2 py-3 px-4 rounded-2xl mb-5">
              <input
                className="pl-3 pr-6 outline-none border-none w-full text-sm bg-transparent"
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
                className="absolute right-3 text-gray-500 focus:outline-none"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="block w-full bg-indigo-600 py-3 rounded-2xl text-white font-medium mb-4 text-sm hover:scale-105 transition"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>

            <span className="text-sm text-center hover:text-blue-500 cursor-pointer block mb-3">
              Forgot Password?
            </span>

            {/* 👇 OAuth Google login */}
            <div className="flex justify-center items-center mt-4 mb-2">
              <a
                href="http://localhost:8080/api/auth/google"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                <span className="text-sm text-gray-700 font-medium">Se connecter avec Google</span>
              </a>
            </div>

            {error && <p className="text-center mt-2 text-red-500 text-sm">{error}</p>}
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
