import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import AuthHandler from '../api/authHandler';
import Header from '../components/header';
import Footer from '../components/footer';

const ResetPasswordPage = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [newPassword, setNewPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = async e => {
		e.preventDefault();
		if (newPassword !== passwordConfirmation) {
			setError('Passwords do not match');
			return;
		}

		try {
			const passwordData = { newPassword, passwordConfirmation };
			const response = await AuthHandler.resetPassword(token, passwordData);
			if (response.status === 200) {
				setMessage(`${response.data.message}, You can now log in.`);
				setTimeout(() => navigate('/login'), 2000);
			}
		} catch (error) {
			setError(error.message || 'Password reset error');
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-700'>
			<Header />
			<div className='flex items-center justify-center flex-grow'>
				<div className='p-8 bg-gray-800 rounded-lg shadow-lg w-96'>
					<h2 className='mb-4 text-2xl text-center text-white'>Reset Password</h2>
					{error && <p className='mb-4 text-red-500'>{error}</p>}
					{message && <p className='mb-4 text-green-500'>{message}</p>}
					<form onSubmit={handleSubmit}>
						<div className='mb-4'>
							<label className='block text-gray-300'>New Password</label>
							<div className='relative'>
								<input
									type={showNewPassword ? 'text' : 'password'}
									value={newPassword}
									onChange={e => setNewPassword(e.target.value)}
									className='w-full p-2 text-white bg-gray-600 rounded'
									required
								/>
								<button
									type='button'
									onClick={() => setShowNewPassword(!showNewPassword)}
									className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-400'
								>
									{showNewPassword ? <EyeOffIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
								</button>
							</div>
						</div>
						<div className='mb-4'>
							<label className='block text-gray-300'>Confirm Password</label>
							<div className='relative'>
								<input
									type={showConfirmPassword ? 'text' : 'password'}
									value={passwordConfirmation}
									onChange={e => setPasswordConfirmation(e.target.value)}
									className='w-full p-2 text-white bg-gray-600 rounded'
									required
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-400'
								>
									{showConfirmPassword ? <EyeOffIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
								</button>
							</div>
						</div>
						<button type='submit' className='w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
							Reset Password
						</button>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default ResetPasswordPage;
