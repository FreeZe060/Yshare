import React, { useEffect, useState, useRef} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../config/authHeader";
// import logo from "../assets/img/logo-dark.svg"; // Remplace le chemin si besoin

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth() || {};
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);


    const [scrolled, setScrolled] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    useEffect(() => {
        const handleScroll = () => {
          setScrolled(window.scrollY > 0);
          setMenuOpen(false); // ← ferme le menu au scroll
        };
      
        const handleClickOutside = (e) => {
          if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenuOpen(false); // ← ferme le menu si on clique à l’extérieur
          }
        };
      
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousedown", handleClickOutside);
      
        return () => {
          window.removeEventListener("scroll", handleScroll);
          window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
      

    return (
        <div
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "p-4" : "p-0"
                }`}
        >
            <div className={` bg-gray-900 text-gray-500 shadow-lg font-medium capitalize flex items-center gap-4 flex-wrap ${scrolled ? "p-5 rounded-lg" : "p-8"} transition-all duration-300`}>
                {/* Logo */}
                <span className="px-3 py-1 pr-4 border-r border-gray-800">
                    <img
                        src="../assets/img/yshare.png"
                        alt="Logo Yshare"
                        className="w-8 h-8 -mt-1 inline mx-auto"
                    />
                </span>

                
                <div className="flex gap-6 ml-20">
                    <Link
                        to="/songs"
                        className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/songs" ? "text-gray-300" : ""
                            }`}
                    >
                        <i className="w-8 fas fa-music p-2 bg-gray-800 rounded-full" />
                        <span className="mx-1">Musiques</span>
                        <span className="absolute left-0 ml-8 -mt-2 text-xs bg-gray-700 font-medium px-2 shadow-lg rounded-full">
                            12
                        </span>
                    </Link>

                    {/* Artists */}
                    <Link
                        to="/artists"
                        className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/artists" ? "text-gray-300" : ""
                            }`}
                    >
                        <i className="w-8 fas fa-th p-2 bg-gray-800 rounded-full" />
                        <span className="mx-1">Artistes</span>
                        <span className="absolute left-0 ml-8 -mt-2 text-xs bg-gray-700 font-medium px-2 shadow-lg rounded-full">
                            5
                        </span>
                    </Link>

                    {/* Albums */}
                    <Link
                        to="/albums"
                        className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/albums" ? "text-gray-300" : ""
                            }`}
                    >
                        <i className="w-8 fas fa-briefcase p-2 bg-gray-800 rounded-full" />
                        <span className="mx-1">Albums</span>
                        <span className="absolute left-0 ml-8 -mt-2 text-xs bg-gray-700 font-medium px-2 shadow-lg rounded-full">
                            8
                        </span>
                    </Link>

                </div>

                <div className="ml-auto flex items-center gap-4">
                    {isAuthenticated && user ? (
                        <>
                            <span className="px-1 hover:text-white cursor-pointer w-8 relative ml-auto transition-all duration-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-8 h-8 p-2 bg-gray-800 rounded-full text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.25 17.25v.75a2.25 2.25 0 01-4.5 0v-.75m9.6-4.95A6.75 6.75 0 005.625 7.5v3.586c0 .414-.168.81-.465 1.102l-1.29 1.268a.75.75 0 00.54 1.284h17.28a.75.75 0 00.54-1.284l-1.29-1.268a1.5 1.5 0 01-.465-1.102V7.5z"
                                    />
                                </svg>
                                <span className="absolute right-0 top-0 -mt-2 -mr-1 text-xs bg-red-500 text-white font-medium px-2 shadow-lg rounded-full">
                                    3
                                </span>
                            </span>
                            <div className="relative ml-4">
                                <button
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="flex items-center gap-2 hover:text-white transition"
                                >
                                    {user.profileImage ? (
                                        <img
                                            src={`http://localhost:8080${user.profileImage}`}
                                            alt="Profil"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-700"
                                        />
                                    ) : (
                                        <i className="fas fa-user-circle text-3xl text-white" />
                                    )}
                                    <span className="text-white font-semibold">{user.name}</span>
                                </button>

                                {menuOpen && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg animate-fade-in p-3 font-medium z-50"
                                    >
                                        <Link
                                            to="/profil"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded transition"
                                        >
                                            Profil
                                        </Link>
                                        <hr className="my-2 border-gray-300" />
                                        <Link
                                            to="/favoris"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded transition"
                                        >
                                            Favoris
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
                                        >
                                            Se déconnecter
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-white font-semibold bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl shadow-md transition"
                            >
                                Se connecter
                            </Link>
                            <Link
                                to="/register"
                                className="text-white font-semibold bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl shadow-md transition"
                            >
                                S'inscrire
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
