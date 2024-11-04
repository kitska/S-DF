import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/2-3.png';
import UserHandler from '../api/userHandler';
import { decodeToken } from '../utils/decodeJWT';

const Header = () => {
	const token = localStorage.getItem('token');
	const [userAvatar, setUserAvatar] = useState(null);
	const [login, setLogin] = useState(null);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		const fetchUserData = async () => {
			if (token) {
				const decodedTokenID = decodeToken(token);

				if (decodedTokenID) {
					try {
						const response = await UserHandler.getUserById(decodedTokenID);
						const avatarUrl = `${process.env.REACT_APP_BASE_URL}/${response.data.profile_picture}`;
						setUserAvatar(avatarUrl);
						setLogin(response.data.login);
						setUserId(response.data.id);
					} catch (error) {
						console.error('Ошибка при получении данных пользователя:', error);
					}
				}
			}
		};

		fetchUserData();
	}, [token]);

	return (
		<header className='fixed top-0 left-0 z-50 w-full py-4 bg-gray-900'>
			<div className='container flex items-center justify-between max-w-5xl p-2 mx-auto bg-gray-800 rounded-lg shadow-lg'>
				{/* Logo */}
				<div className='flex-shrink-0'>
					<a href='/'>
						<img src={logoImage} alt='Logo' className='w-auto h-8' />
					</a>
				</div>

				{/* Search Bar */}
				<div className='flex-grow mx-3'>
					<input type='text' placeholder='Search...' className='w-full p-1 text-white bg-gray-700 border border-gray-600 rounded-full' />
				</div>

				{/* User Avatar and Login Block */}
				<div className='flex items-center space-x-3'>
					{userAvatar ? (
						<Link to={`/user/${userId}`} className='flex items-center p-1 space-x-2 transition duration-200 rounded-lg hover:bg-gray-700'>
							<img src={userAvatar} alt='User Avatar' className='object-cover border-2 border-gray-500 rounded-full w-11 h-11' />
							<span className='font-semibold text-white'>{login}</span>
						</Link>
					) : (
						<Link to='/login'>
							<button className='px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600'>Log In</button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
