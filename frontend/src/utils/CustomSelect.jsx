import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from 'react-icons/fa';

function CustomSelect({ label = "Sélectionner", options = [], value, onChange, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <motion.div
            ref={selectRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`relative w-full ${className}`}
        >
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center bg-white shadow-md px-4 py-2 border border-gray-300 hover:border-[#a50fca] rounded-lg focus:outline-none focus:ring-[#a50fca] focus:ring-2 text-gray-700 transition cursor-pointer"
            >
                {value || label}
                <FaChevronDown className={`text-sm transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="z-10 absolute bg-white shadow-lg mt-2 rounded-md w-full max-h-60 overflow-y-auto"
                    >
                        {options.map((option, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className="hover:bg-gradient-to-tr from-[#580FCA] to-[#F929BB] px-4 py-2 hover:text-white transition-all duration-200 cursor-pointer"
                            >
                                {option}
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default CustomSelect;
