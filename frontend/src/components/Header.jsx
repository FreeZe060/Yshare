import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../config/authHeader";
import logo from "../logo.png";
import useNotifications from "../hooks/Notification/useNotifications";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth() || {};
    const { notifications, loading: notifLoading } = useNotifications();
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);


    const [scrolled, setScrolled] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0 && window.matchMedia("(min-width: 768px)").matches);
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

    useEffect(() => {
        const handleClickOutsideNotif = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotif(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutsideNotif);
        return () => document.removeEventListener("mousedown", handleClickOutsideNotif);
    }, []);


    return (

        <>
            {/* <button
            className="md:hidden ml-auto text-white"
            onClick={() => setMenuOpen(prev => !prev)}
            >
            <i className="text-2xl fas fa-bars" />
            </button> */}
            <div id="navbar" className={`fixed w-full z-50 ${scrolled ? "p-4 md:top-0" : "p-0 md:top-0"} xs:bottom-0 xs:top-auto transition-all duration-300`} >
                <div className={`bg-gray-900 text-gray-500 w-[100%] xs:shadow-none shadow-lg font-medium capitalize flex items-center gap-4 ${scrolled ? "p-5 rounded-lg" : "p-8"} transition-all duration-300`}>
                    <Link to="/" className="xs:hidden">
                        <span className="flex justify-center items-center px-3 py-1 pr-4 border-gray-800 border-r">
                            <img
                                src={logo}
                                alt="Logo Yshare"
                                className="inline mx-auto -mt-1 rounded-full w-8 h-8"
                            />
                        </span>
                    </Link>

                    <div className="xs:hidden flex justify-between grow">
                        <div className="flex gap-6">
                            <Link
                                to="/"
                                className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/" ? "text-gray-300" : ""
                                    }`}
                            >
                                <i className="flex justify-center items-center bg-gray-800 p-2 rounded-full w-8 fas fa-home" />
                                <span className="mx-1">Home</span>
                            </Link>

                            {/* Artists */}
                            <Link
                                to="/artists"
                                className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/artists" ? "text-gray-300" : ""
                                    }`}
                            >
                                <i className="bg-gray-800 p-2 rounded-full w-8 fas fa-th" />
                                <span className="mx-1">News</span>
                                <span className="left-0 absolute bg-gray-700 shadow-lg -mt-2 ml-8 px-2 rounded-full font-medium text-xs">
                                    5
                                </span>
                            </Link>

                            {/* Albums */}
                            <Link
                                to="/create-event"
                                className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300`}
                            >
                                <i className="bg-gray-800 p-2 rounded-full w-8 fas fa-briefcase" />
                                <span className="mx-1">Créer des Evénements</span>
                                <span className="left-0 absolute bg-gray-700 shadow-lg -mt-2 ml-8 px-2 rounded-full font-medium text-xs">
                                    8
                                </span>
                            </Link>

                            <Link
                                to="/albums"
                                className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/albums" ? "text-gray-300" : ""
                                    }`}
                            >
                                <i className="bg-gray-800 p-2 rounded-full w-8 fas fa-briefcase" />
                                <span className="mx-1">About Us</span>
                                <span className="left-0 absolute bg-gray-700 shadow-lg -mt-2 ml-8 px-2 rounded-full font-medium text-xs">
                                    8
                                </span>
                            </Link>

                            <Link
                                to="/team"
                                className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 transition-all duration-300 ${location.pathname === "/albums" ? "text-gray-300" : ""
                                    }`}
                            >
                                <i className="bg-gray-800 p-2 rounded-full w-8 fas fa-briefcase" />
                                <span className="mx-1"> Team</span>
                            </Link>

                        </div>

                        <div className="flex items-center gap-4 ml-auto">
                            {isAuthenticated && user ? (
                                <>
                                    <div className="relative">
                                        <span
                                            onClick={() => setShowNotif(!showNotif)}
                                            className="relative px-1 w-8 hover:text-white transition-all duration-300 cursor-pointer"
                                        >
                                            <i className="flex justify-center items-center bg-gray-800 rounded-full w-8 h-8 text-gray-200 fa-solid fa-bell"></i>
                                            <span className="top-0 -left-0 absolute flex size-3.5">
                                                <span className="inline-flex absolute bg-red-500 opacity-75 rounded-full w-full h-full animate-ping"></span>
                                                <span className="absolute flex justify-center items-center bg-red-500 rounded-full w-3.5 h-3.5 font-bold text-[11px] text-white">
                                                    {notifications?.length || 0}
                                                </span>
                                            </span>
                                        </span>

                                        <AnimatePresence>
                                            {showNotif && (
                                                <motion.div
                                                    ref={notifRef}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="absolute right-[-100px] z-50 bg-white shadow-lg mt-2 p-3 rounded-xl w-64 font-medium"
                                                >
                                                    <div className="p-4 text-sm text-gray-700 font-medium border-b border-gray-200">Notifications</div>
                                                    <div className="divide-y divide-gray-200">
                                                        {notifications?.slice(0, 3).map((notif, i) => (
                                                            <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                                                <p className="text-gray-800 text-sm">{notif.title || 'Nouvelle notification'}</p>
                                                                <p className="text-gray-400 text-xs mt-1">{new Date(notif.date_sent).toLocaleString("fr-FR")}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-center border-t border-gray-200">
                                                        <Link
                                                            to="/notifications"
                                                            className="block py-3 text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
                                                        >
                                                            Voir toutes les notifications
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="relative ml-4">
                                        <button
                                            onClick={() => setMenuOpen((prev) => !prev)}
                                            className="flex items-center gap-2 hover:text-white transition"
                                        >
                                            {user.profileImage ? (
                                                <img
                                                    src={`http://localhost:8080${user.profileImage}`}
                                                    alt="Profil"
                                                    className="border border-gray-700 rounded-full w-10 h-10 object-cover"
                                                />
                                            ) : (
                                                <i className="text-white text-3xl fas fa-user-circle" />
                                            )}
                                            <span className="font-semibold text-white">{user.name}</span>
                                        </button>

                                        {menuOpen && (
                                            <div
                                                ref={menuRef}
                                                className="right-0 z-50 absolute bg-white shadow-lg mt-2 p-3 rounded-xl w-48 font-medium animate-fade-in"
                                            >
                                                {user?.role === "Administrateur" ? (
                                                    <Link
                                                        to={`/admin`}
                                                        className="block hover:bg-gray-100 px-4 py-2 rounded text-gray-800 transition"
                                                    >
                                                        Dashboard
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        to={`/profile/${user?.id}`}
                                                        className="block hover:bg-gray-100 px-4 py-2 rounded text-gray-800 transition"
                                                    >
                                                        Profil
                                                    </Link>
                                                )}
                                                <hr className="my-2 border-gray-300" />
                                                <Link
                                                    to="/favoris"
                                                    className="block hover:bg-gray-100 px-4 py-2 rounded text-gray-800 transition"
                                                >
                                                    Favoris
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="hover:bg-red-50 px-4 py-2 rounded w-full text-red-600 text-left transition"
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
                                        className="flex items-center gap-2 bg-[#C621C0] hover:bg-[#c621c0d4] px-4 py-2 rounded-xl text-gray-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fillRule="currentColor">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>Se Connecter</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="flex items-center gap-2 bg-white hover:bg-gray-300 px-4 py-2 rounded-xl"
                                    >
                                        <span className="text-black">S'inscrire</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="hidden xs:flex justify-center items-center gap-4 w-full">
                        <Link
                            to="/artists"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 ${location.pathname === "/artists" ? "text-gray-300  scale-[1.4]" : "scale-100"
                                } transition-all duration-300`}
                        >
                            <i className="bg-gray-800 p-2 rounded-full w-8 fas fa-th" />
                        </Link>
                        <Link
                            to="/artists"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 ${location.pathname === "/artists" ? "text-gray-300  scale-[1.4]" : "scale-100"
                                } transition-all duration-300`}
                        >
                            <i className="bg-gray-800 p-2 rounded-full w-8 fas fa-th" />
                        </Link>
                        <Link
                            to="/"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 ${location.pathname === "/" ? "text-gray-300 scale-[1.4]" : "scale-100"
                                } transition-all duration-300`}
                        >
                            <i className="flex justify-center items-center bg-gray-800 p-2 rounded-full w-8 fas fa-home" />
                        </Link>
                        <Link
                            to="/artists"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 ${location.pathname === "/artists" ? "text-gray-300  scale-[1.4]" : "scale-100"
                                } transition-all duration-300`}
                        >
                            <i className="bg-gray-800 p-2 rounded-full w-8 fas fa-th" />
                        </Link>
                        <Link
                            to="/login"
                            className={`relative flex items-center gap-2 px-3 py-1 text-base hover:text-gray-300 ${location.pathname === "/login" || location.pathname === "/register" ? "text-gray-300  scale-[1.4]" : "scale-100"
                                } transition-all duration-300`}
                        >
                            <i className="bg-gray-800 p-2 rounded-full w-8 fa-solid fa-user" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* {menuOpen && (
            <div className="md:hidden flex flex-col gap-4 mt-4 w-full">
            </div>
            )} */}
        </>
    );
};

export default Header;
