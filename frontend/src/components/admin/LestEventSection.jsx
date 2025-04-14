import React from 'react';

const LastEventSection = () => (
    <div id="last-incomes">
        <h1 className="font-bold py-4 uppercase text-gray-800">Last 24h incomes</h1>
        
        <div id="stats" className="grid grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                <div className="flex flex-row items-center">
                <div className="text-3xl p-4">💰</div>
                <div className="p-2">
                    <p className="text-xl font-bold text-gray-900">348$</p>
                    <p className="text-gray-500 font-medium">Amber Gates</p>
                    <p className="text-gray-400 text-sm">24 Nov 2022</p>
                </div>
                </div>
                <div className="border-t border-gray-100 p-4">
                <a href="#" className="inline-flex space-x-2 items-center text-indigo-600 hover:text-indigo-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708
                        2.836a.75.75 0 001.063.853l.041-.021M21
                        12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <span>Info</span>
                </a>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200">
                <div className="flex flex-row items-center">
                <div className="text-3xl p-4">💰</div>
                <div className="p-2">
                    <p className="text-xl font-bold text-gray-900">68$</p>
                    <p className="text-gray-500 font-medium">Maia Kipper</p>
                    <p className="text-gray-400 text-sm">23 Nov 2022</p>
                </div>
                </div>
                <div className="border-t border-gray-100 p-4">
                <a href="#" className="inline-flex space-x-2 items-center text-indigo-600 hover:text-indigo-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708
                        2.836a.75.75 0 001.063.853l.041-.021M21
                        12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <span>Info</span>
                </a>
                </div>
            </div>

            {/* Ajoute ici les autres cartes au même format si nécessaire */}

        </div>
    </div>
);

export default LastEventSection;