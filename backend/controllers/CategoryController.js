const categoryService = require('../services/CategoryService');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrateur') {
      return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent créer des catégories." });
    }

    const { name, parent_id, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Le nom de la catégorie est requis." });
    }

    const newCategory = await categoryService.createCategory({ name, parent_id, display_order });
    res.status(201).json({ message: "Catégorie créée avec succès.", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrateur') {
      return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent modifier des catégories." });
    }

    const { id } = req.params;
    const { name, parent_id, display_order } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Le nom de la catégorie est requis pour la mise à jour." });
    }

    const updatedCategory = await categoryService.updateCategory(id, { name, parent_id, display_order });
    res.status(200).json({ message: "Catégorie mise à jour avec succès.", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'Administrateur') {
      return res.status(403).json({ message: "Accès interdit. Seuls les administrateurs peuvent supprimer des catégories." });
    }

    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};