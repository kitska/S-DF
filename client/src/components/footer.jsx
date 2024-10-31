// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
	return (
		<footer className='fixed bottom-0 left-0 w-full p-4 text-sm text-gray-400 bg-gray-900 shadow-inner'>
			<div className='container flex flex-wrap justify-between mx-auto'>
				{/* Links */}
				<div className='flex flex-col space-y-2 md:flex-row md:space-x-6 md:space-y-0'>
					<a href='/about' className='hover:text-white'>
						About
					</a>
					<a href='/contact' className='hover:text-white'>
						Contact
					</a>
				</div>

				{/* Contact Info */}
				<div className='mt-2 text-gray-500 md:mt-0'>&copy; 2023 S?DF. All rights reserved.</div>
			</div>
		</footer>
	);
};

export default Footer;
