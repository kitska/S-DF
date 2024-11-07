// src/pages/CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostHandler from '../api/postHandler';
import CategoryHandler from '../api/categoryHandler';
import Post from '../components/UI/post';
import { formatDate } from '../utils/formatDate';

const CategoryPage = () => {
	const { categoryId } = useParams();
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState(null);

	const fetchPostsByCategory = async () => {
		try {
			const response = await CategoryHandler.getPostsByCategory(categoryId);
			if (response.status === 200) {
				console.log(response.data);
				const formattedPosts = await Promise.all(
					response.data.posts.map(async post => {
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
							dislikes: dislikeResponse.data.likeCount || 0,
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
		fetchPostsByCategory();
	}, [categoryId]);

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-semibold'>Posts in Category</h1>
			{error && <p className='text-red-500'>{error}</p>}
			{posts.length > 0 ? posts.map(post => <Post key={post.id} {...post} />) : <p className='text-gray-200'>Посты не найдены.</p>}
		</div>
	);
};

export default CategoryPage;
