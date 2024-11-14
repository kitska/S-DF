import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import Post from '../components/UI/post';
import Pagination from '../components/UI/pagination';
import PostHandler from '../api/postHandler';
import { formatDate } from '../utils/formatDate';

const PostsPage = () => {
	const [posts, setPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); // Добавляем состояние для отслеживания загрузки

	// Получаем `page` из URL
	const [searchParams, setSearchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const fetchPosts = async page => {
		setLoading(true); // Устанавливаем загрузку в true при начале запроса
		try {
			const response = await PostHandler.getAllPosts(page);
			if (response.status === 200) {
				const formattedPosts = await Promise.all(
					response.data.posts.map(async post => {
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
							likes: likeResponse.data.likeCount || 0,
							dislikes: dislikeResponse.data.dislikeCount || 0,
						};
					})
				);
				setPosts(formattedPosts);
				setTotalPages(response.data.totalPages);
			} else {
				setError('Не удалось загрузить посты. Попробуйте позже.');
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false); // Отключаем состояние загрузки после завершения запроса
		}
	};

	// Обновляем данные при изменении страницы
	useEffect(() => {
		fetchPosts(currentPage);
	}, [currentPage]);

	const handlePageChange = page => {
		setSearchParams({ page }); // Обновляем URL при смене страницы
	};

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6 bg-gray-700'>
					{loading && <p className='text-gray-300'>Загрузка постов...</p>} {/* Индикатор загрузки */}
					{error && <p className='text-red-500'>{error}</p>}
					{posts.map(post => (
						<Post key={post.id} {...post} />
					))}
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} pageType='posts' />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default PostsPage;
