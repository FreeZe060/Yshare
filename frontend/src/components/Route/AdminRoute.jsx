import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../config/authHeader';
import Swal from 'sweetalert2';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;
        if (user?.role !== "Administrateur") {
          Swal.fire({
            icon: 'warning',
            title: 'Accès refusé',
            text: 'Vous n’avez pas accès à cette page',
            confirmButtonText: 'Retour à l’accueil',
          }).then(() => {
            navigate('/');
          });
        }
    }, [user, loading, navigate]);

    return user ? children : null;
};

export default AdminRoute;