import React from 'react';
import { Link } from 'react-router-dom';
import { decodeToken } from '../utils/decodeJWT';

const Sidebar = () => {
	const token = localStorage.getItem('token');
	const user = decodeToken(token);

	return (
		<aside className='w-full px-6 py-6 bg-gray-700 shadow-lg max-w-64'>
			<nav className='fixed flex flex-col space-y-4'>
				<Link to='/' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Home</span>
					</button>
				</Link>

				<Link to='/users?page=1' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Users</span>
					</button>
				</Link>

				{/* {user?.role === 'admin' && (
					<Link to='/create-user' className='w-full pr-6 ml-6'>
						<button className='flex items-center justify-start w-full px-4 py-2 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-500 focus:outline-none'>
							<span className='text-sm font-semibold'>Create User</span>
						</button>
					</Link>
				)} */}

				<Link to='/posts?page=1' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Posts</span>
					</button>
				</Link>

				{token && (
					<Link to='/create-post' className='w-full pr-6 ml-6'>
						<button className='flex items-center justify-start w-full px-4 py-2 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-500 focus:outline-none'>
							<span className='text-sm font-semibold'>Create Post</span>
						</button>
					</Link>
				)}

				<Link to='/categories?page=1' className='w-full'>
					<button className='flex items-center justify-start w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
						<span className='text-lg font-semibold'>Categories</span>
					</button>
				</Link>

				{token && (
					<Link to='/create-category' className='w-full pr-6 ml-6'>
						<button className='flex items-center justify-start w-full px-4 py-2 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-500 focus:outline-none'>
							<span className='text-sm font-semibold'>Create Category</span>
						</button>
					</Link>
				)}
			</nav>
		</aside>
	);
};

export default Sidebar;
