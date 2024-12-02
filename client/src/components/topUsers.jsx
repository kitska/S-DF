import React, { useEffect, useState } from 'react';
import User from './UI/user';
import UserHandler from '../api/userHandler';

const TopUsers = () => {
	const [users, setUsers] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await UserHandler.getAllUsers(1, 10, '', 'rating', 'desc');
				if (response.status === 200) {
					setUsers(response.data.users);
				}
			} catch (error) {
				setError(error.message || 'User loading error');
			}
		};

		fetchUsers();
	}, []);

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
		<aside className='p-6 bg-gray-700 shadow-lg w-1/7 min-h-max'>
			{error ? (
				<p className='text-red-500'>{error}</p>
			) : (
				<div className='flex flex-col space-y-4'>
					{users.map((user, index) => (
						<div key={user.id} className='flex items-center overflow-hidden'>
							<span className={`place w-6 mr-2 text-center ${getMedalStyle(index)}`}>{index + 1}</span>
							<div className='flex items-center overflow-hidden'>
								<User
									fullName={user.login.length > 15 ? `${user.login.slice(0, 15)}...` : user.login}
									profilePicture={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture}`}
									rating={user.rating}
									className='w-64'
									userId={user.id}
								/>
							</div>
						</div>
					))}
				</div>
			)}
		</aside>
	);
};

export default TopUsers;
