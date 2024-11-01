// client/src/api/CategoryHandler.js
import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/categories` || 'http://localhost:3001/api/categories',
});

const CategoryHandler = {
	// Получение всех категорий с параметрами фильтрации и сортировки
	getAllCategories: async (page = 1, title = '', sortBy = 'id', sortOrder = 'asc') => {
		try {
			const response = await apiClient.get('/', {
				params: { page, title, sortby: sortBy, sortOrder },
			});
			return response.data;
		} catch (error) {
			console.error('Ошибка при получении списка категорий:', error);
			throw error;
		}
	},

	// Получение категории по ID
	getCategoryById: async categoryId => {
		try {
			const response = await apiClient.get(`/${categoryId}`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении категории с ID ${categoryId}:`, error);
			throw error;
		}
	},

	// Получение постов по категории
	getPostsByCategory: async categoryId => {
		try {
			const response = await apiClient.get(`/${categoryId}/posts`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении постов для категории с ID ${categoryId}:`, error);
			throw error;
		}
	},

	// Создание категории
	createCategory: async (categoryData, token) => {
		try {
			const response = await apiClient.post('/', categoryData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error('Ошибка при создании категории:', error);
			throw error;
		}
	},

	// Обновление категории
	updateCategory: async (categoryId, categoryData, token) => {
		try {
			const response = await apiClient.patch(`/${categoryId}`, categoryData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при обновлении категории с ID ${categoryId}:`, error);
			throw error;
		}
	},

	// Удаление категории
	deleteCategory: async (categoryId, token) => {
		try {
			const response = await apiClient.delete(`/${categoryId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при удалении категории с ID ${categoryId}:`, error);
			throw error;
		}
	},
};

export default CategoryHandler;
