import React from 'react';
import { Link } from 'react-router-dom';

const User = ({ userId, fullName, profilePicture, rating, className = '' }) => {
	return (
		<Link to={`/user/${userId}`}>
			<div className={`flex items-center p-2 overflow-hidden bg-gray-900 rounded-lg shadow-md ${className} space-x-2`}>
				<img src={profilePicture} alt={fullName} className='object-cover border-2 border-gray-500 rounded-full w-11 h-11' />
				<div className='flex flex-col'>
					<span className='overflow-hidden text-lg font-semibold text-gray-100 whitespace-nowrap text-ellipsis'>{fullName}</span>
					<span className={`text-sm ${rating > 0 ? 'text-green-500' : rating < 0 ? 'text-red-500' : 'text-gray-400'}`}>
						{rating > 0 ? `+${rating}` : rating < 0 ? rating : rating}
					</span>
				</div>
			</div>
		</Link>
	);
};

export default User;
