import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import PostHandler from '../api/postHandler';
import CategoryHandler from '../api/categoryHandler';
import { formatDate } from '../utils/formatDate';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import Category from '../components/UI/category';

const LazyPost = React.lazy(() => import('../components/UI/post'));

const CategoryPage = () => {
	const { categoryId } = useParams();
	const [allPosts, setAllPosts] = useState([]); // Храним все посты
	const [visiblePosts, setVisiblePosts] = useState([]); // Посты, которые будут отображаться
	const [error, setError] = useState(null);
	const [cat, setCat] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadingMore, setLoadingMore] = useState(false);
	const [postsPerPage, setPostsPerPage] = useState(20); // Количество постов для загрузки

	const fetchPostsByCategory = async () => {
		setLoading(true);
		try {
			const response = await CategoryHandler.getPostsByCategory(categoryId); // Получаем все посты
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
				setAllPosts(formattedPosts); // Сохраняем все посты
				setVisiblePosts(formattedPosts.slice(0, postsPerPage)); // Отображаем только первые посты
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const fetchCategory = async () => {
		try {
			const category = await CategoryHandler.getCategoryById(categoryId);
			setCat(category.data.category);
		} catch (error) {
			setError(error.message);
		}
	};

	useEffect(() => {
		fetchCategory();
		fetchPostsByCategory(); // Загружаем все посты
	}, [categoryId]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loadingMore && !loading) {
				setLoadingMore(true);
				setTimeout(() => {
					setVisiblePosts(prevVisiblePosts => {
						const nextPosts = allPosts.slice(prevVisiblePosts.length, prevVisiblePosts.length + postsPerPage);
						return [...prevVisiblePosts, ...nextPosts];
					});
					setLoadingMore(false);
				}, 1000); // Задержка для имитации загрузки
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [loadingMore, loading, allPosts]);

	return (
		<div className='flex flex-col min-h-screen text-gray-300 bg-gray-800'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<main className='flex-grow p-6'>
					<div className='flex items-center justify-center mb-8 center'>
						<h1 className='text-3xl font-bold text-center text-gray-100'>Posts in Category: </h1>
						{cat && <Category name={cat.title} categoryId={cat.id} isLinkEnabled={false} />}
					</div>
					{loading && <p className='text-center text-gray-400'>Loading posts...</p>}
					{error && <p className='text-center text-red-500'>{error}</p>}

					<Suspense fallback={<p className='text-center text-gray-400'>Loading post...</p>}>
						{visiblePosts.length > 0
							? visiblePosts.map(post => <LazyPost key={post.id} {...post} />)
							: !loading && <p className='text-center text-gray-400'>No posts found in this category.</p>}
					</Suspense>
					{loadingMore && <p className='text-center text-gray-400'>Loading more posts...</p>}
				</main>
			</div>
			<Footer />
		</div>
	);
};

export default CategoryPage;