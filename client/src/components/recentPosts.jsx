// src/components/RecentPosts.jsx
import React, { useState, useEffect } from 'react';
import Post from './UI/post';
import axios from 'axios';

const RecentPosts = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchRecentPosts = async () => {
			try {
				const response = await axios.get('/api/posts/recent');
				setPosts(response.data.slice(0, 10)); // Берем только 5 последних постов
			} catch (error) {
				console.error('Ошибка загрузки постов:', error);
				// Заглушка на случай ошибки
				setPosts([
					{ id: 1, title: 'Sample Post 1', content: 'This is a sample post content.', author: 'Author 1' },
					{ id: 2, title: 'Sample Post 2', content: 'This is a sample post content.', author: 'Author 2' },
				]);
			}
		};

		fetchRecentPosts();
	}, []);

	return (
		<div>
			{posts.map(post => (
				<Post key={post.id} title={post.title} content={post.content} author={post.author} />
			))}
		</div>
	);
};

export default RecentPosts;
