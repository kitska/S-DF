import React, { useEffect, useState, useRef } from 'react';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
import CommentList from '../components/commentsList';
import PostHandler from '../api/postHandler';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import { formatDate } from '../utils/formatDate';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import hljs from 'highlight.js';

const PostPage = () => {
	const navigate = useNavigate()
	const { postId } = useParams();
	const [post, setPost] = useState(null);
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);
	const [isFavorite, setIsFavorite] = useState(false);
	const [error, setError] = useState(null);
	const postRef = useRef(null);

	useEffect(() => {
		const fetchPostData = async () => {
			try {
				const postResponse = await PostHandler.getPostById(postId);
				const post = postResponse.data.post;

				const formattedPost = {
					id: post.id,
					title: post.title,
					content: post.content,
					author: post.User.login,
					authorAvatar: post.User.profile_picture,
					date: formatDate(post.publish_date),
					status: post.status === 'active',
					categories: post.Categories.map(category => ({
						id: category.id,
						title: category.title,
					})),
				};

				setPost(formattedPost);

				const likeResponse = await PostHandler.getLikesAndDislikesForPost(postId, 'like');
				setLikes(likeResponse.data.likeCount);

				const dislikeResponse = await PostHandler.getLikesAndDislikesForPost(postId, 'dislike');
				setDislikes(dislikeResponse.data.likeCount);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchPostData();
	}, [postId]);

	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	const convertToHTML = markdown => {
		return marked(markdown);
	};
	
	useEffect(() => {
		if (postRef.current) {
			hljs.highlightAll();
		}
	}, [post]);

	if (error) return <div className='text-red-500'>{error}</div>;
	if (!post) return <div className='text-gray-500'>Загрузка...</div>;

	const avatarUrl = `${process.env.REACT_APP_BASE_URL}/${post.authorAvatar}`;

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6 bg-gray-700'>
					<div className='p-8 mx-auto mb-8 transition-transform duration-300 bg-gray-900 rounded-lg shadow-md max-w-screen-2xl'>
						<h1 className='text-4xl font-bold text-gray-100'>{post.title}</h1>
						<a href='https://github.com/DMYTRO-DOLHII'>
							<hr className='h-1 my-4 border-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' />
						</a>
						{/* Отображаем содержимое поста с поддержкой Markdown */}
						<div className='mt-4 prose prose-lg text-gray-200 prose-invert' ref={postRef} dangerouslySetInnerHTML={{ __html: convertToHTML(post.content) }}></div>
						<div className='flex items-center mt-4'>
							<img src={avatarUrl} alt={`${post.author}'s avatar`} className='w-10 h-10 mr-2 rounded-full' />
							<span className='text-sm text-gray-500'>{post.author}</span>
							<span className='ml-4 text-sm text-gray-500'>{post.date}</span>
							<span
								className={`ml-2 inline-block w-2 h-2 rounded-full ${post.status ? 'bg-green-500' : 'bg-red-500'}`}
								title={post.status ? 'Активен' : 'Неактивен'}
							></span>
						</div>
						<div className='flex mt-4 space-x-6 text-gray-300'>
							<div className='flex items-center'>
								<FaThumbsUp className='mr-2 text-blue-600 transition-all hover:text-blue-400' />
								<span>{likes}</span>
							</div>
							<div className='flex items-center'>
								<FaThumbsDown className='mr-2 text-red-600 transition-all hover:text-red-400' />
								<span>{dislikes}</span>
							</div>
							<div className='flex items-center'>
								<FaStar className={`mr-2 ${isFavorite ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-500 transition-all`} onClick={toggleFavorite} />
							</div>
						</div>
						<div className='mt-6'>
							<h2 className='py-2 text-3xl font-semibold text-gray-100'>Комментарии</h2>
							<CommentList postId={postId} />
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default PostPage;
