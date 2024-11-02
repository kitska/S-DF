import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import Header from '../components/header';
import AuthHandler from '../api/authHandler';
import ErrorMessage from '../components/UI/errorMessage'; // Импортируем компонент для ошибок

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [emailValue, setEmailValue] = useState('');
	const [passwordValue, setPasswordValue] = useState('');
	const [emailFocused, setEmailFocused] = useState(false);
	const [passwordFocused, setPasswordFocused] = useState(false);
	const [error, setError] = useState(null); // Для обработки ошибок
	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const togglePasswordVisibility = () => {
		setShowPassword(prev => !prev);
	};

	// Проверка на автозаполнение после загрузки
	useEffect(() => {
		if (emailRef.current.value) setEmailValue(emailRef.current.value);
		if (passwordRef.current.value) setPasswordValue(passwordRef.current.value);
	}, []);

	const handleLogin = async e => {
		e.preventDefault();
		setError(null); // Сбрасываем ошибку перед отправкой

		// Формируем тело запроса
		const requestBody = {
			login: emailValue,
			email: emailValue.includes('@') ? emailValue : undefined, // Учитываем ввод email
			password: passwordValue,
		};

		try {
			const response = await AuthHandler.loginUser(requestBody); // Вызываем функцию для логина
			// Обработайте успешный ответ (например, сохранить токен, перенаправить пользователя и т.д.)
			console.log(response); // Временно выводим ответ
		} catch (err) {
			setError(err.response ? err.response.data : { message: 'Ошибка входа' });
		}
	};

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<main className='flex items-center justify-center flex-grow bg-gray-800'>
				<div className='p-6 bg-blue-600 rounded-lg shadow-lg w-96'>
					<h2 className='mb-4 text-2xl font-semibold text-center text-white'>Login</h2>
					<form className='flex flex-col' onSubmit={handleLogin}>
						<div className='relative mb-6'>
							<input
								ref={emailRef}
								type='text'
								value={emailValue}
								onChange={e => setEmailValue(e.target.value)}
								onFocus={() => setEmailFocused(true)}
								onBlur={() => setEmailFocused(false)}
								className='w-full p-3 pt-5 text-white placeholder-transparent bg-blue-700 border border-gray-300 rounded focus:outline-none'
								placeholder='Email or Login'
							/>
							<label
								className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-blue-600 rounded ${
									emailValue || emailFocused ? 'top-[-8px] text-xs text-white' : 'top-4 text-base text-gray-400'
								}`}
							>
								Email or Login
							</label>
						</div>

						<div className='relative mb-6'>
							<input
								ref={passwordRef}
								type={showPassword ? 'text' : 'password'}
								value={passwordValue}
								onChange={e => setPasswordValue(e.target.value)}
								onFocus={() => setPasswordFocused(true)}
								onBlur={() => setPasswordFocused(false)}
								className='w-full p-3 pt-5 text-white placeholder-transparent bg-blue-700 border border-gray-300 rounded focus:outline-none'
								placeholder='Password'
							/>
							<label
								className={`absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-blue-600 rounded ${
									passwordValue || passwordFocused ? 'top-[-8px] text-xs text-white' : 'top-4 text-base text-gray-400'
								}`}
							>
								Password
							</label>
							<button
								type='button'
								onClick={togglePasswordVisibility}
								className='absolute inset-y-0 flex items-center text-gray-400 right-3 hover:text-gray-200 focus:outline-none'
							>
								{showPassword ? <EyeOffIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
							</button>
						</div>

						<button className='px-4 py-2 text-white rounded bg-violet-500 hover:bg-violet-700 focus:ring-2 ring-violet-300'>Log In</button>
					</form>
					{error && <ErrorMessage errorCode={error.code} errorMessage={error.message} />} {/* Отображаем ошибку */}
					<p className='mt-4 text-center text-white'>
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
