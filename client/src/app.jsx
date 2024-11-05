import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ErrorPage from './pages/error';
import PostsPage from './pages/posts';
import './styles/main.scss';

function App() {
	const [error, setError] = useState(null);

	return (
		<Router>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<LoginPage />} />
				<Route path='/posts' element={<PostsPage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/error' element={<ErrorPage errorCode={error?.code} errorMessage={error?.message} />} />
				<Route path='*' element={<ErrorPage errorCode={404} errorMessage={'Page Not Found'} />} />
			</Routes>
		</Router>
	);
}

export default App;
