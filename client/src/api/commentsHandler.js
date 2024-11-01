// client/src/api/CommentHandler.js
import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/comments` || 'http://localhost:3001/api/comments',
});

const CommentHandler = {
	// Получение комментария по ID
	getCommentById: async commentId => {
		try {
			const response = await apiClient.get(`/${commentId}`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении комментария с ID ${commentId}:`, error);
			throw error;
		}
	},

	// Получение лайков для комментария
	getLikesForComment: async commentId => {
		try {
			const response = await apiClient.get(`/${commentId}/like`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении лайков для комментария с ID ${commentId}:`, error);
			throw error;
		}
	},

	// Создание лайка для комментария
	createLikeForComment: async (commentId, likeData, token) => {
		try {
			const response = await apiClient.post(`/${commentId}/like`, likeData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при создании лайка для комментария с ID ${commentId}:`, error);
			throw error;
		}
	},

	// Обновление комментария
	updateComment: async (commentId, commentData, token) => {
		try {
			const response = await apiClient.patch(`/${commentId}`, commentData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при обновлении комментария с ID ${commentId}:`, error);
			throw error;
		}
	},

	// Удаление лайка для комментария
	deleteLikeForComment: async (commentId, token) => {
		try {
			const response = await apiClient.delete(`/${commentId}/like`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при удалении лайка для комментария с ID ${commentId}:`, error);
			throw error;
		}
	},

	// Удаление комментария
	deleteComment: async (commentId, token) => {
		try {
			const response = await apiClient.delete(`/${commentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при удалении комментария с ID ${commentId}:`, error);
			throw error;
		}
	},
};

export default CommentHandler;
