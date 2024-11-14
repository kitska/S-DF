import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
	if (!token) {
		console.error('No token provided');
		return null;
	}

	try {
		const decoded = jwtDecode(token);
		return decoded ? { id: decoded.id, role: decoded.role } : null;
	} catch (error) {
		console.error('Token decoding error:', error);
		return null;
	}
};