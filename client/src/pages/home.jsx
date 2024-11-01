// src/pages/home.jsx
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import TopUsers from '../components/topUsers';
import Post from '../components/UI/post';

const Home = () => {
	const posts = [
		{ title: 'Post 1', content: 'This is the content of post 1', author: 'Author 1' },
		{ title: 'Post 2', content: 'This is the content of post 2', author: 'Author 2' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
		{ title: 'Post 3', content: 'This is the content of post 3', author: 'Author 3' },
	];

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				{' '}
				{/* Убедитесь, что здесь нет h-full */}
				<Sidebar />
				<div className='flex-grow p-6 bg-gray-500'>
					{posts.map((post, index) => (
						<Post key={index} title={post.title} content={post.content} author={post.author} />
					))}
				</div>
				<TopUsers />
			</div>
			<Footer />
		</div>
	);
};

export default Home;
