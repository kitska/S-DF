import React, { useEffect, useState } from 'react';
import Comment from './UI/comment';
import PostHandler from '../api/postHandler';
import { buildCommentTree } from '../utils/commentBuilder';

const CommentsList = ({ postId }) => {
	const [comments, setComments] = useState([]);
	const [newCommentContent, setNewCommentContent] = useState('');

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await PostHandler.getCommentsForPost(postId);
				const commentTree = buildCommentTree(response.data.comments);
				setComments(commentTree);
			} catch (error) {
				console.error('Error when downloading comments:', error);
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
			const newComment = response.data.comment;

			setComments(prevComments => [
				...prevComments,
				{
					...newComment,
					User: {
						login: newComment.User.login,
						profile_picture: newComment.User.profile_picture,
					},
					publish_date: newComment.publish_date,
					replies: [],
				},
			]);

			setNewCommentContent('');
			window.scrollTo({
				top: document.body.scrollHeight,
				behavior: 'smooth',
			});
		} catch (error) {
			console.error('Error in creating a comment:', error.message);
		}
	};

	return (
		<div>
			<div className='mb-4'>
				<textarea
					className='w-full p-3 text-white bg-gray-700 rounded-lg'
					value={newCommentContent}
					onChange={e => setNewCommentContent(e.target.value)}
					placeholder='Enter a new comment...'
				/>
				<button className='px-4 py-2 mt-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500' onClick={handleNewCommentSubmit}>
					Send
				</button>
			</div>

			{comments.map(comment => (
				<Comment key={comment.id} comment={comment} postId={postId} setComments={setComments} />
			))}
		</div>
	);
};

export default CommentsList;
