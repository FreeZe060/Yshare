import React, { useState, useEffect } from 'react';
import useRegister from '../hooks/User/useRegister';
import Swal from 'sweetalert2';
import 'animate.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading, error } = useRegister();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  return (
    <>
      <Header />
      <div className="h-screen flex flex-row md:flex-col">
        <div className="relative overflow-hidden flex w-1/2 md:w-full md:mb-6 bg-gradient-to-tr from-blue-800 to-purple-700 justify-around items-center p-6">
          <div className="text-left md:text-center">
            <h1 className="text-white font-bold text-5xl md:text-6xl font-sans animate__animated animate__fadeInDown">
              GOFINANCE
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
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="bg-white flex w-full max-w-lg flex-col animate__animated animate__fadeIn"
          >
            <h1 className="text-gray-800 font-bold text-3xl mb-3 text-center">
              Créer un compte
            </h1>
            <p className="text-base font-normal text-gray-600 mb-6 text-center">
              Rejoignez-nous
            </p>

            {[
              { value: name, onChange: setName, placeholder: 'Prénom', type: 'text', name: 'name' },
              { value: lastname, onChange: setLastname, placeholder: 'Nom', type: 'text', name: 'lastname' },
              { value: email, onChange: setEmail, placeholder: 'Adresse e-mail', type: 'email', name: 'email' },
            ].map((input, index) => (
              <div key={index} className="flex items-center border-2 py-3 px-4 rounded-2xl mb-4 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12l-4 4-4-4" />
                </svg>
                <input
                  className="pl-3 outline-none border-none w-full text-sm bg-transparent"
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={input.value}
                  onChange={(e) => input.onChange(e.target.value)}
                  required
                />
              </div>
            ))}

            <div className="relative flex items-center border-2 py-3 px-4 rounded-2xl mb-4 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0" />
              </svg>
              <input
                className="pl-3 pr-12 outline-none border-none w-full text-sm bg-transparent"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5c5.523 0 10 4.477 10 10 0 1.364-.27 2.657-.764 3.855" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center border-2 py-3 px-4 rounded-2xl mb-5 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
              </svg>
              <input
                className="pl-3 outline-none border-none w-full text-sm bg-transparent"
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {error && (
              <p className="text-center mt-3 text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="block w-full bg-indigo-600 py-3 px-6 rounded-2xl text-white font-medium mb-4 transition transform hover:scale-105 text-sm"
            >
              {loading ? 'Chargement...' : "S'inscrire"}
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
      <Footer />
    </>
  );
};

export default Register;
