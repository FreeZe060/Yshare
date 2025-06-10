import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../config/authHeader';
import Swal from 'sweetalert2';

const PrivateRoute = ({ children }) => {
	const { isAuthenticated, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			Swal.fire({
				icon: 'warning',
				title: 'Accès refusé',
				text: 'Vous devez être connecté pour accéder à cette page',
				confirmButtonText: 'Retour à l’accueil',
			}).then(() => {
				navigate('/');
			});
		}
	}, [isAuthenticated, loading, navigate]);

	return isAuthenticated ? children : null;
};

export default PrivateRoute;