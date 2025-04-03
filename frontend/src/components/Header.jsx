// src/components/Header.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import logoDark from "../assets/img/logo-dark.svg";
// import logoWhite from "../assets/img/logo-white.png";
import { useAuth } from "../context/AuthContext";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav class="flex justify-between bg-gradient-to-tr from-blue-600 via-violet-500 to-violet-400 w-screen text-white">
            <div class="flex items-center px-5 xl:px-12 py-6 w-full">
                <a class="font-heading font-bold text-3xl" href="#">
                    <img class="h-9" src="logo.png" alt="logo"></img>
                    Logo Here.
                </a>
                <ul class="hidden md:flex space-x-12 mx-auto px-4 font-heading font-semibold">
                    <li><a class="hover:text-gray-200" href="#">Home</a></li>
                    <li><a class="hover:text-gray-200" href="#">Catagory</a></li>
                    <li><a class="hover:text-gray-200" href="#">Collections</a></li>
                    <li><a class="hover:text-gray-200" href="#">Contact Us</a></li>
                </ul>
                <div class="hidden xl:flex items-center items-center space-x-5">
                    <a class="hover:text-gray-200" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </a>
                    <a class="flex items-center hover:text-gray-200" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span class="absolute flex -mt-5 ml-4">
                            <span class="inline-flex absolute bg-pink-400 opacity-75 rounded-full w-3 h-3 animate-ping"></span>
                            <span class="inline-flex relative bg-pink-500 rounded-full w-3 h-3">
                            </span>
                        </span>
                    </a>
                    <a class="flex items-center hover:text-gray-200" href="#">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </a>

                </div>
            </div>
            <a class="xl:hidden flex items-center mr-6" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span class="absolute flex -mt-5 ml-4">
                    <span class="inline-flex absolute bg-pink-400 opacity-75 rounded-full w-3 h-3 animate-ping"></span>
                    <span class="inline-flex relative bg-pink-500 rounded-full w-3 h-3">
                    </span>
                </span>
            </a>
            <a class="xl:hidden self-center mr-12 navbar-burger" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </a>
        </nav>
    );
};

export default Header;