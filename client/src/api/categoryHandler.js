import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/categories` || 'http://localhost:3001/api/categories',
});

const CategoryHandler = {
	getAllCategories: async (page = 1, pageSize = 10, title = '', sortBy = 'id', sortOrder = 'asc') => {
		try {
			const response = await apiClient.get('/', {
				params: { page, pageSize, title, sortby: sortBy, sortOrder },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error when receiving a list of categories:', error);
			throw {
				message: error.response?.data?.message || 'Error fetching categories',
				status: error.response?.status || 500,
			};
		}
	},

	getCategoryById: async categoryId => {
		try {
			const response = await apiClient.get(`/${categoryId}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving a category with ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching category',
				status: error.response?.status || 500,
			};
		}
	},

	getPostsByCategory: async categoryId => {
		try {
			const response = await apiClient.get(`/${categoryId}/posts`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving posts for category with ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching posts for category',
				status: error.response?.status || 500,
			};
		}
	},

	createCategory: async (categoryData, token) => {
		try {
			const response = await apiClient.post('/', categoryData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error in creating a category:', error);
			throw {
				message: error.response?.data?.message || 'Error creating category',
				status: error.response?.status || 500,
			};
		}
	},

	updateCategory: async (categoryId, categoryData, token) => {
		try {
			const response = await apiClient.patch(`/${categoryId}`, categoryData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when updating category with ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error updating category',
				status: error.response?.status || 500,
			};
		}
	},

	deleteCategory: async (categoryId, token) => {
		try {
			const response = await apiClient.delete(`/${categoryId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when removing category with ID ${categoryId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting category',
				status: error.response?.status || 500,
			};
		}
	},
};

export default CategoryHandler;
