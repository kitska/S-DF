import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { decodeToken } from '../utils/decodeJWT';

const Sidebar = ({ isOpen, toggleSidebar }) => {
	const token = localStorage.getItem('token');
	const user = decodeToken(token);

	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1069);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 1069);
			if (window.innerWidth > 1069) {
				toggleSidebar(false);
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [toggleSidebar]);

	return (
		<div className='flex'>
			<aside
				className={`${
					isMobile
						? `fixed top-0 left-0 h-full w-64 bg-gray-700 shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
						: 'sticky top-0 h-full w-64 bg-gray-700 shadow-lg z-40'
				}`}
			>
				<nav className={`${isMobile ? `fixed mt-20 flex flex-col px-4 py-6 space-y-4'` : `fixed flex flex-col px-4 py-6 space-y-4'`}`}>
					<Link to='/' onClick={() => isMobile && toggleSidebar()}>
						<button className='w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
							<span className='text-lg font-semibold'>Home</span>
						</button>
					</Link>

					<Link to='/users?page=1' onClick={() => isMobile && toggleSidebar()}>
						<button className='w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
							<span className='text-lg font-semibold'>Users</span>
						</button>
					</Link>

					<Link to='/posts?page=1' onClick={() => isMobile && toggleSidebar()}>
						<button className='w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
							<span className='text-lg font-semibold'>Posts</span>
						</button>
					</Link>

					{token && (
						<Link to='/create-post' onClick={() => isMobile && toggleSidebar()}>
							<button className='w-full px-4 py-2 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-500 focus:outline-none'>
								<span className='text-sm font-semibold'>Create Post</span>
							</button>
						</Link>
					)}

					<Link to='/categories?page=1' onClick={() => isMobile && toggleSidebar()}>
						<button className='w-full px-4 py-3 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-400 focus:outline-none'>
							<span className='text-lg font-semibold'>Categories</span>
						</button>
					</Link>

					{token && (
						<Link to='/create-category' onClick={() => isMobile && toggleSidebar()}>
							<button className='w-full px-4 py-2 text-left text-gray-300 transition-colors duration-300 bg-gray-700 rounded-md hover:bg-gray-500 focus:outline-none'>
								<span className='text-sm font-semibold'>Create Category</span>
							</button>
						</Link>
					)}
				</nav>
			</aside>
			{isMobile && isOpen && <div onClick={toggleSidebar} className='fixed inset-0 z-30 bg-black bg-opacity-50'></div>}
		</div>
	);
};

export default Sidebar;
