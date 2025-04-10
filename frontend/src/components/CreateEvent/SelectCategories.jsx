import React from "react";
import useCategories from "../../hooks/Categorie/useCategories";

const SelectCategories = ({ selected, onChange }) => {
  const { categories, loading, error } = useCategories();

  if (loading) return <p>Chargement des catégories...</p>;
  if (error) return <p className="text-red-500">Erreur : {error}</p>;

  return (
    <div className="w-full mb-6">
      <label className="block text-gray-700 font-medium mb-2">Catégorie</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
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