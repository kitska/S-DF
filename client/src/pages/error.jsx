// pages/ErrorPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = ({ errorCode, errorMessage }) => {
	return (
		<div className='flex flex-col items-center justify-center h-screen bg-gray-500'>
			<h1 className='text-6xl font-bold text-red-500'>{errorCode}</h1>
			<p className='mt-4 text-xl'>{errorMessage}</p>
			<Link to='/' className='px-4 py-2 mt-6 text-white bg-blue-500 rounded-full hover:bg-blue-600'>
				Вернуться на главную
			</Link>
		</div>
	);
};

export default ErrorPage;