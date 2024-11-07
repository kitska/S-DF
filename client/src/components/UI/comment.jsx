import React, { useEffect, useState } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import CommentHandler from '../../api/commentsHandler';

const Comment = ({ comment, postId, setComments, isReply = false }) => {
	const [replyContent, setReplyContent] = useState('');
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);

	useEffect(() => {
		const fetchLikesAndDislikes = async () => {
			try {
				const response = await CommentHandler.getLikesForComment(comment.id, "like");
                console.log(response.data);
				setLikes(response.data.likes);
				const dislikeResponse = await CommentHandler.getLikesForComment(comment.id, "dislike"); 
                console.log(dislikeResponse.data);
				setDislikes(dislikeResponse.data.likes);
			} catch (error) {
				console.error('Ошибка при получении лайков и дизлайков для комментария:', error);
			}
		};

		fetchLikesAndDislikes();
	}, [comment.id]);

	const handleReplySubmit = async () => {
		if (!replyContent) return;
		const token = localStorage.getItem('token');

		try {
			const replyData = { content: replyContent };
			const response = await CommentHandler.replyToComment(comment.id, replyData, token);
			const newReply = response.data;

			// Обновляем состояние комментариев, добавляя новый ответ к текущему комментарию
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
			console.error('Ошибка при ответе на комментарий:', error.message);
		}
	};

	return (
		<div className={`p-4 mb-4 rounded-lg shadow-md ${isReply ? 'bg-gray-700 ml-8' : 'bg-gray-800'}`}>
			<p className='text-lg text-gray-200'>
				<strong className='text-yellow-400'>{comment.author}</strong>: {comment.content}
			</p>
			<div className='flex items-center mt-2'>
				<FaThumbsUp className='mr-2 text-blue-600' />
				<span className='text-gray-300'>{likes}</span> {/* Количество лайков */}
				<FaThumbsDown className='ml-4 mr-2 text-red-600' />
				<span className='text-gray-300'>{dislikes}</span> {/* Количество дизлайков */}
				{!isReply && (
					<button className='ml-4 text-blue-400 hover:text-blue-200' onClick={() => setShowReplyForm(!showReplyForm)}>
						{showReplyForm ? 'Отменить' : 'Ответить'}
					</button>
				)}
			</div>

			{showReplyForm && (
				<div className='mt-4'>
					<textarea
						className='w-full p-3 text-white bg-gray-700 rounded-lg'
						value={replyContent}
						onChange={e => setReplyContent(e.target.value)}
						placeholder='Введите ответ...'
					/>
					<button className='px-4 py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500' onClick={handleReplySubmit}>
						Отправить
					</button>
				</div>
			)}

			{/* Отображаем вложенные комментарии */}
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
