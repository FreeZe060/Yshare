import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// import useCategories from '../../../hooks/Categorie/useCategories';
// import useCreateCategorie from '../../../hooks/Categorie/useCreateCategorie';
// import useDeleteCategorie from '../../../hooks/Categorie/useDeleteCategorie';
// import useUpdateCategorie from '../../../hooks/Categorie/useUpdateCategorie';
import useClickOutside from '../../../hooks/Utils/useClickOutside';
import useSortedAndPaginatedData from '../../../hooks/Utils/useSortedAndPaginatedData';
import RowSkeleton from '../../SkeletonLoading/RowSkeleton';

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
    if (error) return <p className="text-red-600 font-medium">Erreur : {error}</p>;

    return (
        <div>
            <h1 className="text-2xl font-bold py-4 uppercase text-gray-800">Catégories</h1>

            <div className="flex justify-between mb-4">
                <button
                    onClick={onCreate}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow transition"
                >
                    <i className="fas fa-folder-plus mr-2" />
                    Ajouter une catégorie
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg shadow bg-white">
                <table className="w-full text-sm">
                    <thead ref={theadRef} className="bg-indigo-100 text-black">
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.field}
                                    className="py-3 px-6 text-left cursor-pointer"
                                    onClick={() => sort.toggleSort(col.field)}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium uppercase tracking-wide ${sort.sortField === col.field ? 'underline font-bold' : ''}`}>
                                            {col.label}
                                        </span>
                                        {sort.sortField === col.field && sortIcon(sort.sortDirection)}
                                    </div>
                                </th>
                            ))}
                            <th className="py-3 px-6 text-left">Actions</th>
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
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="py-3 px-6 text-gray-900 font-medium w-full">{cat.name}</td>
                                    <td className="py-3 px-6 text-gray-700 w-full">
                                        {categories.find(p => p.id === cat.parent_id)?.name || '–'}
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="flex space-x-3 items-center">
                                            <button onClick={() => onEdit(cat)} title="Modifier">
                                                <i className="fas fa-pen text-yellow-500 hover:scale-110 transition" />
                                            </button>
                                            <button onClick={() => onDelete(cat)} title="Supprimer">
                                                <i className="fas fa-trash text-red-500 hover:scale-110 transition" />
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