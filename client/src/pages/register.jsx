import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import AuthHandler from '../api/authHandler';

const RegisterPage = () => {
	const navigate = useNavigate();
	const [full_name, setFullName] = useState('');
	const [email, setEmail] = useState('');
	const [login, setLogin] = useState('');
	const [password, setPassword] = useState('');
	const [password_confirmation, setPasswordConfirmation] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [focused, setFocused] = useState({
		full_name: false,
		email: false,
		login: false,
		password: false,
		password_confirmation: false,
	});
	const [emailError, setEmailError] = useState('');
	const [passwordConfirmationError, setPasswordConfirmationError] = useState('');
	const [registrationError, setRegistrationError] = useState('');

	const handleFocus = field => {
		setFocused(prev => ({ ...prev, [field]: true }));
	};

	const handleBlur = field => {
		setFocused(prev => ({ ...prev, [field]: false }));
		if (field === 'email') {
			validateEmail(email);
		}
		if (field === 'password_confirmation') {
			validatePasswordConfirmation(password, password_confirmation);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(prev => !prev);
	};

	const validateEmail = email => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email.trim() !== '' && !emailRegex.test(email)) {
			setEmailError('Invalid email address');
		} else {
			setEmailError('');
		}
	};

	const validatePasswordConfirmation = (password, confirmation) => {
		if (confirmation !== '' && confirmation !== password) {
			setPasswordConfirmationError('Passwords do not match');
		} else {
			setPasswordConfirmationError('');
		}
	};

	useEffect(() => {
		// Проверяем наличие токена при загрузке компонента
		const token = localStorage.getItem('token');
		if (token) {
			navigate('/'); // Если токен есть, перенаправляем на главную страницу
		}
	}, [navigate]);

	const handleRegister = async e => {
		e.preventDefault();
		validateEmail(email);
		validatePasswordConfirmation(password, password_confirmation);

		if (!emailError && !passwordConfirmationError) {
			try {
				const response = await AuthHandler.registerUser({
					full_name,
					email,
					login,
					password,
					password_confirmation,
				});
				const statusCode = response.status;

				if (statusCode === 201) {
					navigate('/login');
				} else {
					setRegistrationError(response.data.message || 'Registration failed');
				}
			} catch (error) {
				setRegistrationError('An error occurred during registration');
			}
		}
	};

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<main className='flex items-center justify-center flex-grow bg-gray-800'>
				<div className='p-6 bg-blue-600 rounded-lg shadow-lg w-96'>
					<h2 className='mb-4 text-2xl font-semibold text-center text-white'>Register</h2>
					<form className='flex flex-col' onSubmit={handleRegister}>
						<div className='relative mb-6'>
							<input
								type='text'
								value={full_name}
								onChange={e => setFullName(e.target.value)}
								onFocus={() => handleFocus('full_name')}
								onBlur={() => handleBlur('full_name')}
								className='w-full p-3 pt-5 text-white placeholder-transparent bg-blue-700 border border-gray-300 rounded focus:outline-none'
								placeholder='Full Name'
							/>
							<label
								className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-blue-600 rounded ${
									full_name || focused.full_name ? 'top-[-8px] text-xs text-white' : 'top-4 text-base text-gray-400'
								}`}
							>
								Full Name
							</label>
						</div>

						<div className='relative mb-6'>
							<input
								type='text'
								value={login}
								onChange={e => setLogin(e.target.value)}
								onFocus={() => handleFocus('login')}
								onBlur={() => handleBlur('login')}
								className='w-full p-3 pt-5 text-white placeholder-transparent bg-blue-700 border border-gray-300 rounded focus:outline-none'
								placeholder='Login'
							/>
							<label
								className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-blue-600 rounded ${
									login || focused.login ? 'top-[-8px] text-xs text-white' : 'top-4 text-base text-gray-400'
								}`}
							>
								Login
							</label>
						</div>

						<div className='relative mb-6'>
							<input
								type='text'
								value={email}
								onChange={e => setEmail(e.target.value)}
								onFocus={() => handleFocus('email')}
								onBlur={() => handleBlur('email')}
								className={`w-full p-3 pt-5 placeholder-transparent bg-blue-700 border border-gray-300 rounded focus:outline-none text-white ${
									emailError ? 'border-red-500' : ''
								}`}
								placeholder='Email'
							/>
							<label
								className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-blue-600 rounded ${
									email || focused.email ? 'top-[-8px] text-xs text-white' : 'top-4 text-base text-gray-400'
								}`}
							>
								Email
							</label>
							{emailError && <p className='mt-1 text-sm text-red-500'>{emailError}</p>}
						</div>

						<div className='relative mb-6'>
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={e => setPassword(e.target.value)}
								onFocus={() => handleFocus('password')}
								onBlur={() => handleBlur('password')}
								className='w-full p-3 pt-5 text-white placeholder-transparent bg-blue-700 border border-gray-300 rounded focus:outline-none'
								placeholder='Password'
							/>
							<label
								className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-blue-600 rounded ${
									password || focused.password ? 'top-[-8px] text-xs text-white' : 'top-4 text-base text-gray-400'
								}`}
							>
								Password
							</label>
							<button
								type='button'
								onClick={togglePasswordVisibility}
								className='absolute inset-y-0 flex items-center text-gray-400 right-3 hover:text-gray-600 focus:outline-none'
							>
								{showPassword ? <EyeOffIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
							</button>
						</div>

						<div className='relative mb-6'>
							<input
								type={showPassword ? 'text' : 'password'}
								value={password_confirmation}
								onChange={e => setPasswordConfirmation(e.target.value)}
								onFocus={() => handleFocus('password_confirmation')}
								onBlur={() => handleBlur('password_confirmation')}
								className={`w-full p-3 pt-5 text-white placeholder-transparent bg-blue-700 border border-gray-300 rounded focus:outline-none ${
									passwordConfirmationError ? 'border-red-500' : ''
								}`}
								placeholder='Confirm Password'
							/>
							<label
								className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-blue-600 rounded ${
									password_confirmation || focused.password_confirmation ? 'top-[-8px] text-xs text-white' : 'top-4 text-base text-gray-400'
								}`}
							>
								Confirm Password
							</label>
							{passwordConfirmationError && <p className='mt-1 text-sm text-red-500'>{passwordConfirmationError}</p>}
						</div>

						<button className='px-4 py-2 text-white rounded bg-violet-500 hover:bg-violet-700 focus:ring-2 ring-violet-300'>Register</button>
					</form>
					<p className='mt-4 text-center text-white'>
						Already have an account?{' '}
						<Link to='/login' className='text-violet-300 hover:underline'>
							Log in here
						</Link>
					</p>
				</div>
			</main>
		</div>
	);
};

export default RegisterPage;
