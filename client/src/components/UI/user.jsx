// src/components/User.jsx
import React from 'react';

const User = ({ fullName, profilePicture, rating }) => {
	return (
		<div className='flex items-center p-2 overflow-hidden bg-gray-800 rounded-lg shadow-md'>
			<img src={profilePicture} alt={fullName} className='w-10 h-10 mr-3 rounded-full' />
			<div className='flex flex-col'>
				<span className='overflow-hidden text-lg font-semibold text-gray-100 whitespace-nowrap text-ellipsis'>{fullName}</span>
				<span className={`text-sm ${rating > 0 ? 'text-green-500' : rating < 0 ? 'text-red-500' : 'text-gray-400'}`}>
					{rating > 0 ? `+${rating}` : rating < 0 ? rating : rating}
				</span>
			</div>
		</div>
	);
};

export default User;
