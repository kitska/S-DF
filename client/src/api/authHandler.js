import axios from 'axios';

const apiClient = axios.create({
	baseURL: `${process.env.REACT_APP_BASE_URL}/auth` || 'http://localhost:3001/api/auth',
});

const AuthHandler = {
	registerUser: async userData => {
		try {
			const response = await apiClient.post('/register', userData);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Registration error:', error);
			throw {
				message: error.response?.data?.message || 'Registration error',
				status: error.response?.status || 500,
			};
		}
	},

	loginUser: async loginData => {
		try {
			const response = await apiClient.post('/login', loginData);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Entrance error:', error);
			throw {
				message: error.response?.data?.message || 'Login error',
				status: error.response?.status || 500,
			};
		}
	},

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
			console.error('Exit error:', error);
			throw {
				message: error.response?.data?.message || 'Logout error',
				status: error.response?.status || 500,
			};
		}
	},

	sendPasswordResetLink: async email => {
		try {
			const response = await apiClient.post('/password-reset', { email });
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Password reset error:', error);
			throw {
				message: error.response?.data?.message || 'Password reset link error',
				status: error.response?.status || 500,
			};
		}
	},

	resetPassword: async (token, passwordData) => {
		try {
			const response = await apiClient.post(`/password-reset/${token}`, passwordData);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Password reset error:', error);
			throw {
				message: error.response?.data?.message || 'Password reset error',
				status: error.response?.status || 500,
			};
		}
	},

	confirmEmail: async token => {
		try {
			const response = await apiClient.get(`/confirm-email/${token}`);
			return { data: response.data, status: response.status };
		} catch (error) {
			console.error('Email confirmation error:', error);
			throw {
				message: error.response?.data?.message || 'Email confirmation error',
				status: error.response?.status || 500,
			};
		}
	},
};

export default AuthHandler;
