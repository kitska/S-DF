import React, { useState } from 'react';
import AuthHandler from '../api/authHandler';
import Header from '../components/header';
import Footer from '../components/footer';

const PasswordResetRequestPage = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const response = await AuthHandler.sendPasswordResetLink(email);
			if (response.status === 200) {
				setMessage(response.data.message);
			}
		} catch (error) {
			setError(error.message || 'Failed to send reset link. Please try again.');
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-700'>
			<Header />
			<div className='flex items-center justify-center flex-grow'>
				<div className='p-8 bg-gray-800 rounded-lg shadow-lg w-96'>
					<h2 className='mb-4 text-2xl text-center text-white'>Request Password Reset</h2>
					{error && <p className='mb-4 text-red-500'>{error}</p>}
					{message && <p className='mb-4 text-green-500'>{message}</p>}
					<form onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label className='block text-gray-300'>Email</label>
							<input type='email' value={email} onChange={e => setEmail(e.target.value)} className='w-full p-2 text-white bg-gray-600 rounded' required />
						</div>
						<button type='submit' className='w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
							Send Reset Link
						</button>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default PasswordResetRequestPage;
