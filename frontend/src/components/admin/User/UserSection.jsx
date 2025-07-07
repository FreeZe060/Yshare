import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import useClickOutside from '../../../hooks/Utils/useClickOutside';
import useSortedAndPaginatedData from '../../../hooks/Utils/useSortedAndPaginatedData';

import RowSkeleton from '../../SkeletonLoading/RowSkeleton';
import NotFound from '../../../pages/NotFound';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/';


const sortIcon = (direction) =>
    direction === 'asc'
        ? <i className="text-gray-500 fas fa-sort-up" />
        : <i className="text-gray-500 fas fa-sort-down" />;

const LastUsersSection = ({
    users,
    loading,
    error,
    onSuspend,
    onDelete,
    onCreate,
    showAll = false,
    capitalizeFirstLetter,
    Link,
    AnimatePresence,
}) => {
    const theadRef = useRef();
    const {
        paginatedItems,
        sort,
        pagination
    } = useSortedAndPaginatedData(users || [], user => showAll || true, 8);

    useClickOutside(theadRef, () => sort.setSortField(null));

    if (loading) {
        return (
            <div className="flex flex-col justify-between bg-white shadow-md rounded-lg min-h-[600px] overflow-x-auto">
                <table className="w-full sm:text-xs text-sm whitespace-nowrap">
                    <thead className="bg-[#F6E2F2] text-[#BA28C0]">
                        <tr>
                            {['Nom', 'Email', 'Rôle', 'Statut', 'Actions'].map((field, i) => (
                                <th key={i} className={`text-left py-3 px-2 ${i === 0 ? 'rounded-l-lg' : ''}`}>{field}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
                    </tbody>
                </table>
            </div>
        );
    }
    if (error) return <NotFound/>;

    return (
        <div id="last-users">
            {!showAll && <h1 className="py-4 font-bold text-gray-800 uppercase">Derniers utilisateurs</h1>}

            <div className="flex justify-end mb-4">
                <button
                    onClick={onCreate}
                    className="bg-[#C72EBF] hover:bg-[#BA28C0] shadow px-4 py-2 rounded text-white transition"
                >
                    <i className="mr-2 fas fa-user-plus" />
                    Ajouter un utilisateur
                </button>
            </div>

            <div className="flex flex-col justify-between bg-white shadow-md rounded-lg min-h-[600px] overflow-x-auto">
                <table className="w-full sm:text-xs text-sm whitespace-nowrap">
                    <thead ref={theadRef} className="bg-[#F6E2F2] text-[#BA28C0]">
                        <tr>
                            {['name', 'email', 'role', 'status'].map((field, index) => (
                                <th
                                    key={field}
                                    className={`text-left py-3 px-2 cursor-pointer ${index === 0 ? 'rounded-l-lg' : ''}`}
                                    onClick={() => sort.toggleSort(field)}
                                >
                                    <span className="flex items-center gap-x-1.5 capitalize">
                                        {capitalizeFirstLetter(field)}
                                        {sort.sortField === field && sortIcon(sort.sortDirection)}
                                    </span>
                                </th>
                            ))}
                            <th className="px-2 py-3 rounded-r-lg text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedItems.map(user => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="hover:bg-gray-50 border-gray-200 border-b transition"
                                >
                                    <td className="px-2 py-3 font-bold text-gray-800">
                                        <div className="inline-flex items-center space-x-3">
                                            <Link to={`/profile/${user.id}`} title={`Voir le profil de ${user.name}`} className="flex items-center space-x-2 hover:text-[#C72EBF] transition">
                                                <img
                                                    className="rounded-full w-8 h-8 object-cover hover:scale-105 transition duration-200"
                                                    src={`${REACT_APP_API_BASE_URL}${user.profileImage || '/default-avatar.png'}`}
                                                    alt={`${user.name}`}
                                                />
                                                <span>{user.name} {user.lastname}</span>
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-2 py-3 text-gray-600">{user.email}</td>
                                    <td className="px-2 py-3 text-gray-600">{capitalizeFirstLetter(user.role)}</td>
                                    <td className={`py-3 px-2 font-medium ${user.status === 'Approved' ? 'text-green-600' : 'text-red-500'}`}>
                                        {capitalizeFirstLetter(user.status)}
                                    </td>
                                    <td className="px-2 py-3">
                                        <div className="inline-flex items-center space-x-3 text-[#B926C1] text-lg">
                                            <Link to={`/profile/${user.id}`} title="Voir profil" className="hover:text-[#BA28C0] transition">
                                                <i className="fas fa-pen" />
                                            </Link>
                                            <button
                                                onClick={() => onSuspend(user)}
                                                title={user.status === 'Suspended' ? 'Débannir' : 'Suspendre'}
                                                className={`transition ${user.status === 'Suspended' ? 'hover:text-green-600' : 'hover:text-yellow-600'}`}
                                            >
                                                <i className={`fas ${user.status === 'Suspended' ? 'fa-lock-open' : 'fa-ban'}`} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(user)}
                                                title="Supprimer"
                                                className="hover:text-red-600 transition"
                                            >
                                                <i className="fas fa-trash-alt" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 my-4">
                        {Array.from({ length: pagination.totalPages }).map((_, i) => (
                            <motion.button
                                key={i + 1}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => pagination.goToPage(i + 1)}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold transition
                                    ${pagination.page === i + 1
                                        ? 'bg-[#D232BE] text-white border-[#D232BE]'
                                        : 'border-[#D232BE] text-[#D232BE] hover:bg-blue-100'}`}
                            >
                                {i + 1}
                            </motion.button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LastUsersSection;