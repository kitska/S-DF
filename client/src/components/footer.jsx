import React from 'react';

const Footer = () => {
	return (
		<footer className='w-full p-4 text-sm text-gray-400 bg-gray-900 shadow-inner'>
			<div className='container flex flex-wrap justify-between mx-auto'>
				<div className='flex flex-col space-y-2 md:flex-row md:space-x-6 md:space-y-0'>
					<a href='/about' className='hover:text-white'>
						About
					</a>
					<a href='/contact' className='hover:text-white'>
						Contact
					</a>
				</div>

				<div className='mt-2 text-gray-500 md:mt-0'>&copy; 2024 S?DF. All rights reserved.</div>
			</div>
		</footer>
	);
};

export default Footer;
