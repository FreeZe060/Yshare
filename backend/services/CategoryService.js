const { Category } = require('../models');

class CategoryService {
    async getAllCategories() {
        try {
            const categories = await Category.findAll();
            return categories;
        } catch (error) {
            throw new Error('Erreur lors de la récupération des catégories : ' + error.message);
        }
    }

    async createCategory({ name, parent_id = null, display_order = 0 }) {
        try {
            const category = await Category.create({ name, parent_id, display_order });
            return category;
        } catch (error) {
            throw new Error('Erreur lors de la création de la catégorie : ' + error.message);
        }
    }

    async updateCategory(id, { name, parent_id = null, display_order = 0 }) {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Catégorie non trouvée');
            }
            category.name = name;
            category.parent_id = parent_id;
            category.display_order = display_order;
            await category.save();
            return category;
        } catch (error) {
            throw new Error('Erreur lors de la mise à jour de la catégorie : ' + error.message);
        }
    }

    async deleteCategory(id) {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Catégorie non trouvée');
            }
            await category.destroy();
            return { message: "Catégorie supprimée avec succès." };
        } catch (error) {
            throw new Error('Erreur lors de la suppression de la catégorie : ' + error.message);
        }
    }
}

module.exports = new CategoryService();