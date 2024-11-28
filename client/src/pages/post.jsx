import React, { useEffect, useState, useRef } from 'react';
import { FaThumbsUp, FaThumbsDown, FaStar, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import CommentList from '../components/commentsList';
import PostHandler from '../api/postHandler';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import { formatDate } from '../utils/formatDate';
import { useNavigate, useParams } from 'react-router-dom';
import Category from '../components/UI/category';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { decodeToken } from '../utils/decodeJWT';
import UserHandler from '../api/userHandler';

const PostPage = () => {
	const navigate = useNavigate();
	const { postId } = useParams();
	const [post, setPost] = useState(null);
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);
	const [userReaction, setUserReaction] = useState(null);
	const [isFavorite, setIsFavorite] = useState(false);
	const [error, setError] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState('');
	const [editedTitle, setEditedTitle] = useState('');
	const [editedStatus, setEditedStatus] = useState('');
	const postRef = useRef(null);
	const token = localStorage.getItem('token');
	const user = decodeToken(token);

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
					authorId: post.User.id,
					authorAvatar: post.User.profile_picture,
					date: formatDate(post.publish_date),
					status: post.status === 'active',
					categories: post.Categories.map(category => ({
						id: category.id,
						title: category.title,
					})),
				};

				setPost(formattedPost);
				setEditedContent(formattedPost.content);
				setEditedTitle(formattedPost.title);
				setEditedStatus(formattedPost.status ? 'active' : 'inactive');

				const likeResponse = await PostHandler.getLikesAndDislikesForPost(postId, 'like', user?.id);
				setLikes(likeResponse.data.likeCount);
				setUserReaction(likeResponse.data.userLikes.length > 0 ? 'like' : null);

				const dislikeResponse = await PostHandler.getLikesAndDislikesForPost(postId, 'dislike', user?.id);
				setDislikes(dislikeResponse.data.likeCount);
				if (userReaction === null && dislikeResponse.data.userLikes.length > 0) {
					setUserReaction('dislike');
				}

				try {
					const favoritesResponse = await UserHandler.getUserFavorites(token);
					const favoritePostIds = favoritesResponse.data.map(fav => fav.post_id);
					setIsFavorite(favoritePostIds.includes(parseInt(postId)));
				} catch (favoritesError) {
					console.warn(favoritesError);
					setIsFavorite(false);
				}
			} catch (err) {
				setError(err.message);
			}
		};

		fetchPostData();
	}, [postId, token, user?.id]);

	const toggleFavorite = async () => {
		try {
			if (isFavorite) {
				await PostHandler.deletePostFromFavorites(postId, token);
				setIsFavorite(false);
			} else {
				await PostHandler.addPostToFavorites(postId, token);
				setIsFavorite(true);
			}
		} catch (error) {
			setError(error.message);
		}
	};

	const convertToHTML = markdown => {
		return marked(markdown);
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleSave = async () => {
		try {
			const postData = {
				content: editedContent,
				title: editedTitle,
				status: editedStatus,
			};
			await PostHandler.updatePost(postId, postData, token);
			setPost(prevPost => ({ ...prevPost, content: editedContent, title: editedTitle, status: editedStatus === 'active' }));
			setIsEditing(false);
		} catch (err) {
			setError(err.message);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditedContent(post.content);
		setEditedTitle(post.title);
		setEditedStatus(post.status ? 'active' : 'inactive');
		setPost(currPost => ({ ...currPost }));
	};

	const handleDelete = async () => {
		try {
			await PostHandler.deletePost(postId, token);
			navigate('/');
		} catch (err) {
			setError(err.message);
		}
	};

	const handleLike = async () => {
		if (userReaction === 'like') {
			await PostHandler.deleteLikeForPost(postId, token);
			setLikes(prev => prev - 1);
			setUserReaction(null);
		} else {
			if (userReaction === 'dislike') {
				await PostHandler.deleteLikeForPost(postId, token);
				setDislikes(prev => prev - 1);
			}
			await PostHandler.createLikeForPost(postId, { type: 'like' }, token);
			setLikes(prev => prev + 1);
			setUserReaction('like');
		}
	};

	const handleDislike = async () => {
		if (userReaction === 'dislike') {
			await PostHandler.deleteLikeForPost(postId, token);
			setDislikes(prev => prev - 1);
			setUserReaction(null);
		} else {
			if (userReaction === 'like') {
				await PostHandler.deleteLikeForPost(postId, token);
				setLikes(prev => prev - 1);
			}
			await PostHandler.createLikeForPost(postId, { type: 'dislike' }, token);
			setDislikes(prev => prev + 1);
			setUserReaction('dislike');
		}
	};

	useEffect(() => {
		if (postRef.current) {
			hljs.highlightAll();
		}
	}, [post]);

	if (error) return <div className='text-red-500'>{error}</div>;
	if (!post) return <div className='text-gray-500'>Loading...</div>;

	const avatarUrl = `${process.env.REACT_APP_BASE_URL}/${post.authorAvatar}`;
	const canEditOrDelete = user && (user.id === post.authorId || user.role === 'admin');

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6 overflow-x-hidden bg-gray-700'>
					<div className='p-8 mx-auto mb-8 transition-transform duration-300 bg-gray-900 rounded-lg shadow-md max-w-screen-2xl'>
						<div className='flex flex-col'>
							{canEditOrDelete && (
								<div className='flex justify-end mb-2 space-x-4'>
									<button className='flex items-center px-4 py-2 text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-500' onClick={handleEdit}>
										<FaEdit className='mr-1' /> Edit
									</button>
									<button className='flex items-center px-4 py-2 text-white transition duration-200 bg-red-600 rounded hover:bg-red-500' onClick={handleDelete}>
										<FaTrash className='mr-1' /> Delete
									</button>
								</div>
							)}
							<h1 className='text-4xl font-bold text-gray-100'>{post.title}</h1>
						</div>
						<a href='https://github.com/DMYTRO-DOLHII'>
							<hr className='h-1 my-4 border-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' />
						</a>
						{isEditing ? (
							<div>
								<label className='block text-gray-300'>Title</label>
								<input
									type='text'
									className='w-full p-2 my-2 text-gray-900 bg-gray-200 rounded'
									value={editedTitle}
									onChange={e => setEditedTitle(e.target.value)}
								/>
								<label className='block text-gray-300'>Content</label>
								<textarea className='w-full p-2 text-gray-900 bg-gray-200 rounded h-96' value={editedContent} onChange={e => setEditedContent(e.target.value)} />
								<div className='flex items-center mt-2'>
									<label className='mr-2 text-gray-200'>Status:</label>
									<div className='relative'>
										<input
											type='checkbox'
											checked={editedStatus === 'active'}
											onChange={e => setEditedStatus(e.target.checked ? 'active' : 'inactive')}
											className='hidden'
										/>
										<div
											className={`w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer ${
												editedStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
											}`}
											onClick={() => setEditedStatus(editedStatus === 'active' ? 'inactive' : 'active')}
										>
											<div
												className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
													editedStatus === 'active' ? 'translate-x-6' : 'translate-x-0'
												}`}
											></div>
										</div>
									</div>
								</div>
								<div className='flex justify-end mt-2 space-x-1'>
									<button className='flex items-center px-4 py-2 text-white transition duration-200 bg-green-600 rounded hover:bg-green-500' onClick={handleSave}>
										<FaSave className='mr-1' /> Save
									</button>
									<button className='flex items-center px-4 py-2 text-white transition duration-200 bg-gray-600 rounded hover:bg-gray-500' onClick={handleCancel}>
										<FaTimes className='mr-1' /> Cancel
									</button>
								</div>
							</div>
						) : (
							<div className='mt-4 prose prose-lg text-gray-200 prose-invert' ref={postRef} dangerouslySetInnerHTML={{ __html: convertToHTML(post.content) }}></div>
						)}
						<div className='flex flex-wrap mt-4 space-x-1'>
							{post.categories.length > 0 ? (
								post.categories.map(cat => <Category key={cat.id} name={cat.title} categoryId={cat.id} />)
							) : (
								<span className='text-gray-500'>No categories selected</span>
							)}
						</div>
						<div className='flex items-center mt-4'>
							<img src={avatarUrl} alt={`${post.author}'s avatar`} className='object-cover w-10 h-10 mr-2 rounded-full' />
							<span className='text-sm text-gray-500'>{post.author}</span>
							<span className='ml-4 text-sm text-gray-500'>{post.date}</span>
							<span
								className={`ml-2 inline-block w-2 h-2 rounded-full ${post.status ? 'bg-green-500' : 'bg-red-500'}`}
								title={post.status === 'active' ? 'Active' : 'Inactive'}
							></span>
						</div>
						<div className='flex mt-4 space-x-6 text-gray-300'>
							<div className='flex items-center cursor-pointer' onClick={handleLike}>
								<FaThumbsUp className={`mr-2 ${userReaction === 'like' ? 'text-blue-600' : 'hover:text-blue-400'}`} />
								<span>{likes}</span>
							</div>
							<div className='flex items-center cursor-pointer' onClick={handleDislike}>
								<FaThumbsDown className={`mr-2 ${userReaction === 'dislike' ? 'text-red-600' : 'hover:text-red-400'}`} />
								<span>{dislikes}</span>
							</div>
							<div className='flex items-center'>
								<FaStar className={`mr-2 ${isFavorite ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-500 transition-all`} onClick={toggleFavorite} />
							</div>
						</div>
						<div className='mt-6'>
							<h2 className='py-2 text-3xl font-semibold text-gray-100'>Comments</h2>
							<CommentList postId={postId} postStatus={post.status} />
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default PostPage;