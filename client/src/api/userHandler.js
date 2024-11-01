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
			return response.data;
		} catch (error) {
			console.error('Ошибка при получении списка пользователей:', error);
			throw error;
		}
	},

	// Получение пользователя по ID
	getUserById: async userId => {
		try {
			const response = await apiClient.get(`/${userId}`);
			return response.data;
		} catch (error) {
			console.error(`Ошибка при получении пользователя с ID ${userId}:`, error);
			throw error;
		}
	},

	// Получение избранных элементов пользователя
	getUserFavourites: async token => {
		try {
			const response = await apiClient.get('/favourites', {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error('Ошибка при получении избранного пользователя:', error);
			throw error;
		}
	},

	// Создание пользователя (админ)
	createUser: async (userData, token) => {
		try {
			const response = await apiClient.post('/', userData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error('Ошибка при создании пользователя:', error);
			throw error;
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
			return response.data;
		} catch (error) {
			console.error('Ошибка при обновлении аватара пользователя:', error);
			throw error;
		}
	},

	// Обновление данных пользователя (админ/пользователь)
	updateUser: async (userId, userData, token) => {
		try {
			const response = await apiClient.patch(`/${userId}`, userData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при обновлении пользователя с ID ${userId}:`, error);
			throw error;
		}
	},

	// Удаление пользователя (админ/пользователь)
	deleteUser: async (userId, token) => {
		try {
			const response = await apiClient.delete(`/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			return response.data;
		} catch (error) {
			console.error(`Ошибка при удалении пользователя с ID ${userId}:`, error);
			throw error;
		}
	},
};

export default UserHandler;
