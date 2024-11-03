import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/2-3.png';
import UserHandler from '../api/userHandler';
import { decodeToken } from '../utils/decodeJWT';

const Header = () => {
	const token = localStorage.getItem('token'); // Получаем токен из локального хранилища
	const [userAvatar, setUserAvatar] = useState(null); // Состояние для хранения URL аватара пользователя

	useEffect(() => {
		const fetchUserData = async () => {
			if (token) {
				console.log('Токен:', token); // Проверка наличия токена
				const decodedTokenID = decodeToken(token); // Декодируем токен

				if (decodedTokenID) {
					try {
						const response = await UserHandler.getUserById(decodedTokenID);
						console.log('Ответ от сервера:', response.data); // Проверка ответа от сервера
						// Формируем полный URL для аватара пользователя
						const avatarUrl = `${process.env.REACT_APP_BASE_URL}/${response.data.profile_picture}`;
						console.log('URL аватара:', avatarUrl); // Проверка URL аватара
						setUserAvatar(avatarUrl); // Устанавливаем полный URL аватара
					} catch (error) {
						console.error('Ошибка при получении данных пользователя:', error);
					}
				}
			}
		};

		fetchUserData();
	}, [token]); // Запускаем эффект при изменении токена

	return (
		<header className='fixed top-0 left-0 z-50 w-full py-3 bg-gray-900'>
			<div className='container flex items-center justify-between max-w-5xl p-4 mx-auto bg-gray-800 rounded-lg shadow-lg'>
				{/* Logo */}
				<div className='flex-shrink-0'>
					<a href='/'>
						<img src={logoImage} alt='Logo' className='w-auto h-10' />
					</a>
				</div>

				{/* Search Bar */}
				<div className='flex-grow mx-4'>
					<input type='text' placeholder='Search...' className='w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-full' />
				</div>

				{/* Login Button or User Avatar */}
				<div>
					{userAvatar ? (
						<img src={userAvatar} alt='User Avatar' className='w-10 h-10 rounded-full' />
					) : (
						<Link to='/login'>
							<button className='px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600'>Log In</button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
