import React, { useState, useRef, useEffect } from 'react';
import 'animate.css';
import { FaChevronDown } from 'react-icons/fa';

const CustomSelect = ({
    name,
    value,
    onChange,
    options,
    error,
    shakeKey,
    iconClass = 'fa-solid fa-venus-mars',
    placeholder = 'Genre'
}) => {
    const [open, setOpen] = useState(false);
    const selectRef = useRef();

    const handleSelect = (val) => {
        onChange({ target: { name, value: val } });
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (selectRef.current && !selectRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div key={`${name}-${shakeKey}`} className="relative w-full" ref={selectRef}>
            <div
                className={`
					flex items-center justify-between px-3 py-2 rounded-2xl cursor-pointer border-2 mb-4
					${error ? 'border-red-400 bg-red-50 animate__animated animate__headShake' : 'border-gray-200  bg-white'}
				`}
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2">
                    <i className={`flex items-center w-5 h-5 text-gray-400 ${iconClass}`} />
                    <span className={`${value ? 'text-gray-800' : 'text-gray-400'}`}>
                        {value || placeholder}
                    </span>
                </div>
                <FaChevronDown className="text-gray-400 text-xs" />
            </div>

            {open && (
                <ul className="z-10 absolute bg-white shadow-md border border-gray-200 rounded-xl w-full animate__animated animate__fadeIn">

                    {options.map((opt, i) => (
                        <li
                            key={i}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${value === opt ? 'bg-gray-100 font-medium' : ''
                                }`}
                            onClick={() => handleSelect(opt)}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
