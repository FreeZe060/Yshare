import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './index.css';
import ScrollToTop from './utils/ScrollToTop';
import SaveLastVisitedPage from './config/SaveLastVisitedPage';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profil from './pages/Profil';
import PrivateRoute from './components/Route/PrivateRoute';
import CreateEventPage from './pages/CreateEventPage';
import Admin from './pages/DashboardPage';
import AdminRoute from './components/Route/AdminRoute';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import TeamPage from './pages/TeamPage';
import NewsPage from './pages/NewsPage';
import { LegalMentions, PrivacyPolicy, TermsOfUse, TermsOfSale } from './pages/LegalPages';
import NewsDetails from './pages/NewsDetails';
import UserParticipationPage from './pages/ParticipationPage';
import EventCreated from './pages/EventCreated';
import FavorisPage from './pages/FavorisPage';
import ParticipantPage from './pages/ParticipantPage';
import CreateNewsPage from './pages/CreateNewsPage';

function App() {

	return (
		<>
			<ScrollToTop />
			<SaveLastVisitedPage />
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
				<Route path="/news" element={<NewsPage />}/>
				<Route path="/news/:newsId" element={<NewsDetails />}/>
				<Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
				<Route path="/participation" element={<PrivateRoute><UserParticipationPage /></PrivateRoute>} />
				<Route path="/create-event" element={<PrivateRoute><CreateEventPage /></PrivateRoute>} />
				<Route path="/event-created" element={<PrivateRoute><EventCreated /></PrivateRoute>} />
				<Route path="/favoris" element={<PrivateRoute><FavorisPage /></PrivateRoute>} />
				<Route path="/event/:eventId/participants" element={<PrivateRoute><ParticipantPage /></PrivateRoute>} />
				<Route path="/create-news" element={<PrivateRoute><CreateNewsPage /></PrivateRoute>} />
				<Route path="/events" element={<Events/>} />
				<Route path="/event/:eventId" element={<EventDetails />} />
			</Routes>
		</>

	);
}

export default App;