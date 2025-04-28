import React, { useState, useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar';
import StatsSection from '../components/admin/StatsSection';
import LastEventSection from '../components/admin/LestEventSection';
import LastUsersSection from '../components/admin/LastUsersSection';
import ReportSection from '../components/admin/ReportSection';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
	const [activeSection, setActiveSection] = useState(() => {
		return localStorage.getItem('activeSection') || 'dashboard';
	});

	useEffect(() => {
		localStorage.setItem('activeSection', activeSection);
	}, [activeSection]);

	const renderContent = () => {
		switch (activeSection) {
			case 'dashboard':
				return (
					<>
						<StatsSection setActiveSection={setActiveSection} />
						<LastEventSection />
						<LastUsersSection />
					</>
				);
            case 'users':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users</h2>
                        <LastUsersSection showAll />
                    </motion.div>
                );
            case 'reports':
                return (
                    <motion.div
                    className="text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    >
                    <ReportSection />
                    </motion.div>
                );
			case 'all-events':
				return (
					<motion.div className="text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<h2 className="text-2xl font-bold mb-4">All Events</h2>
						<p>Affichage de tous les events ici.</p>
					</motion.div>
				);
			case 'participants':
				return (
					<motion.div className="text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<h2 className="text-2xl font-bold mb-4">Participants</h2>
						<p>Liste des participants ici.</p>
					</motion.div>
				);
			case 'comments':
				return (
					<motion.div className="text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<h2 className="text-2xl font-bold mb-4">Comments</h2>
						<p>Design à venir...</p>
					</motion.div>
				);
			case 'news':
				return (
					<motion.div className="text-gray-800" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<h2 className="text-2xl font-bold mb-4">News</h2>
						<p>Design à venir...</p>
					</motion.div>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<Header />
			<div className="antialiased bg-gradient-to-br from-white via-indigo-100 to-indigo-300 w-full min-h-screen text-slate-300 relative py-20">
				<div className="grid md:grid-cols-1 grid-cols-12 mx-auto gap-2 md:gap-4 sm:gap-6 max-w-7xl my-10 px-2">
					<Sidebar active={activeSection} setActive={setActiveSection} />
					<div id="content" className="bg-white lg:mt-4 shadow-xl col-span-9 rounded-lg p-6">
						<AnimatePresence mode="wait">
							{renderContent()}
						</AnimatePresence>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}