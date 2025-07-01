import React from "react";
import useCategories from "../../hooks/Categorie/useCategories";

import NotFound from '../../pages/NotFound';

const SelectCategories = ({ selected, onChange }) => {
    const { categories, loading, error } = useCategories();

    // if (loading) return <p>Chargement des catégories...</p>;
    if (error) return <NotFound/>;

    return (
        <div className="mb-6 w-full">
            <label className="block mb-2 font-medium text-gray-700">Catégorie</label>
            <select
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectCategories;