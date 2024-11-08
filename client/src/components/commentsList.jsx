import React, { useEffect, useState } from 'react';
import Comment from './UI/comment';
import PostHandler from '../api/postHandler';

const CommentsList = ({ postId }) => {
	const [comments, setComments] = useState([]);
	const [newCommentContent, setNewCommentContent] = useState('');

	const buildCommentTree = comments => {
		const commentMap = {};

		comments.forEach(comment => {
			commentMap[comment.id] = { ...comment, replies: [] };
		});

		const rootComments = [];
		comments.forEach(comment => {
			if (comment.comment_id === null) {
				rootComments.push(commentMap[comment.id]);
			} else {
				commentMap[comment.comment_id].replies.push(commentMap[comment.id]);
			}
		});

		return rootComments;
	};

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await PostHandler.getCommentsForPost(postId);
				const commentTree = buildCommentTree(response.data.comments);
				setComments(commentTree);
			} catch (error) {
				console.error('Ошибка при загрузке комментариев:', error);
			}
		};

		fetchComments();
	}, [postId]);

	const handleNewCommentSubmit = async () => {
		if (!newCommentContent) return;

		const token = localStorage.getItem('token');

		try {
			const newCommentData = { content: newCommentContent, comment_id: null };
			const response = await PostHandler.createCommentForPost(postId, newCommentData, token);

			// Логируем ответ от сервера для отладки
			console.log('Ответ от сервера:', response.data);

			// Извлекаем новый комментарий
			const newComment = response.data.comment; // Используем response.data.comment

			// Проверяем, что новый комментарий содержит id
			if (newComment && newComment.id) {
				// Обновляем состояние комментариев, добавляя новый комментарий
				setComments(prevComments => [
					...prevComments,
					{ ...newComment, replies: [] }, // Убедитесь, что newComment содержит поле id
				]);
			} else {
				console.error('Новый комментарий не содержит id:', newComment);
			}

			setNewCommentContent('');
		} catch (error) {
			console.error('Ошибка при создании комментария:', error.message);
		}
	};
	return (
		<div>
			<div className='mb-4'>
				<textarea
					className='w-full p-3 text-white bg-gray-700 rounded-lg'
					value={newCommentContent}
					onChange={e => setNewCommentContent(e.target.value)}
					placeholder='Введите новый комментарий...'
				/>
				<button className='px-4 py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500' onClick={handleNewCommentSubmit}>
					Отправить
				</button>
			</div>

			{comments.map(comment => (
				<Comment key={comment.id} comment={comment} postId={postId} setComments={setComments} />
			))}
		</div>
	);
};

export default CommentsList;
