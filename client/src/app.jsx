import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import TopUsers from './components/topUsers';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ErrorPage from './pages/error';
import './styles/main.scss'; // Импорт стилей

function App() {
	const [error, setError] = useState(null);

	// Функция для обработки ошибок
	const handleError = (errorCode, errorMessage) => {
		setError({ code: errorCode, message: errorMessage });
	};

	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={
						<div className='flex flex-col min-h-screen'>
							<Header />
							<div className='flex flex-grow'>
								<Sidebar />
								<main className='flex-grow p-6 bg-gray-500'>
									<HomePage />
								</main>
								<TopUsers />
							</div>
							<Footer />
						</div>
					}
				/>
				<Route
					path='/login'
					element={
						<div className='flex flex-col min-h-screen'>
							<Header />
							<main className='flex-grow p-6 bg-gray-800'>
								<LoginPage onEnter={() => {}} onLeave={() => {}} />
							</main>
						</div>
					}
				/>
				<Route
					path='/register'
					element={
						<div className='flex flex-col min-h-screen'>
							<Header />
							<main className='flex-grow p-6 bg-gray-800'>
								<RegisterPage onEnter={() => {}} onLeave={() => {}} />
							</main>
						</div>
					}
				/>
				<Route path='/error' element={<ErrorPage errorCode={error?.code} errorMessage={error?.message} />} />
			</Routes>
		</Router>
	);
}

export default App;
