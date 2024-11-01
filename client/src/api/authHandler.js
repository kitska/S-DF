// client/src/api/authHandler.js
import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/auth` || 'http://localhost:3001/api/auth',
});

const AuthHandler = {
	// Регистрация пользователя
	registerUser: async userData => {
		try {
			const response = await apiClient.post('/register', userData);
			return response.data;
		} catch (error) {
			console.error('Ошибка регистрации:', error);
			throw error;
		}
	},

	// Вход пользователя
	loginUser: async loginData => {
		try {
			const response = await apiClient.post('/login', loginData);
			return response.data;
		} catch (error) {
			console.error('Ошибка входа:', error);
			throw error;
		}
	},

	// Выход пользователя
	logoutUser: async token => {
		try {
			const response = await apiClient.post(
				'/logout',
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			return response.data;
		} catch (error) {
			console.error('Ошибка выхода:', error);
			throw error;
		}
	},

	// Отправка ссылки для сброса пароля
	sendPasswordResetLink: async email => {
		try {
			const response = await apiClient.post('/password-reset', { email });
			return response.data;
		} catch (error) {
			console.error('Ошибка отправки ссылки для сброса пароля:', error);
			throw error;
		}
	},

	// Сброс пароля
	resetPassword: async (token, passwordData) => {
		try {
			const response = await apiClient.post(`/password-reset/${token}`, passwordData);
			return response.data;
		} catch (error) {
			console.error('Ошибка сброса пароля:', error);
			throw error;
		}
	},

	// Подтверждение email
	confirmEmail: async token => {
		try {
			const response = await apiClient.get(`/confirm-email/${token}`);
			return response.data;
		} catch (error) {
			console.error('Ошибка подтверждения email:', error);
			throw error;
		}
	},
};

export default AuthHandler;
