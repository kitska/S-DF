import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/users` || 'http://localhost:3001/api/users',
});

const UserHandler = {
	getAllUsers: async (page = 1, pageSize = 10, login = '', sortBy = 'id', sortOrder = 'asc') => {
		try {
			const response = await apiClient.get('/', {
				params: { page, pageSize, login, sortBy, sortOrder },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error when receiving a list of users:', error);
			throw {
				message: error.response?.data?.message || 'Error obtaining a user list',
				status: error.response?.status || 500,
			};
		}
	},

	getUserById: async userId => {
		try {
			const response = await apiClient.get(`/${userId}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving a user with ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `User receipt error with ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},

	getUserFavorites: async token => {
		try {
			const response = await apiClient.get('/favorites', {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error when receiving a favorites from user:', error);
			throw {
				message: error.response?.data?.message || 'Error obtaining a favorites from user',
				status: error.response?.status || 500,
			};
		}
	},

	getUserPosts: async userId => {
		try {
			const response = await apiClient.get(`/${userId}/posts`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when receiving user posts with ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `Error in obtaining user posts with ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},

	getUserLikedPosts: async userId => {
		try {
			const response = await apiClient.get(`/${userId}/liked-posts`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when getting a buck posts of the user with ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `Error in obtaining barking user posts with ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},

	createUser: async (userData, token) => {
		try {
			const response = await apiClient.post('/', userData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error when creating a user:', error);
			throw {
				message: error.response?.data?.message || 'User creation error',
				status: error.response?.status || 500,
			};
		}
	},

	updateAvatar: async (avatarFile, token) => {
		try {
			const formData = new FormData();
			formData.append('avatar', avatarFile);

			const response = await apiClient.patch('/avatar', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
				},
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Error when updating user avatar:', error);
			throw {
				message: error.response?.data?.message || 'Avatar update error',
				status: error.response?.status || 500,
			};
		}
	},

	updateUser: async (userId, userData, token) => {
		try {
			const response = await apiClient.patch(`/${userId}`, userData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when updating user with ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `User update error with ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},

	deleteUser: async (userId, token) => {
		try {
			const response = await apiClient.delete(`/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Error when removing the user with ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `User removal error with ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},
};

export default UserHandler;
