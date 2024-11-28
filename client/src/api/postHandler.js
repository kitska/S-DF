import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/posts` || 'http://localhost:3001/api/posts',
});

const PostHandler = {
	getAllPosts: async (page = 1, title = '', author_id = '', sortBy = 'id', sortOrder = 'asc') => {
		try {
			const response = await apiClient.get('/', {
				params: { page, title, author_id, sortby: sortBy, sortOrder },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error when receiving a list of posts:', error);
			throw {
				message: error.response?.data?.message || 'Error fetching posts',
				status: error.response?.status || 500,
			};
		}
	},

	getPostById: async postId => {
		try {
			const response = await apiClient.get(`/${postId}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving a post with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching post',
				status: error.response?.status || 500,
			};
		}
	},

	getCategoriesForPost: async postId => {
		try {
			const response = await apiClient.get(`/${postId}/categories`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving categories for post with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching post categories',
				status: error.response?.status || 500,
			};
		}
	},

	getCommentsForPost: async postId => {
		try {
			const response = await apiClient.get(`/${postId}/comments`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving comments for fasting with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching post comments',
				status: error.response?.status || 500,
			};
		}
	},

	getLikesAndDislikesForPost: async (postId, type, authorId) => {
		try {
			const params = { type };

			if (authorId) {
				params.author_id = authorId;
			}

			const response = await apiClient.get(`/${postId}/like`, {
				params,
			});

			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving likes and dislikes for fasting with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error fetching post likes and dislikes',
				status: error.response?.status || 500,
			};
		}
	},

	createPost: async (postData, token) => {
		try {
			const response = await apiClient.post('/', postData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error in creating a post:', error);
			throw {
				message: error.response?.data?.message || 'Error creating post',
				status: error.response?.status || 500,
			};
		}
	},

	createCommentForPost: async (postId, commentData, token) => {
		try {
			const response = await apiClient.post(`/${postId}/comments`, commentData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error in creating a comment for fasting with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error creating comment for post',
				status: error.response?.status || 500,
			};
		}
	},

	createLikeForPost: async (postId, likeData, token) => {
		try {
			const response = await apiClient.post(`/${postId}/like`, likeData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error in creating likes with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error creating like for post',
				status: error.response?.status || 500,
			};
		}
	},

	addPostToFavorites: async (postId, token) => {
		try {
			const response = await apiClient.post(
				`/${postId}/favorite`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`An error when adding a post with ID ${postId} to favorites:`, error);
			throw {
				message: error.response?.data?.message || 'Error adding post to favorites',
				status: error.response?.status || 500,
			};
		}
	},

	updatePost: async (postId, postData, token) => {
		try {
			const response = await apiClient.patch(`/${postId}`, postData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when updating the post with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error updating post',
				status: error.response?.status || 500,
			};
		}
	},

	deleteLikeForPost: async (postId, token) => {
		try {
			const response = await apiClient.delete(`/${postId}/like`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when removing likes with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting like for post',
				status: error.response?.status || 500,
			};
		}
	},

	deletePost: async (postId, token) => {
		try {
			const response = await apiClient.delete(`/${postId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when deleting a post with ID ${postId}:`, error);
			throw {
				message: error.response?.data?.message || 'Error deleting post',
				status: error.response?.status || 500,
			};
		}
	},

	deletePostFromFavorites: async (postId, token) => {
		try {
			const response = await apiClient.delete(`/${postId}/favorite`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when deleting a post with ID ${postId} from favorites:`, error);
			throw {
				message: error.response?.data?.message || 'Error removing post from favorites',
				status: error.response?.status || 500,
			};
		}
	},
};

export default PostHandler;
