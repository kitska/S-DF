// src/components/Post.jsx
import React from 'react';

const Post = ({ title, content, author }) => {
	return (
		<div className='p-4 mb-4 text-white bg-gray-800 rounded-lg shadow-md'>
			<h2 className='text-xl font-bold'>{title}</h2>
			<p className='text-gray-300'>{content}</p>
			<p className='mt-2 text-sm text-gray-500'>By {author}</p>
		</div>
	);
};

export default Post;
