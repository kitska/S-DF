import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/2-3.png';

const Header = () => {
	return (
		<header className='fixed top-0 left-0 z-50 w-full py-3 bg-gray-900'>
			<div className='container flex items-center justify-between max-w-5xl p-4 mx-auto bg-gray-800 rounded-lg shadow-lg'>
				{/* Logo */}
				<div className='flex-shrink-0'>
					<a href='/'>
						<img src={logoImage} alt='Logo' className='w-auto h-10' />
					</a>
				</div>

				{/* Search Bar */}
				<div className='flex-grow mx-4'>
					<input type='text' placeholder='Search...' className='w-full p-2 text-white bg-gray-700 border border-gray-600 rounded-full' />
				</div>

				{/* Login Button */}
				<div>
					<Link to='/login'>
						<button className='px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600'>Sign In</button>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;
