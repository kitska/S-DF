import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CommentHandler from '../../api/commentsHandler';
import { decodeToken } from '../../utils/decodeJWT';

const Comment = ({ comment, postId, setComments, isReply = false }) => {
	const [replyContent, setReplyContent] = useState('');
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);
	const [userReaction, setUserReaction] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(comment.content);

	const token = localStorage.getItem('token');
	const user = token ? decodeToken(token) : null;
	const canEditOrDelete = user && (user.id === comment.author_id || user.role === 'admin');

	useEffect(() => {
		const fetchLikesAndDislikes = async () => {
			try {
				const likeResponse = await CommentHandler.getLikesForComment(comment.id, 'like', user?.id);
				setLikes(likeResponse.data.likeCount);
				setUserReaction(likeResponse.data.userLikes.length > 0 ? 'like' : null);

				const dislikeResponse = await CommentHandler.getLikesForComment(comment.id, 'dislike', user?.id);
				setDislikes(dislikeResponse.data.likeCount);
				if (userReaction === null && dislikeResponse.data.userLikes.length > 0) {
					setUserReaction('dislike');
				}
			} catch (error) {
				console.error('Error when receiving likes and dislikes for commentary:', error);
			}
		};

		fetchLikesAndDislikes();
	}, [comment.id, user?.id]);

	const handleReplySubmit = async () => {
		if (!replyContent) return;
		const token = localStorage.getItem('token');

		try {
			const replyData = { content: replyContent };
			const response = await CommentHandler.replyToComment(comment.id, replyData, token);
			const newReply = response.data;

			setComments(prevComments => {
				const updateReplies = comments => {
					return comments.map(c => {
						if (c.id === comment.id) {
							return { ...c, replies: [...(c.replies || []), newReply] };
						} else if (c.replies && c.replies.length > 0) {
							return { ...c, replies: updateReplies(c.replies) };
						}
						return c;
					});
				};
				return updateReplies(prevComments);
			});

			setReplyContent('');
			setShowReplyForm(false);
		} catch (error) {
			console.error('An error when answering a comment:', error.message);
		}
	};

	const handleEditSubmit = async () => {
		try {
			const updatedCommentData = { content: editedContent };
			const response = await CommentHandler.updateComment(comment.id, updatedCommentData, token);
			const updatedComment = response.data.comment;

			setComments(prevComments => {
				return prevComments.map(c => {
					if (c.id === comment.id) {
						return { ...c, ...updatedComment, replies: c.replies || [] };
					}
					if (c.replies) {
						return {
							...c,
							replies: c.replies.map(reply => (reply.id === comment.id ? { ...reply, ...updatedComment } : reply)),
						};
					}
					return c;
				});
			});
			setIsEditing(false);
		} catch (error) {
			console.error('Error in editing comment:', error.message);
		}
	};

	const handleDelete = async () => {
		try {
			await CommentHandler.deleteComment(comment.id, token);
			setComments(prevComments => {
				return prevComments.reduce((acc, c) => {
					if (c.id === comment.id) {
						return acc;
					}
					if (c.replies) {
						const updatedReplies = c.replies.filter(reply => reply.id !== comment.id);
						return [...acc, { ...c, replies: updatedReplies }];
					}
					return [...acc, c];
				}, []);
			});
		} catch (error) {
			console.error('Error when deleting a comment:', error.message);
		}
	};

	const handleLike = async () => {
		if (userReaction === 'like') {
			await CommentHandler.deleteLikeForComment(comment.id, token);
			setLikes(prev => prev - 1);
			setUserReaction(null);
		} else {
			if (userReaction === 'dislike') {
				await CommentHandler.deleteLikeForComment(comment.id, token);
				setDislikes(prev => prev - 1);
			}
			await CommentHandler.createLikeForComment(comment.id, { type: 'like' }, token);
			setLikes(prev => prev + 1);
			setUserReaction('like');
		}
	};

	const handleDislike = async () => {
		if (userReaction === 'dislike') {
			await CommentHandler.deleteLikeForComment(comment.id, token);
			setDislikes(prev => prev - 1);
			setUserReaction(null);
		} else {
			if (userReaction === 'like') {
				await CommentHandler.deleteLikeForComment(comment.id, token);
				setLikes(prev => prev - 1);
			}
			await CommentHandler.createLikeForComment(comment.id, { type: 'dislike' }, token);
			setDislikes(prev => prev + 1);
			setUserReaction('dislike');
		}
	};

	return (
		<div className={`p-4 mb-4 rounded-lg shadow-md ${isReply ? 'bg-gray-700 ml-8' : 'bg-gray-800'}`}>
			<div className='flex items-center mb-2'>
				<Link to={`/user/${comment.author_id}`} className='flex items-center space-x-3'>
					<img src={`${process.env.REACT_APP_BASE_URL}/${comment.User.profile_picture}`} alt='Avatar' className='object-cover w-8 h-8 rounded-full' />
					<div>
						<p className='text-sm font-bold text-white'>{comment.User.login}</p>
						<p className='text-xs text-gray-400'>{new Date(comment.publish_date).toLocaleDateString()}</p>
					</div>
				</Link>
			</div>

			{isEditing ? (
				<div>
					<textarea
						className='w-full p-3 text-white bg-gray-700 rounded-lg'
						value={editedContent}
						onChange={e => setEditedContent(e.target.value)}
						placeholder='Edit a comment...'
					/>
					<button className='px-2 py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500' onClick={handleEditSubmit}>
						<FaSave className='inline mr-1' /> Save
					</button>
					<button className='px-2 py-2 mt-2 ml-2 text-gray-400 bg-gray-600 rounded-lg hover:bg-gray-500' onClick={() => setIsEditing(false)}>
						<FaTimes className='inline mr-1' /> Cancel
					</button>
				</div>
			) : (
				<>
					<p className='text-lg text-gray-200'>{comment.content}</p>
					<div className='flex items-center mt-2 text-gray-300'>
						<div className='flex items-center cursor-pointer' onClick={handleLike}>
							<FaThumbsUp className={`mr-2 ${userReaction === 'like' ? 'text-blue-600' : 'hover:text-blue-400'}`} />
							<span className='text-gray-300'>{likes}</span>
						</div>
						<div className='flex items-center cursor-pointer' onClick={handleDislike}>
							<FaThumbsDown className={`ml-4 mr-2 ${userReaction === 'dislike' ? 'text-red-600' : 'hover:text-red-400'}`} />
							<span className='text-gray-300'>{dislikes}</span>
						</div>
						{!isReply && (
							<button className='ml-4 text-blue-400 hover:text -blue-200' onClick={() => setShowReplyForm(!showReplyForm)}>
								{showReplyForm ? 'Cancel' : 'Reply'}
							</button>
						)}
						{canEditOrDelete && (
							<>
								<button className='ml-4 text-yellow-400 hover:text-yellow-200' onClick={() => setIsEditing(true)}>
									<FaEdit className='inline mr-1' /> Edit
								</button>
								<button className='ml-2 text-red-500 hover:text-red-300' onClick={handleDelete}>
									<FaTrash className='inline mr-1' /> Delete
								</button>
							</>
						)}
					</div>
				</>
			)}

			{showReplyForm && (
				<div className='mt-4'>
					<textarea
						className='w-full p-3 text-white bg-gray-700 rounded-lg'
						value={replyContent}
						onChange={e => setReplyContent(e.target.value)}
						placeholder='Enter the reply...'
					/>
					<button className='px-4 py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500' onClick={handleReplySubmit}>
						Send
					</button>
				</div>
			)}

			{comment.replies && comment.replies.length > 0 && (
				<div className='mt-4 ml-6'>
					{comment.replies.map(reply => (
						<Comment key={reply.id} comment={reply} postId={postId} setComments={setComments} isReply={true} />
					))}
				</div>
			)}
		</div>
	);
};

export default Comment;
