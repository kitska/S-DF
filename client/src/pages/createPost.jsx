// src/pages/CreatePostPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import { marked } from 'marked'; // Corrected import statement
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa'; // Add icons for likes, dislikes, and favorite

marked.setOptions({
	gfm: true,
	breaks: true,
	sanitize: false,
});

const categoriesList = ['News', 'Tutorial', 'Review', 'Interview', 'Opinion', 'Announcement'];

const CreatePostPage = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [categorySearch, setCategorySearch] = useState('');
	const [filteredCategories, setFilteredCategories] = useState(categoriesList);
	const [isFavorite, setIsFavorite] = useState(false); // Track favorite state
	const [likes, setLikes] = useState(0); // Track likes
	const [dislikes, setDislikes] = useState(0); // Track dislikes

	const handleCategorySearch = e => {
		const searchValue = e.target.value.toLowerCase();
		setCategorySearch(searchValue);
		setFilteredCategories(categoriesList.filter(cat => cat.toLowerCase().includes(searchValue)));
	};

	const handleSubmit = e => {
		e.preventDefault();
		// Add functionality to save the post here
	};

	// Convert the markdown content to HTML using 'marked'
	const convertToHTML = markdown => {
		return marked(markdown);
	};

	// Toggle the favorite status
	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-800'>
			<Header />
			<div className='flex flex-1 mt-20'>
				<Sidebar />
				<main className='flex flex-col items-center justify-center flex-1 p-6'>
					<div className='w-full max-w-6xl p-12 bg-gray-700 rounded shadow-lg'>
						<h2 className='text-3xl font-bold text-center text-white'>Create New Post</h2>
						<form onSubmit={handleSubmit} className='mt-6 space-y-6'>
							<div>
								<label className='block text-gray-300'>Title</label>
								<input
									type='text'
									value={title}
									onChange={e => setTitle(e.target.value)}
									className='w-full px-6 py-4 text-gray-900 bg-gray-300 rounded focus:outline-none'
									placeholder='Enter post title'
									required
								/>
							</div>

							<div>
								<label className='block text-gray-300'>Content</label>
								<textarea
									value={content}
									onChange={e => setContent(e.target.value)}
									className='w-full px-6 py-4 text-gray-900 bg-gray-300 rounded focus:outline-none'
									placeholder='Write your post content here (Markdown supported)'
									rows='8'
									required
								></textarea>
							</div>

							<div>
								<label className='block text-gray-300'>Category Search</label>
								<input
									type='text'
									value={categorySearch}
									onChange={handleCategorySearch}
									className='w-full px-6 py-4 text-gray-900 bg-gray-300 rounded focus:outline-none'
									placeholder='Search categories...'
								/>
							</div>

							{/* Conditionally display category list if there is something in the search input */}
							{categorySearch && (
								<div>
									<label className='block text-gray-300'>Select Category</label>
									<ul className='p-2 overflow-y-auto bg-gray-300 rounded max-h-40'>
										{filteredCategories.length === 0 ? (
											<li className='text-gray-600'>No categories found</li>
										) : (
											filteredCategories.map((cat, index) => (
												<li key={index} className='px-4 py-2 cursor-pointer hover:bg-gray-400' onClick={() => setCategorySearch(cat)}>
													{cat}
												</li>
											))
										)}
									</ul>
								</div>
							)}

							<button type='submit' className='w-full py-3 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600'>
								Publish Post
							</button>
						</form>
					</div>

					{/* Below is the preview of the Markdown content */}
					<div className='w-full max-w-6xl p-8 mx-auto mt-6 bg-gray-900 rounded-lg shadow-md'>
						<h3 className='text-2xl font-bold text-gray-100'>Post Preview</h3>
						{/* Post Preview Structure */}
						<div className='mt-4 text-white'>
							<h1 className='text-4xl font-bold text-gray-100'>{title}</h1>
							<div className='mt-4 prose prose-lg text-gray-200 prose-invert' dangerouslySetInnerHTML={{ __html: convertToHTML(content) }} />

							{/* Author Info */}
							<div className='flex items-center pt-4 mt-6 border-t border-gray-600'>
								<img src={`https://placehold.it/40x40`} alt='Author Avatar' className='w-10 h-10 mr-2 rounded-full' />
								<div className='flex flex-col'>
									<span className='text-sm text-gray-300'>Author</span>
									<span className='text-xs text-gray-500'>Date</span>
								</div>
							</div>

							{/* Categories */}
							<div className='mt-4'>
								<span className='text-sm font-semibold text-gray-300'>Categories: </span>
								{filteredCategories.length > 0 &&
									filteredCategories.map((cat, idx) => (
										<span key={idx} className='mr-2 text-gray-400'>
											{cat}
										</span>
									))}
							</div>

							{/* Likes and Dislikes */}
							<div className='flex mt-6 space-x-6 text-gray-300'>
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
						</div>
					</div>
				</main>
			</div>
			<Footer />
		</div>
	);
};

export default CreatePostPage;
