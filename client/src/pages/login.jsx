import { Link } from 'react-router-dom';
import React from 'react';
import Header from '../components/header';

const LoginPage = () => {
	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<main className='flex items-center justify-center flex-grow bg-gray-800'>
				<div className='p-6 bg-blue-500 rounded-lg shadow-lg w-96'>
					<h2 className='mb-4 text-2xl font-semibold text-center'>Login</h2>
					<form className='flex flex-col'>
						<input type='text' placeholder='Email or Login' className='p-2 mb-4 border border-gray-300 rounded' />
						<input type='password' placeholder='Password' className='p-2 mb-4 border border-gray-300 rounded' />
						<button className='px-4 py-2 text-white rounded bg-violet-300 hover:bg-violet-600'>Log In</button>
					</form>
					<p className='mt-4 text-center'>
						Don't have an account?{' '}
						<Link to='/register' className='text-violet-300 hover:underline'>
							Register here
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
};

export default LoginPage;
