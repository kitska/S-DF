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
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка регистрации:', error);
			throw {
				message: error.response?.data?.message || 'Registration error',
				status: error.response?.status || 500,
			};
		}
	},

	// Вход пользователя
	loginUser: async loginData => {
		try {
			const response = await apiClient.post('/login', loginData);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка входа:', error);
			throw {
				message: error.response?.data?.message || 'Login error',
				status: error.response?.status || 500,
			};
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
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка выхода:', error);
			throw {
				message: error.response?.data?.message || 'Logout error',
				status: error.response?.status || 500,
			};
		}
	},

	// Отправка ссылки для сброса пароля
	sendPasswordResetLink: async email => {
		try {
			const response = await apiClient.post('/password-reset', { email });
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка отправки ссылки для сброса пароля:', error);
			throw {
				message: error.response?.data?.message || 'Password reset link error',
				status: error.response?.status || 500,
			};
		}
	},

	// Сброс пароля
	resetPassword: async (token, passwordData) => {
		try {
			const response = await apiClient.post(`/password-reset/${token}`, passwordData);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка сброса пароля:', error);
			throw {
				message: error.response?.data?.message || 'Password reset error',
				status: error.response?.status || 500,
			};
		}
	},

	// Подтверждение email
	confirmEmail: async token => {
		try {
			const response = await apiClient.get(`/confirm-email/${token}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Ошибка подтверждения email:', error);
			throw {
				message: error.response?.data?.message || 'Email confirmation error',
				status: error.response?.status || 500,
			};
		}
	},
};

export default AuthHandler;
