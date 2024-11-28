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
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isTopUsersVisible, setIsTopUsersVisible] = useState(window.innerWidth > 1069);

	const fetchPosts = async () => {
		try {
			const response = await PostHandler.getAllPosts(1, '', '', 'created_at', 'desc');
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
							dislikes: dislikeResponse.data.likeCount || 0,
						};
					})
				);
				setPosts(formattedPosts);
			}
		} catch (error) {
			setError(error.message);
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(prevState => !prevState);
	};

	useEffect(() => {
		fetchPosts();

		const handleResize = () => {
			setIsTopUsersVisible(window.innerWidth > 1069);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className='flex flex-col min-h-screen overflow-x-hidden'>
			<Header toggleSidebar={toggleSidebar} />
			<div className='flex flex-grow mt-20'>
				<Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
				<div className='flex-grow p-6 bg-gray-800'>
					{error && <p className='text-red-500'>{error}</p>}
					{posts.map(post => (
						<Post key={post.id} {...post} />
					))}
				</div>
				{isTopUsersVisible && <TopUsers />}
			</div>
			<Footer />
		</div>
	);
};

export default Home;
