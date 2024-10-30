import React from 'react';
import Header from './components/header';
import Footer from './components/footer';
import HomePage from './pages/home';
import './styles/main.scss'; // Импорт стилей

const App = () => {
	return (
		<div className='container mx-auto'>
			<Header />
			<HomePage />
			<Footer />
		</div>
	);
};

export default App;
