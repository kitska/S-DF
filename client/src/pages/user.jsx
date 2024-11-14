import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaEdit } from 'react-icons/fa';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import UserHandler from '../api/userHandler';
import { decodeToken } from '../utils/decodeJWT';
import Post from '../components/UI/post';
import PostHandler from '../api/postHandler';
import { formatDate } from '../utils/formatDate';
import AuthHandler from '../api/authHandler';

const UserProfilePage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [writtenPosts, setWrittenPosts] = useState([]);
	const [likedPosts, setLikedPosts] = useState([]);
	const [favouritePosts, setFavouritePosts] = useState([]);
	const [activeTab, setActiveTab] = useState('written');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem('token');
	const currentUserId = decodeToken(token);
	const isOwnProfile = Number(id) === currentUserId?.id;

	const handleLogout = () => {
		AuthHandler.logoutUser(token);
		localStorage.removeItem('token');
		navigate('/');
	};

	const handleEditProfile = () => {
		navigate(`/user/${id}/edit-profile`); // Absolute path with leading '/'
	};

	const fetchUserData = async userId => {
		try {
			const response = await UserHandler.getUserById(userId);
			if (response.status === 200) {
				setUser(response.data);
			} else {
				setError('Не удалось загрузить данные пользователя.');
			}
		} catch (error) {
			setError(error.message || 'Ошибка при загрузке профиля');
		}
	};

	const formatPost = async post => {
		try {
			const likeResponse = await PostHandler.getLikesAndDislikesForPost(post.id, 'like');
			const dislikeResponse = await PostHandler.getLikesAndDislikesForPost(post.id, 'dislike');
			return {
				id: post.id,
				title: post.title,
				content: `${post.content.slice(0, 100)}...`,
				author: post.User.login,
				date: formatDate(post.publish_date),
				status: post.status === 'active',
				categories: post.Categories.map(category => ({
					id: category.id,
					title: category.title,
				})),
				likes: likeResponse.data.likeCount || 0,
				dislikes: dislikeResponse.data.dislikeCount || 0,
			};
		} catch (error) {
			setError('Ошибка при загрузке данных о лайках и дизлайках');
		}
	};

	const fetchUserPosts = async () => {
		try {
			const writtenResponse = await UserHandler.getUserPosts(id);
			const likedResponse = await UserHandler.getUserLikedPosts(id);
			if (isOwnProfile) {
				const favouritesResponse = await UserHandler.getUserFavourites(token);
				const formattedFavouritePosts = await Promise.all(favouritesResponse.data.map(item => formatPost(item.Post)));
				setFavouritePosts(formattedFavouritePosts);
			}

			const formattedWrittenPosts = await Promise.all(writtenResponse.data.map(formatPost));
			const formattedLikedPosts = await Promise.all(likedResponse.data.map(item => formatPost(item.Post)));

			setWrittenPosts(formattedWrittenPosts);
			setLikedPosts(formattedLikedPosts);
		} catch (error) {
			setError();
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		setLoading(true);
		fetchUserData(id);
		fetchUserPosts();
		setLoading(false);
	}, [id]);

	const renderActiveTab = () => {
		if (!isOwnProfile && (activeTab === 'liked' || activeTab === 'favourite')) {
			return <p className='text-gray-300'>У вас нет доступа к этой информации.</p>;
		}

		switch (activeTab) {
			case 'written':
				return writtenPosts.map(post => (post?.id ? <Post key={post.id} {...post} /> : null));
			case 'liked':
				return likedPosts.map(post => (post?.id ? <Post key={post.id} {...post} /> : null));
			case 'favourite':
				return favouritePosts.map(post => (post?.id ? <Post key={post.id} {...post} /> : null));
			default:
				return null;
		}
	};

	return (
		<div className='flex flex-col min-h-screen text-gray-100 bg-gray-800'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6'>
					{loading && <p>Загрузка профиля...</p>}
					{error && <p className='text-red-500'>{error}</p>}

					{user && (
						<div className='relative flex flex-col items-center p-8 bg-gray-700 rounded-lg shadow-lg'>
							{/* Контейнер с кнопками */}
							<div className='absolute flex flex-col space-y-4 top-4 right-4'>
								{isOwnProfile && (
									<button
										onClick={handleEditProfile}
										className='p-2 text-blue-500 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-blue-700 focus:outline-none'
									>
										<FaEdit size={24} />
									</button>
								)}
								{isOwnProfile && (
									<button onClick={handleLogout} className='p-2 text-red-500 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-red-700 focus:outline-none'>
										<FaSignOutAlt size={24} />
									</button>
								)}
							</div>

							{/* Контент профиля */}
							<img src={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture}`} alt='Profile' className='object-cover w-32 h-32 mb-4 rounded-full shadow-md' />
							<h2 className='text-3xl font-semibold text-white'>{user.full_name}</h2>
							<p className='text-xl text-blue-400'>{user.role}</p>
							<p className='mt-2 text-gray-300'>
								<span className='text-gray-200'>{user.login}</span>
							</p>
							<p className='text-gray-400'>
								Рейтинг: <span className={`text-sm ${user.rating > 0 ? 'text-green-500' : user.rating < 0 ? 'text-red-500' : 'text-gray-400'}`}>{user.rating}</span>
							</p>
							<p className='text-sm text-gray-400'>
								Аккаунт создан: <span className='text-gray-300'>{formatDate(user.created_at)}</span>
							</p>
						</div>
					)}

					<div className='mt-6'>
						<div className='flex justify-center space-x-4'>
							<button
								onClick={() => setActiveTab('written')}
								className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'written' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500'}`}
							>
								Написанные посты
							</button>
							{isOwnProfile && (
								<>
									<button
										onClick={() => setActiveTab('liked')}
										className={`px-6 py-2 rounded-lg font-medium ${
											activeTab === 'liked' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500'
										}`}
									>
										Лайкнутые посты
									</button>
									<button
										onClick={() => setActiveTab('favourite')}
										className={`px-6 py-2 rounded-lg font-medium ${
											activeTab === 'favourite' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500'
										}`}
									>
										Избранные посты
									</button>
								</>
							)}
						</div>

						<div className='mt-8 space-y-6'>{renderActiveTab()}</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default UserProfilePage;
