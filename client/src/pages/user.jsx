import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import UserHandler from '../api/userHandler';
import { decodeToken } from '../utils/decodeJWT';
import Post from '../components/UI/post';
import PostHandler from '../api/postHandler';
import { formatDate } from '../utils/formatDate';

const UserProfilePage = () => {
	const { id } = useParams(); // ID пользователя из URL
	const [user, setUser] = useState(null);
	const [writtenPosts, setWrittenPosts] = useState([]);
	const [likedPosts, setLikedPosts] = useState([]);
	const [favouritePosts, setFavouritePosts] = useState([]);
	const [activeTab, setActiveTab] = useState('written');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem('token');
	const currentUserId = decodeToken(token);
	const isOwnProfile = Number(id) === currentUserId;

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
			const favouritesResponse = await UserHandler.getUserFavourites(token);

			const formattedWrittenPosts = await Promise.all(writtenResponse.data.map(formatPost));
			const formattedLikedPosts = await Promise.all(likedResponse.data.map(item => formatPost(item.Post)));
			const formattedFavouritePosts = await Promise.all(favouritesResponse.data.map(item => formatPost(item.Post)));

			setWrittenPosts(formattedWrittenPosts);
			setLikedPosts(formattedLikedPosts);
			setFavouritePosts(formattedFavouritePosts);
		} catch (error) {
			setError('Ошибка при загрузке постов');
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
		if (!isOwnProfile) {
			// Если это не личный аккаунт, скрыть вкладки "Лайкнутые" и "Избранные"
			if (activeTab === 'liked' || activeTab === 'favourite') {
				return <p className='text-gray-300'>У вас нет доступа к этой информации.</p>;
			}
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
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6 bg-gray-500'>
					{loading && <p className='text-gray-300'>Загрузка профиля...</p>}
					{error && <p className='text-red-500'>{error}</p>}

					{user && (
						<div className='p-4 mb-6 bg-gray-800 rounded-lg shadow-md'>
							<h2 className='text-2xl font-semibold text-gray-100'>{isOwnProfile ? 'Мой профиль' : `Профиль пользователя ${user.full_name}`}</h2>
							<p className='text-gray-300'>Логин: {user.login}</p>
							<p className='text-gray-300'>Рейтинг: {user.rating}</p>
							<img src={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture}`} alt='Profile' className='object-cover w-32 h-32 mt-4 rounded-full' />
						</div>
					)}

					{/* Вкладки для переключения */}
					<div className='mb-4'>
						<button onClick={() => setActiveTab('written')} className={`px-4 py-2 mr-2 ${activeTab === 'written' ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded`}>
							Написанные посты
						</button>
						{isOwnProfile && (
							<>
								<button
									onClick={() => setActiveTab('liked')}
									className={`px-4 py-2 mr-2 ${activeTab === 'liked' ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded`}
								>
									Лайкнутые посты
								</button>
								<button
									onClick={() => setActiveTab('favourite')}
									className={`px-4 py-2 ${activeTab === 'favourite' ? 'bg-blue-500' : 'bg-gray-700'} text-white rounded`}
								>
									Избранные посты
								</button>
							</>
						)}
					</div>

					{/* Рендер активной вкладки */}
					<div className='space-y-4'>{renderActiveTab()}</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default UserProfilePage;
