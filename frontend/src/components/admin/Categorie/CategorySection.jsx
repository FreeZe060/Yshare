import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// import useCategories from '../../../hooks/Categorie/useCategories';
// import useCreateCategorie from '../../../hooks/Categorie/useCreateCategorie';
// import useDeleteCategorie from '../../../hooks/Categorie/useDeleteCategorie';
// import useUpdateCategorie from '../../../hooks/Categorie/useUpdateCategorie';
import useClickOutside from '../../../hooks/Utils/useClickOutside';
import useSortedAndPaginatedData from '../../../hooks/Utils/useSortedAndPaginatedData';
import RowSkeleton from '../../SkeletonLoading/RowSkeleton';
import NotFound from '../../../pages/NotFound';

const sortIcon = (dir) =>
    dir === 'asc' ? <i className="fas fa-sort-up" /> : <i className="fas fa-sort-down" />;

const CategorySection = ({ categories, loading, error, onCreate, onEdit, onDelete }) => {
    const theadRef = useRef();
    const [filterParent, setFilterParent] = useState(null);

    const filtered = filterParent
        ? categories.filter(cat => cat.parent_id === filterParent)
        : categories;

    const { paginatedItems, sort, pagination } = useSortedAndPaginatedData(filtered || [], () => true, 8);
    useClickOutside(theadRef, () => sort.setSortField(null));

    // const handleCreate = async () => {
    //     const parentOptions = categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
    //     const { value: formValues } = await MySwal.fire({
    //         title: 'Ajouter une catégorie',
    //         html: `
    //             <input id="swal-input-name" class="swal2-input" placeholder="Nom de la catégorie">
    //             <select id="swal-input-parent" class="swal2-select">
    //                 <option value="">Aucune catégorie parent</option>
    //                 ${parentOptions}
    //             </select>
    //         `,
    //         focusConfirm: false,
    //         showCancelButton: true,
    //         preConfirm: () => {
    //             const name = document.getElementById('swal-input-name').value.trim();
    //             const parent_id = document.getElementById('swal-input-parent').value || null;
    //             if (!name) return Swal.showValidationMessage('Le nom est requis');
    //             return { name, parent_id };
    //         }
    //     });

    //     if (formValues) {
    //         try {
    //             await create(formValues);
    //             toast('Catégorie créée avec succès');
    //             refetch();
    //         } catch (err) {
    //             Swal.fire('Erreur', err.message, 'error');
    //         }
    //     }
    // };

    // const handleEdit = async (cat) => {
    //     const parentOptions = categories
    //         .filter(c => c.id !== cat.id)
    //         .map(c => `<option value="${c.id}" ${c.id === cat.parent_id ? 'selected' : ''}>${c.name}</option>`)
    //         .join('');

    //     const { value: formValues } = await MySwal.fire({
    //         title: 'Modifier la catégorie',
    //         html: `
    //             <input id="swal-input-name" class="swal2-input" value="${cat.name}">
    //             <select id="swal-input-parent" class="swal2-select">
    //                 <option value="">Aucune catégorie parent</option>
    //                 ${parentOptions}
    //             </select>
    //         `,
    //         focusConfirm: false,
    //         showCancelButton: true,
    //         preConfirm: () => {
    //             const name = document.getElementById('swal-input-name').value.trim();
    //             const parent_id = document.getElementById('swal-input-parent').value || null;
    //             if (!name) return Swal.showValidationMessage('Le nom est requis');
    //             return { name, parent_id };
    //         }
    //     });

    //     if (formValues && (formValues.name !== cat.name || formValues.parent_id !== cat.parent_id)) {
    //         try {
    //             await update(cat.id, formValues);
    //             toast('Catégorie modifiée avec succès');
    //             refetch();
    //         } catch (err) {
    //             Swal.fire('Erreur', err.message, 'error');
    //         }
    //     }
    // };

    // const handleDelete = async (cat) => {
    //     const result = await Swal.fire({
    //         title: 'Supprimer cette catégorie ?',
    //         text: cat.name,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Oui, supprimer',
    //         cancelButtonText: 'Annuler',
    //     });
    //     if (result.isConfirmed) {
    //         try {
    //             await remove(cat.id);
    //             toast('Catégorie supprimée avec succès');
    //             refetch();
    //         } catch (err) {
    //             Swal.fire('Erreur', err.message, 'error');
    //         }
    //     }
    // };

    const columns = [
        { label: 'Nom', field: 'name' },
        { label: 'Parent', field: 'parent_id' }
    ];

    if (loading) return <RowSkeleton count={6} />;
    if (error) return <NotFound/>;

    return (
        <div>
            <h1 className="py-4 font-bold text-gray-800 text-2xl uppercase">Catégories</h1>

            <div className="flex justify-between mb-4">
                <button
                    onClick={onCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 shadow px-4 py-2 rounded text-white transition"
                >
                    <i className="mr-2 fas fa-folder-plus" />
                    Ajouter une catégorie
                </button>
            </div>

            <div className="bg-white shadow rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                    <thead ref={theadRef} className="bg-indigo-100 text-black">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className="px-6 py-3 text-left cursor-pointer"
                                    onClick={() => sort.toggleSort(col.field)}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className={`font-medium uppercase tracking-wide ${sort.sortField === col.field ? 'underline font-bold' : ''}`}>
                                            {col.label}
                                        </span>
                                        {sort.sortField === col.field && sortIcon(sort.sortDirection)}
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {paginatedItems.map(cat => (
                                <motion.tr
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="hover:bg-gray-50 border-gray-200 border-b"
                                >
                                    <td className="px-6 py-3 w-full font-medium text-gray-900">{cat.name}</td>
                                    <td className="px-6 py-3 w-full text-gray-700">
                                        {categories.find(p => p.id === cat.parent_id)?.name || '–'}
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center space-x-3">
                                            <button onClick={() => onEdit(cat)} title="Modifier">
                                                <i className="text-yellow-500 hover:scale-110 transition fas fa-pen" />
                                            </button>
                                            <button onClick={() => onDelete(cat)} title="Supprimer">
                                                <i className="text-red-500 hover:scale-110 transition fas fa-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center py-4">
                        {Array.from({ length: pagination.totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => pagination.goToPage(i + 1)}
                                className={`mx-1 px-3 py-1 rounded-full text-sm font-medium transition border
                                    ${pagination.page === i + 1
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'text-indigo-600 border-indigo-300 hover:bg-indigo-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategorySection;