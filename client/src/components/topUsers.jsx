// src/components/TopUsers.jsx
import React from 'react';
import User from './UI/user';

const TopUsers = () => {
	// Массив с данными пользователей
	const users = [
		{
			fullName: 'Иван Иванов',
			profilePicture: 'path/to/ivan.jpg', // Замените на реальный путь к изображению
			rating: 10,
		},
		{
			fullName: 'Мария Петрова',
			profilePicture: 'path/to/maria.jpg', // Замените на реальный путь к изображению
			rating: -3,
		},
		{
			fullName: 'Сергей Сидоров',
			profilePicture: 'path/to/sergey.jpg', // Замените на реальный путь к изображению
			rating: 0,
		},
		{
			fullName: 'Анна Смирнова',
			profilePicture: 'path/to/anna.jpg', // Замените на реальный путь к изображению
			rating: 5,
		},
		{
			fullName: 'Дмитрий Ковалев',
			profilePicture: 'path/to/dmitry.jpg', // Замените на реальный путь к изображению
			rating: -1,
		},
	];

	const getMedalStyle = index => {
		switch (index) {
			case 0:
				return 'text-yellow-500'; // Золото
			case 1:
				return 'text-gray-300'; // Серебро
			case 2:
				return 'text-orange-500'; // Бронза
			default:
				return 'text-gray-200'; // Обычный цвет
		}
	};

	return (
		<aside className='w-1/6 p-6 bg-gray-600 shadow-lg min-h-max'>
			<div className='flex flex-col space-y-4'>
				{users.map((user, index) => (
					<div key={index} className='flex items-center overflow-hidden'>
						<span className={`place w-6 mr-2 text-center ${getMedalStyle(index)}`}>{index + 1}</span> {/* Место пользователя */}
						<div className='flex items-center overflow-hidden'>
							<User
								fullName={user.fullName.length > 15 ? `${user.fullName.slice(0, 15)}...` : user.fullName}
								profilePicture={user.profilePicture}
								rating={user.rating}
							/>
						</div>
					</div>
				))}
			</div>
		</aside>
	);
};

export default TopUsers;
