// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	return (
		<aside className='p-6 bg-gray-600 shadow-lg min-h-max w-1/7'>
			{' '}
			{/* Убедитесь, что здесь h-full */}
			<nav className='flex flex-col space-y-4'>
				<Link to='/' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-600 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Home</span>
					</button>
				</Link>
				<Link to='/users' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-600 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Users</span>
					</button>
				</Link>
				<Link to='/categories' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-600 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Categories</span>
					</button>
				</Link>
				<Link to='/posts' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-600 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Posts</span>
					</button>
				</Link>
			</nav>
		</aside>
	);
};

export default Sidebar;
