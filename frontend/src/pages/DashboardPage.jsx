import React, { useState, useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar/Sidebar';
import StatsSection from '../components/admin/Stats/StatsSection';
import LastEventSection from '../components/admin/Stats/LestEventSection';
import LastUsersSection from '../components/admin/User/UserSection';
import ReportSection from '../components/admin/Report/ReportSection';
import ParticipantSection from '../components/admin/Participant/ParticipantSection';
import CommentSection from '../components/admin/Comment/CommentSection';
import EventSection from '../components/admin/Event/EventSection';
import NewsSection from '../components/admin/News/NewsSection';
import UserCamembert from '../components/admin/Stats/UserCamembert';
import Header from '../components/Partials/Header';
import Footer from '../components/Partials/Footer';

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
						<UserCamembert setActiveSection={setActiveSection} />
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
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<EventSection />
					</motion.div>
				);
			case 'participants':
				return (
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<ParticipantSection />
					</motion.div>
				);
			case 'comments':
				return (
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<CommentSection />
					</motion.div>
				);
			case 'news':
				return (
					<motion.div 
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}>
						<NewsSection />
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