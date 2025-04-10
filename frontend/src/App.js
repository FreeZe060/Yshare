import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import './index.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// import AllEvents from './pages/AllEvents';
import Profil from './pages/Profil';
import PrivateRoute from './components/PrivateRoute';
import CreateEventPage from './pages/CreateEventPage';

function App() {

	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/profile/:userId" element={<Profil />} />
			<Route path="/create-event" element={<PrivateRoute><CreateEventPage /></PrivateRoute>} />
			{/* <Route path="/all-events" element={<AllEvents />} />
			<Route path="*" element={<Navigate to="/" />} /> */}
		</Routes>
	);
}

export default App;