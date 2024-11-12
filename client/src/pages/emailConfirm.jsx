import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import ErrorMessage from '../components/UI/errorMessage';
import AuthHandler from '../api/authHandler'; // Импортируем функцию

const EmailConfirmPage = () => {
	const { token } = useParams(); // Получаем токен из URL
	const [loading, setLoading] = useState(true); // Состояние загрузки
	const [confirmationStatus, setConfirmationStatus] = useState(null); // Состояние подтверждения
	const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке

	useEffect(() => {
		// Функция для отправки запроса на сервер для подтверждения email
		const handleConfirmEmail = async () => {
			try {
				const response = await AuthHandler.confirmEmail(token); // Используем функцию confirmEmail
				setConfirmationStatus(response.data.message || 'Email confirmed successfully!');
			} catch (error) {
				setErrorMessage(error.message || 'An error occurred, please try again later.');
			} finally {
				setLoading(false);
			}
		};

		// Вызов функции подтверждения email
		handleConfirmEmail();
	}, [token]);

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<main className='flex items-center justify-center flex-grow bg-gray-800'>
				<div className='p-6 bg-blue-600 rounded-lg shadow-lg w-96'>
					<h2 className='mb-4 text-2xl font-semibold text-center text-white'>Email Confirmation</h2>

					{loading ? (
						<p className='text-center text-white'>Loading...</p> // Показываем "Loading..." при ожидании ответа от сервера
					) : confirmationStatus ? (
						<p className='text-center text-white'>{confirmationStatus}</p> // Показываем результат подтверждения
					) : (
						<div>
							<ErrorMessage errorMessage={errorMessage} />
							<p className='mt-4 text-center text-white'>Please check the email you entered and try again.</p>
						</div>
					)}

					<p className='mt-4 text-center text-white'>
						If you didn't request an account, you can{' '}
						<Link to='/register' className='text-violet-300 hover:underline'>
							register here
						</Link>
						.
					</p>
				</div>
			</main>
		</div>
	);
};

export default EmailConfirmPage;
