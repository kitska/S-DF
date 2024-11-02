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
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка при получении списка категорий:', error);
			throw {
				message: error.response?.data?.message || 'Error fetching categories',
				status: error.response?.status || 500,
			};
		}
	},

	// Получение категории по ID
	getCategoryById: async categoryId => {
		try {
			const response = await apiClient.get(`/${categoryId}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при получении категории с ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching category',
				status: error.response?.status || 500,
			};
		}
	},

	// Получение постов по категории
	getPostsByCategory: async categoryId => {
		try {
			const response = await apiClient.get(`/${categoryId}/posts`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при получении постов для категории с ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching posts for category',
				status: error.response?.status || 500,
			};
		}
	},

	// Создание категории
	createCategory: async (categoryData, token) => {
		try {
			const response = await apiClient.post('/', categoryData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка при создании категории:', error);
			throw {
				message: error.response?.data?.message || 'Error creating category',
				status: error.response?.status || 500,
			};
		}
	},

	// Обновление категории
	updateCategory: async (categoryId, categoryData, token) => {
		try {
			const response = await apiClient.patch(`/${categoryId}`, categoryData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при обновлении категории с ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error updating category',
				status: error.response?.status || 500,
			};
		}
	},

	// Удаление категории
	deleteCategory: async (categoryId, token) => {
		try {
			const response = await apiClient.delete(`/${categoryId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при удалении категории с ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting category',
				status: error.response?.status || 500,
			};
		}
	},
};

export default CategoryHandler;
