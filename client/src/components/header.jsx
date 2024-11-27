import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/2-3.png';
import UserHandler from '../api/userHandler';
import PostHandler from '../api/postHandler'; // Импортируем обработчик постов
import CategoryHandler from '../api/categoryHandler'; // Импортируем обработчик категорий
import { decodeToken } from '../utils/decodeJWT';
import User from './UI/user'; // Импортируем компонент User
import Post from './UI/post'; // Импортируем компонент Post
import Category from './UI/category'; // Импортируем компонент Category
import { formatDate } from '../utils/formatDate';

const Header = () => {
	const token = localStorage.getItem('token');
	const [userAvatar, setUserAvatar] = useState(null);
	const [login, setLogin] = useState(null);
	const [userId, setUserId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [showHint, setShowHint] = useState(false); // Состояние для управления видимостью подсказки

	useEffect(() => {
		const fetchUserData = async () => {
			if (token) {
				const decodedTokenID = decodeToken(token);

				if (decodedTokenID?.id) {
					try {
						const response = await UserHandler.getUserById(decodedTokenID?.id);
						const avatarUrl = `${process.env.REACT_APP_BASE_URL}/${response.data.profile_picture}`;
						setUserAvatar(avatarUrl);
						setLogin(response.data.login);
						setUserId(response.data.id);
					} catch (error) {
						console.error('Ошибка при получении данных пользователя:', error);
					}
				}
			}
		};

		fetchUserData();
	}, [token]);

	const handleSearch = async e => {
		const term = e.target.value;
		setSearchTerm(term);
		setShowResults(true); // Показываем результаты поиска

		if (term.trim() === '') {
			setSearchResults([]); // Если поле пустое, очищаем результаты
			setShowHint(true); // Показываем подсказку
			return;
		}

		setLoading(true);
		setShowHint(false); // Скрываем подсказку

		try {
			let response;
			if (term.startsWith('u:')) {
				const login = term.replace('u:', '').trim();
				if (!login) {
					setSearchResults([]);
					return;
				}
				response = await UserHandler.getAllUsers(1, 10, login);
				if (Array.isArray(response.data.users)) {
					setSearchResults(response.data.users.map(user => ({ type: 'user', ...user })));
				} else {
					console.error('Ошибка: ожидается массив пользователей', response);
					setSearchResults([]);
				}
			} else if (term.startsWith('p:')) {
				const title = term.replace('p:', '').trim();
				if (!title) {
					setSearchResults([]);
					return;
				}
				response = await PostHandler.getAllPosts(1, title);
				if (Array.isArray(response.data.posts)) {
					setSearchResults(
						response.data.posts.map(post => ({
							type: 'post',
							id: post.id,
							title: post.title,
							content: `${post.content.slice(0, 100)}...`,
							author: post.User.login,
							authorAvatar: post.User.profile_picture,
							date: formatDate(post.publish_date),
							status: post.status === 'active',
							categories: post.Categories.map(category => ({
								id: category.id, 
								title: category.title,
							})),
						}))
					);
				} else {
					console.error('Ошибка: ожидается массив постов', response);
					setSearchResults([]);
				}
			} else if (term.startsWith('c:')) {
				const categoryTitle = term.replace('c:', '').trim();
				if (!categoryTitle) {
					setSearchResults([]);
					return;
				}
				response = await CategoryHandler.getAllCategories(1, 10, categoryTitle);
				if (Array.isArray(response.data.categories)) {
					setSearchResults(response.data.categories.map(category => ({ type: 'category', ...category })));
				} else {
					console.error('Ошибка: ожидается массив категорий', response);
					setSearchResults([]);
				}
			} else {
				setSearchResults([]); // Если не u:, p: или c:, очищаем результаты
			}
		} catch (error) {
			console.error('Ошибка при поиске:', error);
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = e => {
		const term = e.target.value;
		setSearchTerm(term);

		if (term === '') {
			setSearchResults([]); // Очищаем результаты
			setShowResults(false); // Скрываем результаты
			setShowHint(true); // Показываем подсказку
		} else {
			setShowHint(false); // Скрываем подсказку, если есть текст
			handleSearch(e); // Выполняем поиск при вводе
		}
	};

	const handleBlur = () => {
		setTimeout(() => {
			setShowResults(false); // Скрываем результаты при уходе курсора
			setShowHint(false);
		}, 100); // Задержка в 100 мс
	};

	const handleFocus = () => {
		if (searchTerm === '') {
			setShowHint(true); // Показываем подсказку, если поле пустое
		} else {
			setShowResults(true); // Показываем результаты, если есть текст
		}
	};

	return (
		<header className='fixed top-0 left-0 z-50 w-full py-4 bg-gray-900'>
			<div className='container flex items-center justify-between max-w-5xl p-2 mx-auto bg-gray-800 rounded-lg shadow-lg'>
				{/* Logo */}
				<div className='flex-shrink-0'>
					<a href='/'>
						<img src={logoImage} alt='Logo' className='w-auto h-8' />
					</a>
				</div>

				{/* Search Bar */}
				<form className='flex-grow mx-3' onSubmit={e => e.preventDefault()}>
					<input
						type='text'
						placeholder='Search...'
						className='w-full p-1 text-white bg-gray-700 border border-gray-600 rounded-full'
						value={searchTerm}
						onChange={handleInputChange}
						onFocus={handleFocus} // Обработчик фокуса
						onBlur={handleBlur} // Скрываем результаты и подсказку при уходе курсора
					/>
				</form>

				{/* User Avatar and Login Block */}
				<div className='flex items-center space-x-3'>
					{userAvatar ? (
						<Link to={`/user/${userId}`} className='flex items-center p-1 space-x-2 transition duration-200 rounded-lg hover:bg-gray-700'>
							<img src={userAvatar} alt='User  Avatar' className='object-cover border-2 border-gray-500 rounded-full w-11 h-11' />
							<span className='font-semibold text-white'>{login}</span>
						</Link>
					) : (
						<Link to='/login'>
							<button className='px-3 py-1 text-white bg-blue-500 rounded-full hover:bg-blue-600'>Log In</button>
						</Link>
					)}
				</div>
			</div>

			{/* Search Results */}
			{showResults && (
				<div className='absolute w-1/2 mt-2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg left-1/2' style={{ maxHeight: '300px', overflowY: 'auto' }}>
					<ul>
						{searchResults.length > 0 ? (
							searchResults.map(item => (
								<li key={item.id} className='p-2'>
									{item.type === 'user' ? (
										<User
											fullName={item.login .length > 15 ? `${item.login.slice(0, 15)}...` : item.login}
											profilePicture={`${process.env.REACT_APP_BASE_URL}/${item.profile_picture}`}
											rating={item.rating}
											userId={item.id}
										/>
									) : item.type === 'post' ? (
										<Post
											id={item.id}
											title={item.title}
											content={item.content}
											author={item.author}
											authorAvatar={item.authorAvatar}
											date={item.date}
											status={item.status}
											categories={item.categories}
										/>
									) : item.type === 'category' ? (
										<Category categoryId={item.id} name={item.title} />
									) : null}
								</li>
							))
						) : (
							<li className='p-2 text-white'>Нет результатов</li>
						)}
					</ul>
				</div>
			)}
			{showHint && (
				<div className='absolute w-1/2 mt-2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg left-1/2'>
					<p className='p-2 text-white'>
						Введите <strong>u:</strong> для поиска пользователей, <strong>p:</strong> для поиска постов или <strong>c:</strong> для поиска категорий.
					</p>
				</div>
			)}
		</header>
	);
};

export default Header;