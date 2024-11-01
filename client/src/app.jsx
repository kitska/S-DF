import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ErrorPage from './pages/error';
import './styles/main.scss'; // Импорт стилей

function App() {
	const [error, setError] = useState(null);

	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/error' element={<ErrorPage errorCode={error?.code} errorMessage={error?.message} />} />
			</Routes>
		</Router>
	);
}

export default App;
