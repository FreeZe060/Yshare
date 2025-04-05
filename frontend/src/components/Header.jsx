import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import logo from "../assets/img/logo-dark.svg"; // Remplace le chemin si besoin

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="fixed p-4 w-full z-50">
            <div className="p-5 bg-gray-900 text-gray-500 rounded-lg shadow-lg font-medium capitalize flex items-center gap-4 flex-wrap">
                {/* Logo */}
                <span className="px-3 py-1 pr-4 border-r border-gray-800">
                    <img
                        src="/assets/images/SonoryLogo.png"
                        alt="Logo Sonory"
                        className="w-8 h-8 -mt-1 inline mx-auto"
                    />
                </span>

                {/* Home */}
                <Link
                    to="/"
                    className={`px-6 hover:text-gray-300 transition-all duration-300 ${location.pathname === "/" ? "text-gray-300" : ""
                        }`}
                >
                    <i class="fa-solid fa-house p-2 bg-gray-800 rounded-full"></i>
                </Link>

                {/* Songs */}
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

                {/* Search icon */}
                <span className="px-1 hover:text-white cursor-pointer transition-all duration-300">
                    <i className="fas fa-search p-2 bg-gray-800 rounded-full"></i>
                </span>

                {/* Notifications */}
                <span className="px-1 hover:text-white cursor-pointer w-8 relative ml-auto transition-all duration-300">
                    <i className="fas fa-bell p-2 bg-gray-800 rounded-full"></i>
                    <span className="absolute right-0 top-0 -mt-2 -mr-1 text-xs bg-red-500 text-white font-medium px-2 shadow-lg rounded-full">
                        3
                    </span>
                </span>

                {/* User Icon */}
                <span className="hover:text-black cursor-pointer w-10 relative transition-all duration-300">
                    <i className="fas fa-user p-2 bg-gray-800 rounded-full"></i>
                    <span className="absolute right-0 top-0 -mt-1 -mr-1 text-xs bg-yellow-500 text-black font-medium px-2 rounded-full">
                        3
                    </span>
                </span>
            </div>
        </div>
    );
};

export default Header;
