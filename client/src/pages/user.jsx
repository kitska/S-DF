import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import UserHandler from '../api/userHandler';
import { decodeToken } from '../utils/decodeJWT';

const UserProfilePage = () => {
	const { id } = useParams(); // Получаем ID пользователя из URL
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Получаем ID текущего пользователя из токена
	const currentUserId = decodeToken(localStorage.getItem('token'))?.id;

	// Проверяем, просматривает ли пользователь свой профиль
	const isOwnProfile = Number(id) === currentUserId;

	const fetchUserData = async userId => {
		try {
			const response = await UserHandler.getUserById(userId);
			if (response.status === 200) {
				setUser(response.data);
			} else {
				setError('Не удалось загрузить данные пользователя.');
			}
		} catch (error) {
			setError(error.message || 'Ошибка при загрузке профиля');
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchUserData(id);
		setLoading(false);
	}, [id]);

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6 bg-gray-500'>
					{loading && <p className='text-gray-300'>Загрузка профиля...</p>}
					{error && <p className='text-red-500'>{error}</p>}

					{user && (
						<div className='p-4 mb-6 bg-gray-800 rounded-lg shadow-md'>
							<h2 className='text-2xl font-semibold text-gray-100'>{isOwnProfile ? 'Мой профиль' : `Профиль пользователя ${user.full_name}`}</h2>
							<p className='text-gray-300'>Логин: {user.login}</p>
							<p className='text-gray-300'>Рейтинг: {user.rating}</p>
							<img src={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture}`} alt='Profile' className='w-32 h-32 mt-4 rounded-full' />
						</div>
					)}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default UserProfilePage;
