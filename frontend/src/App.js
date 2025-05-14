import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './index.css';
import ScrollToTop from './utils/ScrollToTop';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profil from './pages/Profil';
import PrivateRoute from './components/PrivateRoute';
import CreateEventPage from './pages/CreateEventPage';
import Admin from './pages/DashboardPage';
import AdminRoute from './components/admin/AdminRoute';
import EventDetails from './pages/EventDetails';
import TeamPage from './pages/TeamPage';
import NewsPage from './pages/NewsPage';
import { LegalMentions, PrivacyPolicy, TermsOfUse, TermsOfSale } from './pages/LegalPages';
import NotificationPage from './pages/NotificationPage';

function App() {

	return (
		<>
			<ScrollToTop />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/team" element={<TeamPage />} />
				<Route path="/mentions-legales" element={<LegalMentions />} />
				<Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
				<Route path="/conditions-utilisation" element={<TermsOfUse />} />
				<Route path="/conditions-vente" element={<TermsOfSale />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/profile/:userId" element={<Profil />} />
				<Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
				<Route path="/notifications" element={<PrivateRoute><NotificationPage /></PrivateRoute>} />
				<Route path="/news" element={<NewsPage />}/>
				<Route path="/create-event" element={<PrivateRoute><CreateEventPage /></PrivateRoute>} />

				<Route path="/event/:eventId" element={<EventDetails />} />
				{/* <Route path="/all-events" element={<AllEvents />} />
			<Route path="*" element={<Navigate to="/" />} /> */}
			</Routes>
		</>

	);
}

export default App;