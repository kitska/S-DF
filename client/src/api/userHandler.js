// src/api/UserHandler.js
import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/users` || 'http://localhost:3001/api/users',
});

const UserHandler = {
	// Получение всех пользователей с параметрами фильтрации и сортировки
	getAllUsers: async (page = 1, login = '', sortBy = 'id', sortOrder = 'asc') => {
		try {
			const response = await apiClient.get('/', {
				params: { page, login, sortby: sortBy, sortOrder },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка при получении списка пользователей:', error);
			throw {
				message: error.response?.data?.message || 'Ошибка получения списка пользователей',
				status: error.response?.status || 500,
			};
		}
	},

	// Получение пользователя по ID
	getUserById: async userId => {
		try {
			const response = await apiClient.get(`/${userId}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при получении пользователя с ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `Ошибка получения пользователя с ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},

	// Получение избранных элементов пользователя
	getUserFavourites: async token => {
		try {
			const response = await apiClient.get('/favourites', {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка при получении избранного пользователя:', error);
			throw {
				message: error.response?.data?.message || 'Ошибка получения избранного пользователя',
				status: error.response?.status || 500,
			};
		}
	},

	// Создание пользователя (админ)
	createUser: async (userData, token) => {
		try {
			const response = await apiClient.post('/', userData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка при создании пользователя:', error);
			throw {
				message: error.response?.data?.message || 'Ошибка создания пользователя',
				status: error.response?.status || 500,
			};
		}
	},

	// Обновление аватара пользователя
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
			console.error('Ошибка при обновлении аватара пользователя:', error);
			throw {
				message: error.response?.data?.message || 'Ошибка обновления аватара',
				status: error.response?.status || 500,
			};
		}
	},

	// Обновление данных пользователя (админ/пользователь)
	updateUser: async (userId, userData, token) => {
		try {
			const response = await apiClient.patch(`/${userId}`, userData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при обновлении пользователя с ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `Ошибка обновления пользователя с ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},

	// Удаление пользователя (админ/пользователь)
	deleteUser: async (userId, token) => {
		try {
			const response = await apiClient.delete(`/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error(`Ошибка при удалении пользователя с ID ${userId}:`, error);
			throw {
				message: error.response?.data?.message || `Ошибка удаления пользователя с ID ${userId}`,
				status: error.response?.status || 500,
			};
		}
	},
};

export default UserHandler;
