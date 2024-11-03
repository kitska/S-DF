// src/pages/home.jsx
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import TopUsers from '../components/topUsers';
import Post from '../components/UI/post';

const Home = () => {
	const posts = [
		{
			title: 'Post 1',
			content: 'This is a short preview of post 1',
			author: 'Author 1',
			likes: 10,
			dislikes: 2,
			date: '2024-11-03',
			status: true,
			categories: ['Tech', 'News', 'Health', 'Lifestyle'],
		},
		{
			title: 'Post 2',
			content: 'This is a short preview of post 2',
			author: 'Author 2',
			likes: 5,
			dislikes: 1,
			date: '2024-11-02',
			status: false,
			categories: ['Health', 'Lifestyle', 'Tech'],
		},
		{
			title: 'Post 3',
			content: 'This is a short preview of post 1',
			author: 'Author 1',
			likes: 10,
			dislikes: 2,
			date: '2024-11-03',
			status: true,
			categories: ['Tech', 'News'],
		},
		{
			title: 'Post 4',
			content: 'This is a short preview of post 2',
			author: 'Author 2',
			likes: 5,
			dislikes: 1,
			date: '2024-11-02',
			status: false,
			categories: ['Health', 'Lifestyle'],
		},
		{
			title: 'Post 5',
			content: 'This is a short preview of post 1',
			author: 'Author 1',
			likes: 10,
			dislikes: 2,
			date: '2024-11-03',
			status: true,
			categories: ['Tech', 'News'],
		},
		{
			title: 'Post 6',
			content: 'This is a short preview of post 2',
			author: 'Author 2',
			likes: 5,
			dislikes: 1,
			date: '2024-11-02',
			status: false,
			categories: ['Health', 'Lifestyle'],
		},
		{
			title: 'Post 7',
			content: 'This is a short preview of post 1',
			author: 'Author 1',
			likes: 10,
			dislikes: 2,
			date: '2024-11-03',
			status: true,
			categories: ['Tech', 'News'],
		},
		{
			title: 'Post 8',
			content: 'This is a short preview of post 2',
			author: 'Author 2',
			likes: 5,
			dislikes: 1,
			date: '2024-11-02',
			status: false,
			categories: ['Health', 'Lifestyle'],
		},
		{
			title: 'Post 9',
			content: 'This is a short preview of post 1',
			author: 'Author 1',
			likes: 10,
			dislikes: 2,
			date: '2024-11-03',
			status: true,
			categories: ['Tech', 'News'],
		},
		{
			title: 'Post 10',
			content: 'This is a short preview of post 2',
			author: 'Author 2',
			likes: 5,
			dislikes: 1,
			date: '2024-11-02',
			status: false,
			categories: ['Health', 'Lifestyle'],
		},
		// Добавьте другие посты аналогично...
	];

	return (
		<div className='flex flex-col min-h-screen'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6 bg-gray-500'>
					{posts.map((post, index) => (
						<Post key={index} {...post} />
					))}
				</div>
				<TopUsers />
			</div>
			<Footer />
		</div>
	);
};

export default Home;
