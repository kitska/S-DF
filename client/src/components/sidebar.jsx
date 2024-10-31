// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	return (
		<aside id='nav' className='fixed left-0 z-0 h-screen p-6 mt-16 bg-gray-800 shadow-lg w-1/7 top-8'>
			<nav className='flex flex-col space-y-4'>
				<Link to='/' className='text-lg font-semibold hover:text-blue-400'>
					<button className='w-full px-4 py-2 text-left transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none'>Home</button>
				</Link>
				<Link to='/users' className='text-lg font-semibold hover:text-blue-400'>
					<button className='w-full px-4 py-2 text-left transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none'>Users</button>
				</Link>
				<Link to='/categories' className='text-lg font-semibold hover:text-blue-400'>
					<button className='w-full px-4 py-2 text-left transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none'>Categories</button>
				</Link>
				<Link to='/posts' className='text-lg font-semibold hover:text-blue-400'>
					<button className='w-full px-4 py-2 text-left transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none'>Posts</button>
				</Link>
			</nav>
		</aside>
	);
};

export default Sidebar;
