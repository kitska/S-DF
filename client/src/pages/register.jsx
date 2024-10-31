import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';

const RegisterPage = ({ onEnter, onLeave }) => {
	useEffect(() => {
		onEnter(); // Устанавливаем размытие при монтировании компонента
		return () => {
			onLeave(); // Убираем размытие при размонтировании компонента
		};
	}, [onEnter, onLeave]);

	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<div className='p-6 bg-blue-500 rounded-lg shadow-lg w-96'>
				<h2 className='mb-4 text-2xl font-semibold text-center'>Register</h2>
				<form className='flex flex-col'>
					<input type='text' placeholder='Full Name' className='p-2 mb-4 border border-gray-300 rounded' />
					<input type='text' placeholder='Email' className='p-2 mb-4 border border-gray-300 rounded' />
					<input type='text' placeholder='Login' className='p-2 mb-4 border border-gray-300 rounded' />
					<input type='password' placeholder='Password' className='p-2 mb-4 border border-gray-300 rounded' />
					<button className='px-4 py-2 text-white rounded bg-violet-300 hover:bg-violet-600'>Register</button>
				</form>
				<p className='mt-4 text-center'>
					Already have an account?{' '}
					<Link to='/login' className='text-violet-300 hover:underline'>
						Log in here
					</Link>
				</p>
			</div>
		</div>
	);
};

export default RegisterPage;
