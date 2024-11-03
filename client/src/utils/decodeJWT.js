// src/utils/jwtUtils.js
import { jwtDecode } from 'jwt-decode';

export const decodeToken = token => {
	if (!token) {
		throw new Error('No token provided');
	}

	try {
		// Декодируем токен без проверки подписи
		const decoded = jwtDecode(token);
		return decoded ? decoded.id : null; // Возвращаем user_id
	} catch (error) {
		console.error('Ошибка декодирования токена:', error);
		return null; // Или можно бросить ошибку в зависимости от ваших потребностей
	}
};
