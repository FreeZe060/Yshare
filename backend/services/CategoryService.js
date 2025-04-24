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

    async createCategory(name) {
        try {
            const category = await Category.create({ name });
            return category;
        } catch (error) {
            throw new Error('Erreur lors de la création de la catégorie : ' + error.message);
        }
    }

    async updateCategory(id, name) {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Catégorie non trouvée');
            }
            category.name = name;
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