const { Category } = require('../models');

class CategoryService {
    async getAllCategories() {
        console.log('[getAllCategories] ➤ Récupération de toutes les catégories');

        try {
            const categories = await Category.findAll();
            console.log(`[getAllCategories] ✅ ${categories.length} catégorie(s) récupérée(s)`);
            return categories;
        } catch (error) {
            console.error('[getAllCategories] ❌ Erreur :', error.message);
            throw new Error('Erreur lors de la récupération des catégories : ' + error.message);
        }
    }

    async createCategory({ name, parent_id = null, display_order = 0 }) {
        console.log('[createCategory] ➤ Création d\'une catégorie avec les valeurs :', {
            name,
            parent_id,
            display_order
        });

        try {
            const category = await Category.create({ name, parent_id, display_order });
            console.log('[createCategory] ✅ Catégorie créée avec ID =', category.id);
            return category;
        } catch (error) {
            console.error('[createCategory] ❌ Erreur :', error.message);
            throw new Error('Erreur lors de la création de la catégorie : ' + error.message);
        }
    }

    async updateCategory(id, { name, parent_id = null, display_order = 0 }) {
        console.log('[updateCategory] ➤ Mise à jour de la catégorie ID =', id);

        try {
            const category = await Category.findByPk(id);
            if (!category) {
                console.warn('[updateCategory] ❌ Catégorie non trouvée');
                throw new Error('Catégorie non trouvée');
            }

            console.log('[updateCategory] ➤ Ancienne valeur :', {
                name: category.name,
                parent_id: category.parent_id,
                display_order: category.display_order
            });

            category.name = name;
            category.parent_id = parent_id;
            category.display_order = display_order;
            await category.save();

            console.log('[updateCategory] ✅ Catégorie mise à jour :', {
                id: category.id,
                name: category.name,
                parent_id: category.parent_id,
                display_order: category.display_order
            });

            return category;
        } catch (error) {
            console.error('[updateCategory] ❌ Erreur :', error.message);
            throw new Error('Erreur lors de la mise à jour de la catégorie : ' + error.message);
        }
    }

    async deleteCategory(id) {
        console.log('[deleteCategory] ➤ Suppression de la catégorie ID =', id);

        try {
            const category = await Category.findByPk(id);
            if (!category) {
                console.warn('[deleteCategory] ❌ Catégorie non trouvée');
                throw new Error('Catégorie non trouvée');
            }

            await category.destroy();
            console.log('[deleteCategory] ✅ Catégorie supprimée avec succès');
            return { message: "Catégorie supprimée avec succès." };
        } catch (error) {
            console.error('[deleteCategory] ❌ Erreur :', error.message);
            throw new Error('Erreur lors de la suppression de la catégorie : ' + error.message);
        }
    }
}

module.exports = new CategoryService();