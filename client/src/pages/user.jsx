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
	const [favoritePosts, setFavoritePosts] = useState([]);
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
		navigate(`/user/${id}/edit-profile`);
	};

	const fetchUserData = async userId => {
		try {
			const response = await UserHandler.getUserById(userId);
			if (response.status === 200) {
				setUser(response.data);
			} else {
				setError('It was not possible to download the user data.');
			}
		} catch (error) {
			setError(error.message || 'Profile loading error');
		}
	};

	const formatPost = async post => {
		if (!post) {
			return null;
		}

		try {
			const likeResponse = await PostHandler.getLikesAndDislikesForPost(post.id, 'like');
			const dislikeResponse = await PostHandler.getLikesAndDislikesForPost(post.id, 'dislike');

			return {
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
				likes: likeResponse?.data?.likeCount || 0,
				dislikes: dislikeResponse?.data?.dislikeCount || 0,
			};
		} catch (error) {
			console.error('Error for loading data about likes and dislikes:', error.message);
			return null;
		}
	};

	const fetchUserPosts = async () => {
		try {
			const formattedWrittenPosts = [];
			const formattedLikedPosts = [];
			const formattedFavoritePosts = [];

			try {
				const writtenResponse = await UserHandler.getUserPosts(id);
				if (writtenResponse?.data) {
					const posts = await Promise.all(writtenResponse.data.map(formatPost));
					formattedWrittenPosts.push(...posts);
				}
			} catch (error) {
				if (error.response?.status !== 404) console.error('Error in obtaining written posts:', error.message);
			}

			try {
				const likedResponse = await UserHandler.getUserLikedPosts(id);
				if (likedResponse?.data) {
					const posts = await Promise.all(likedResponse.data.map(item => formatPost(item.Post)));
					formattedLikedPosts.push(...posts);
				}
			} catch (error) {
				if (error.response?.status !== 404) console.error('Error in obtaining your favorite posts:', error.message);
			}

			if (isOwnProfile) {
				try {
					const favoritesResponse = await UserHandler.getUserFavorites(token);
					if (favoritesResponse?.data) {
						const posts = await Promise.all(favoritesResponse.data.map(item => formatPost(item.Post)));
						formattedFavoritePosts.push(...posts);
					}
				} catch (error) {
					if (error.response?.status !== 404) console.error('Error in obtaining selected posts:', error.message);
				}
			}

			setWrittenPosts(formattedWrittenPosts);
			setLikedPosts(formattedLikedPosts);
			setFavoritePosts(formattedFavoritePosts);
		} catch (error) {
			console.error('General error of loading posts:', error.message);
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
		if (!isOwnProfile && (activeTab === 'liked' || activeTab === 'favorite')) {
			return <p className='text-gray-300'>You do not have access to this information.</p>;
		}

		switch (activeTab) {
			case 'written':
				return writtenPosts.map(post => (post?.id ? <Post key={post.id} {...post} /> : null));
			case 'liked':
				return likedPosts.map(post => (post?.id ? <Post key={post.id} {...post} /> : null));
			case 'favorite':
				return favoritePosts.map(post => (post?.id ? <Post key={post.id} {...post} /> : null));
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
					{loading && <p>Profile load...</p>}
					{error && <p className='text-red-500'>{error}</p>}

					{user && (
						<div className='relative flex flex-col items-center p-8 bg-gray-700 rounded-lg shadow-lg'>
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

							<img src={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture}`} alt='Profile' className='object-cover w-32 h-32 mb-4 rounded-full shadow-md' />
							<h2 className='text-3xl font-semibold text-white'>{user.full_name}</h2>
							<p className='text-xl text-blue-400'>{user.role}</p>
							<p className='mt-2 text-gray-300'>
								<span className='text-gray-200'>{user.login}</span>
							</p>
							<p className='text-gray-400'>
								Rating: <span className={`text-sm ${user.rating > 0 ? 'text-green-500' : user.rating < 0 ? 'text-red-500' : 'text-gray-400'}`}>{user.rating}</span>
							</p>
							<p className='text-sm text-gray-400'>
								The account was created: <span className='text-gray-300'>{formatDate(user.created_at)}</span>
							</p>
						</div>
					)}

					<div className='mt-6'>
						<div className='flex justify-center space-x-4'>
							<button
								onClick={() => setActiveTab('written')}
								className={`px-6 py-2 rounded-lg font-medium ${activeTab === 'written' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500'}`}
							>
								Written posts
							</button>
							{isOwnProfile && (
								<>
									<button
										onClick={() => setActiveTab('liked')}
										className={`px-6 py-2 rounded-lg font-medium ${
											activeTab === 'liked' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500'
										}`}
									>
										Liked posts
									</button>
									<button
										onClick={() => setActiveTab('favorite')}
										className={`px-6 py-2 rounded-lg font-medium ${
											activeTab === 'favorite' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-blue-500'
										}`}
									>
										Favorites posts
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
