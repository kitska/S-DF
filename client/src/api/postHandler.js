// client/src/api/PostHandler.js
import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/posts` || 'http://localhost:3001/api/posts',
});

const PostHandler = {
	// Получение всех постов с возможностью фильтрации и сортировки
	getAllPosts: async (page = 1, title = '', author_id = '', sortBy = 'id', sortOrder = 'asc') => {
		try {
			const response = await apiClient.get('/', {
				params: { page, title, author_id, sortby: sortBy, sortOrder },
			});
			return response.data;
		} catch (error) {
			console.error('Ошибка при получении списка постов:', error);
			throw error;
		}
	},

	// Получение поста по ID
	getPostById: async postId => {
		try {
			const response = await apiClient.get(`/${postId}`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Получение категорий для поста
	getCategoriesForPost: async postId => {
		try {
			const response = await apiClient.get(`/${postId}/categories`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении категорий для поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Получение комментариев для поста
	getCommentsForPost: async postId => {
		try {
			const response = await apiClient.get(`/${postId}/comments`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении комментариев для поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Получение лайков для поста
	getLikesForPost: async postId => {
		try {
			const response = await apiClient.get(`/${postId}/like`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении лайков для поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Создание поста
	createPost: async (postData, token) => {
		try {
			const response = await apiClient.post('/', postData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error('Ошибка при создании поста:', error);
			throw error;
		}
	},

	// Создание комментария для поста
	createCommentForPost: async (postId, commentData, token) => {
		try {
			const response = await apiClient.post(`/${postId}/comments`, commentData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при создании комментария для поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Создание лайка для поста
	createLikeForPost: async (postId, likeData, token) => {
		try {
			const response = await apiClient.post(`/${postId}/like`, likeData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при создании лайка для поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Добавление поста в избранное
	addPostToFavourites: async (postId, token) => {
		try {
			const response = await apiClient.post(
				`/${postId}/favourite`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при добавлении поста с ID ${postId} в избранное:`, error);
			throw error;
		}
	},

	// Обновление поста
	updatePost: async (postId, postData, token) => {
		try {
			const response = await apiClient.patch(`/${postId}`, postData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при обновлении поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Удаление лайка для поста
	deleteLikeForPost: async (postId, token) => {
		try {
			const response = await apiClient.delete(`/${postId}/like`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при удалении лайка для поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Удаление поста
	deletePost: async (postId, token) => {
		try {
			const response = await apiClient.delete(`/${postId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при удалении поста с ID ${postId}:`, error);
			throw error;
		}
	},

	// Удаление поста из избранного
	deletePostFromFavourites: async (postId, token) => {
		try {
			const response = await apiClient.delete(`/${postId}/favourite`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при удалении поста с ID ${postId} из избранного:`, error);
			throw error;
		}
	},
};

export default PostHandler;
