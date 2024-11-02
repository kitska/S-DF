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
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при получении комментария с ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching comment',
				status: error.response?.status || 500,
			};
		}
	},

	// Получение лайков для комментария
	getLikesForComment: async commentId => {
		try {
			const response = await apiClient.get(`/${commentId}/like`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при получении лайков для комментария с ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching likes for comment',
				status: error.response?.status || 500,
			};
		}
	},

	// Создание лайка для комментария
	createLikeForComment: async (commentId, likeData, token) => {
		try {
			const response = await apiClient.post(`/${commentId}/like`, likeData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при создании лайка для комментария с ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error creating like for comment',
				status: error.response?.status || 500,
			};
		}
	},

	// Обновление комментария
	updateComment: async (commentId, commentData, token) => {
		try {
			const response = await apiClient.patch(`/${commentId}`, commentData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при обновлении комментария с ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error updating comment',
				status: error.response?.status || 500,
			};
		}
	},

	// Удаление лайка для комментария
	deleteLikeForComment: async (commentId, token) => {
		try {
			const response = await apiClient.delete(`/${commentId}/like`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при удалении лайка для комментария с ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting like for comment',
				status: error.response?.status || 500,
			};
		}
	},

	// Удаление комментария
	deleteComment: async (commentId, token) => {
		try {
			const response = await apiClient.delete(`/${commentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при удалении комментария с ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting comment',
				status: error.response?.status || 500,
			};
		}
	},
};

export default CommentHandler;
