import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;
    if (user?.role !== "Administrateur") return <Navigate to="/" />;

    return children;
};

export default AdminRoute;