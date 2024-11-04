import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import TopUsers from '../components/topUsers';
import Post from '../components/UI/post';
import PostHandler from '../api/postHandler';
import { formatDate } from '../utils/formatDate';

const Home = () => {
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);

	const fetchPosts = async () => {
		try {
			const response = await PostHandler.getAllPosts(1, '', '', 'created_at', 'desc');
			if (response.status === 200) {
				// Маппинг постов с извлечением данных о пользователе и категориях
				const formattedPosts = await Promise.all(
					response.data.posts.map(async post => {
						// Получаем лайки и дизлайки для каждого поста
						const likeResponse = await PostHandler.getLikesAndDislikesForPost(post.id, 'like');
						const dislikeResponse = await PostHandler.getLikesAndDislikesForPost(post.id, 'dislike');

						return {
							id: post.id,
							title: post.title,
							content: `${post.content.slice(0, 100)}...`, // Пример короткого превью
							author: post.User.login, // Имя автора
							date: formatDate(post.publish_date),
							status: post.status === 'active', // Перекодирование статуса
							categories: post.Categories.map(category => category.title), // Извлечение заголовков категорий
							likes: likeResponse.data.likeCount || 0, // Число лайков
							dislikes: dislikeResponse.data.likeCount || 0, // Число дизлайков
						};
					})
				);
				setPosts(formattedPosts);
			}
		} catch (error) {
			setError(error.message || 'Ошибка при загрузке постов');
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6 bg-gray-500'>
					{error && <p className='text-red-500'>{error}</p>}
					{posts.length > 0 ? posts.map(post => <Post key={post.id} {...post} />) : <p className='text-gray-200'>Посты не найдены.</p>}
				</div>
				<TopUsers />
			</div>
			<Footer />
		</div>
	);
};

export default Home;
