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
        };
    
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
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

        <>
            {/* <button
            className="ml-auto md:hidden text-white"
            onClick={() => setMenuOpen(prev => !prev)}
            >
            <i className="fas fa-bars text-2xl" />
            </button> */}
            <div
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "p-4" : "p-0"}`}
            >
                <div className={` bg-gray-900 text-gray-500 shadow-lg font-medium capitalize flex items-center gap-4 flex-wrap ${scrolled ? "p-5 rounded-lg" : "p-8"} transition-all duration-300`}>
                    <Link to="/" className="flex items-center gap-2">
                        <span className="px-3 py-1 pr-4 border-r border-gray-800">
                            <img
                                src="../assets/img/yshare.png"
                                alt="Logo Yshare"
                                className="w-8 h-8 -mt-1 inline mx-auto"
                            />
                        </span>
                    </Link>

                    
                    <div className="flex gap-6 ">
                        <Link
                            to="/"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/" ? "text-gray-300" : ""
                                }`}
                        >
                            <i className="w-8 flex items-center justify-center fas fa-home p-2 bg-gray-800 rounded-full" />
                            <span className="mx-1">Home</span>
                        </Link>

                        {/* Artists */}
                        <Link
                            to="/artists"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/artists" ? "text-gray-300" : ""
                                }`}
                        >
                            <i className="w-8 fas fa-th p-2 bg-gray-800 rounded-full" />
                            <span className="mx-1">News</span>
                            <span className="absolute left-0 ml-8 -mt-2 text-xs bg-gray-700 font-medium px-2 shadow-lg rounded-full">
                                5
                            </span>
                        </Link>

                        {/* Albums */}
                        <Link
                            to="/create-event"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300`}
                        >
                            <i className="w-8 fas fa-briefcase p-2 bg-gray-800 rounded-full" />
                            <span className="mx-1">Créer des Evénements</span>
                            <span className="absolute left-0 ml-8 -mt-2 text-xs bg-gray-700 font-medium px-2 shadow-lg rounded-full">
                                8
                            </span>
                        </Link>

                        <Link
                            to="/albums"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/albums" ? "text-gray-300" : ""
                                }`}
                        >
                            <i className="w-8 fas fa-briefcase p-2 bg-gray-800 rounded-full" />
                            <span className="mx-1">About Us</span>
                            <span className="absolute left-0 ml-8 -mt-2 text-xs bg-gray-700 font-medium px-2 shadow-lg rounded-full">
                                8
                            </span>
                        </Link>

                        <Link
                            to="/albums"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/albums" ? "text-gray-300" : ""
                                }`}
                        >
                            <i className="w-8 fas fa-briefcase p-2 bg-gray-800 rounded-full" />
                            <span className="mx-1">Aide</span>
                            <span className="absolute left-0 ml-8 -mt-2 text-xs bg-gray-700 font-medium px-2 shadow-lg rounded-full">
                                8
                            </span>
                        </Link>

                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        {isAuthenticated && user ? (
                            <>
                                <span className="px-1 hover:text-white cursor-pointer w-8 relative ml-auto transition-all duration-300">
                                    <i class="fa-solid fa-bell w-8 h-8 flex items-center justify-center bg-gray-800 rounded-full text-gray-200"></i>
                                    <span class="top-0 -left-0 absolute flex size-3.5">
                                        <span class="inline-flex absolute bg-red-500 opacity-75 rounded-full w-full h-full animate-ping"></span>
                                        <span class="absolute flex justify-center items-center bg-red-500 rounded-full w-3.5 h-3.5 font-bold text-[11px] text-white">
                                            3
                                        </span>
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
                                            {user?.role === "Administrateur" ? (
                                                <Link
                                                    to={`/admin`}
                                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded transition"
                                                >
                                                    Dashboard
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/profile/${user?.id}`}
                                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded transition"
                                                >
                                                    Profil
                                                </Link>
                                            )}
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
                                        className="px-4 py-2 bg-[#C621C0] hover:bg-[#c621c0d4] text-gray-50 rounded-xl flex items-center gap-2"
                                >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                        <span>Se Connecter</span>
                                </Link>
                                <Link
                                    to="/register"
                                        className="px-4 py-2 bg-white hover:bg-gray-200 rounded-xl flex items-center gap-2"
                                >
                                        <span class="text-black">S'inscrire</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* {menuOpen && (
            <div className="w-full mt-4 flex flex-col gap-4 md:hidden">
            </div>
            )} */}
        </>
    );
};

export default Header;
