import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import HomePage from './pages/home';
// import UsersPage from './pages/users'; // Импортируйте ваши страницы
// import CategoriesPage from './pages/categories'; // Импортируйте ваши страницы
// import PostsPage from './pages/posts'; // Импортируйте ваши страницы
import './styles/main.scss'; // Импорт стилей

function App() {
	return (
		<Router>
			<div className='flex flex-col min-h-screen'>
				<Header />
				<div className='flex flex-grow'>
					<main className='flex-grow p-6 bg-gray-100'>
						<Sidebar />
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/users' element={<HomePage />} />
							<Route path='/categories' element={<HomePage />} />
							<Route path='/posts' element={<HomePage />} />
						</Routes>
					</main>
				</div>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
