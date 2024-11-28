import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/comments` || 'http://localhost:3001/api/comments',
});

const CommentHandler = {
	getCommentById: async commentId => {
		try {
			const response = await apiClient.get(`/${commentId}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving a comment with ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching comment',
				status: error.response?.status || 500,
			};
		}
	},

	getLikesForComment: async (commentId, likeType, authorId) => {
		try {
			const response = await apiClient.get(`/${commentId}/like`, {
				params: { type: likeType, author_id: authorId },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving likes for comment with ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching likes for comment',
				status: error.response?.status || 500,
			};
		}
	},

	createLikeForComment: async (commentId, likeData, token) => {
		try {
			const response = await apiClient.post(`/${commentId}/like`, likeData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error in creating a like for comment with ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error creating like for comment',
				status: error.response?.status || 500,
			};
		}
	},

	replyToComment: async (commentId, replyData, token) => {
		try {
			const response = await apiClient.post(`/${commentId}/reply`, replyData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when answering a comment with ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error replying to comment',
				status: error.response?.status || 500,
			};
		}
	},

	updateComment: async (commentId, commentData, token) => {
		try {
			const response = await apiClient.patch(`/${commentId}`, commentData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when updating the comment with ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error updating comment',
				status: error.response?.status || 500,
			};
		}
	},

	deleteLikeForComment: async (commentId, token) => {
		try {
			const response = await apiClient.delete(`/${commentId}/like`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when removing likes for comment with ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting like for comment',
				status: error.response?.status || 500,
			};
		}
	},

	deleteComment: async (commentId, token) => {
		try {
			const response = await apiClient.delete(`/${commentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when deleting a comment with ID ${commentId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting comment',
				status: error.response?.status || 500,
			};
		}
	},
};

export default CommentHandler;
