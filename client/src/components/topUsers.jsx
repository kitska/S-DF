// src/components/TopUsers.jsx
import React from 'react';
import User from './UI/user';

const TopUsers = () => {
	// Массив с данными пользователей
	const users = [
		{
			fullName: 'Иван Иванов',
			profilePicture: 'path/to/ivan.jpg',
			rating: 10,
		},
		{
			fullName: 'Мария Петрова',
			profilePicture: 'path/to/maria.jpg',
			rating: -3,
		},
		{
			fullName: 'Сергей Сидоров',
			profilePicture: 'path/to/sergey.jpg',
			rating: 0,
		},
		{
			fullName: 'Анна Смирнова',
			profilePicture: 'path/to/anna.jpg',
			rating: 5,
		},
		{
			fullName: 'Дмитрий Ковалев',
			profilePicture: 'path/to/dmitry.jpg',
			rating: -1,
		},
	];

	const getMedalStyle = index => {
		switch (index) {
			case 0:
				return 'text-yellow-500';
			case 1:
				return 'text-gray-400';
			case 2:
				return 'text-orange-500';
			default:
				return 'text-gray-200';
		}
	};

	return (
		<aside className='w-1/6 p-6 bg-gray-600 shadow-lg min-h-max'>
			<div className='flex flex-col space-y-4'>
				{users.map((user, index) => (
					<div key={index} className='flex items-center overflow-hidden'>
						<span className={`place w-6 mr-2 text-center ${getMedalStyle(index)}`}>{index + 1}</span>
						<div className='flex items-center overflow-hidden'>
							<User
								fullName={user.fullName.length > 15 ? `${user.fullName.slice(0, 15)}...` : user.fullName}
								profilePicture={user.profilePicture}
								rating={user.rating}
								className='w-64' // Добавляем фиксированный размер для всех компонентов User
							/>
						</div>
					</div>
				))}
			</div>
		</aside>
	);
};

export default TopUsers;
