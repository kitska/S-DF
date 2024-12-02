import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/images/2-3.png';
import UserHandler from '../api/userHandler';
import PostHandler from '../api/postHandler';
import CategoryHandler from '../api/categoryHandler';
import { decodeToken } from '../utils/decodeJWT';
import User from './UI/user';
import Post from './UI/post';
import Category from './UI/category';
import { formatDate } from '../utils/formatDate';

const Header = ({ toggleSidebar }) => {
	const token = localStorage.getItem('token');
	const navigate = useNavigate();
	const [userAvatar, setUserAvatar] = useState(null);
	const [login, setLogin] = useState(null);
	const [userId, setUserId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const [showHint, setShowHint] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 1069);
	const [isLoadingUser, setIsLoadingUser] = useState(true);

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
						console.error('Error when receiving user data:', error);
					} finally {
						setIsLoadingUser(false);
					}
				} else {
					setIsLoadingUser(false);
				}
			} else {
				setIsLoadingUser(false);
			}
		};

		fetchUserData();
	}, [token]);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 1069);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleSearch = async e => {
		const term = e.target.value;
		setSearchTerm(term);
		setShowResults(true);

		if (term.trim() === '') {
			setSearchResults([]);
			setShowHint(true);
			return;
		}

		setLoading(true);
		setShowHint(false);

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
					console.error('Error: an array of users is expected', response);
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
					console.error('Error: an array of posts is expected', response);
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
					console.error('Error: Categories are expected', response);
					setSearchResults([]);
				}
			} else {
				setSearchResults([]);
			}
		} catch (error) {
			console.error('Error when searching:', error);
			setSearchResults([]);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = e => {
		const term = e.target.value;
		setSearchTerm(term);

		if (term === '') {
			setSearchResults([]);
			setShowResults(false);
			setShowHint(true);
		} else {
			setShowHint(false);
			handleSearch(e);
		}
	};

	const handleBlur = () => {
		setTimeout(() => {
			setShowResults(false);
			setShowHint(false);
		}, 100);
	};

	const handleFocus = () => {
		if (searchTerm === '') {
			setShowHint(true);
		} else {
			setShowResults(true);
		}
	};

	const handleLogoClick = e => {
		if (isMobile) {
			e.preventDefault();
			try {
				toggleSidebar();
			} catch (error) {
				navigate('/');
			}
		}
	};

	return (
		<header className='fixed top-0 left-0 z-50 w-full py-4 bg-gray-900'>
			<div className='container flex items-center justify-between max-w-5xl p-2 mx-auto bg-gray-800 rounded-lg shadow-lg'>
				<div className='flex-shrink-0'>
					<a href='/' onClick={handleLogoClick}>
						<img src={logoImage} alt='Logo' className='w-auto h-8' />
					</a>
				</div>

				<form className='flex-grow mx-3' onSubmit={e => e.preventDefault()}>
					<input
						type='text'
						placeholder='Search...'
						className='w-full p-1 text-white bg-gray-700 border border-gray-600 rounded-full'
						value={searchTerm}
						onChange={handleInputChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
					/>
				</form>

				<div className='flex items-center space-x-3'>
					{isLoadingUser ? (
						<div className='flex w-11 h-11'></div>
					) : userAvatar ? (
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

			{showResults && (
				<div className='absolute w-1/2 mt-2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg left-1/2' style={{ maxHeight: '300px', overflowY: 'auto' }}>
					<ul>
						{searchResults.length > 0 ? (
							searchResults.map(item => (
								<li key={item.id} className='p-2'>
									{item.type === 'user' ? (
										<User
											fullName={item.login.length > 15 ? `${item.login.slice(0, 15)}...` : item.login}
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
							<li className='p-2 text-white'>There are no results</li>
						)}
					</ul>
				</div>
			)}
			{showHint && (
				<div className='absolute w-1/2 mt-2 transform -translate-x-1/2 bg-gray-800 rounded-md shadow-lg left-1/2'>
					<p className='p-2 text-white'>
						Enter <strong> u: </strong> to search for users, <strong> p: </strong> for searching for posts or <strong> c: </strong> to search for categories.
					</p>
				</div>
			)}
		</header>
	);
};

export default Header;
