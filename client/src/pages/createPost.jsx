// src/pages/CreatePostPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import { marked } from 'marked'; // Corrected import statement
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa'; // Add icons for likes, dislikes, and favorite
import Category from '../components/UI/category';
import hljs from 'highlight.js';
import CategoryHandler from '../api/categoryHandler';
import PostHandler from '../api/postHandler';

const CreatePostPage = () => {
	const navigate = useNavigate();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [categorySearch, setCategorySearch] = useState('');
	const [filteredCategories, setFilteredCategories] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [isFavorite, setIsFavorite] = useState(false); // Track favorite state
	const [likes, setLikes] = useState(0); // Track likes
	const [dislikes, setDislikes] = useState(0); // Track dislikes
	const [showDropdown, setShowDropdown] = useState(false);
	const token = localStorage.getItem('token');
	const previewRef = useRef(null);

	// Загружаем категории из API
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const total = await CategoryHandler.getAllCategories(1, 1); // Загружаем до 1000 категорий
				const response = await CategoryHandler.getAllCategories(1, total.data.totalPages);
				setAllCategories(response.data.categories || []); // Предполагается, что API возвращает массив `categories`
			} catch (error) {
				console.error('Ошибка при загрузке категорий:', error.message);
			}
		};
		fetchCategories();
	}, []);

	const handleCategorySearch = event => {
		const searchValue = event.target.value;
		setCategorySearch(searchValue);

		if (searchValue) {
			// Filter based on the title of the category objects
			const filtered = allCategories.filter(cat => cat.title.toLowerCase().includes(searchValue.toLowerCase()));
			setFilteredCategories(filtered.map(cat => cat.title)); // Set only titles as strings
			setShowDropdown(true);
		} else {
			setFilteredCategories([]);
			setShowDropdown(false);
		}
	};

	const handleCategorySelect = category => {
		// Check if the category is already selected
		if (!selectedCategories.some(cat => cat.id === category.id)) {
			setSelectedCategories([...selectedCategories, category]); // Add selected category
		}
		setCategorySearch('');
		setShowDropdown(false);
	};

	const handleRemoveCategory = categoryId => {
		setSelectedCategories(selectedCategories.filter(cat => cat.id !== categoryId)); // Remove category by ID
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const postData = {
			title,
			content,
			categories: selectedCategories.map(category => category.id), // Преобразуем строку в массив чисел
		};

		try {
			const response = await PostHandler.createPost(postData, token);
			navigate(`/post/${response.data.post.id}`);
		} catch (error) {
			console.error('Ошибка при создании поста:', error);
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Tab') {
			e.preventDefault(); // Prevent the default behavior (moving to the next input)
			const { selectionStart, selectionEnd } = e.target;
			const newValue = content.substring(0, selectionStart) + '\t' + content.substring(selectionEnd);
			setContent(newValue);
			// Move the cursor to the right after the inserted tab
			setTimeout(() => {
				e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
			}, 0);
		}
	};

	// Convert the markdown content to HTML using 'marked'
	const convertToHTML = markdown => {
		return marked(markdown);
	};

	// Toggle the favorite status
	const toggleFavorite = () => {
		setIsFavorite(!isFavorite);
	};

	useEffect(() => {
		if (previewRef.current) {
			hljs.highlightAll();
		}
	}, [content]);

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
									onKeyDown={handleKeyDown}
									className='w-full px-6 py-4 text-gray-900 bg-gray-300 rounded focus:outline-none'
									placeholder='Write your post content here (Markdown supported)'
									rows='8'
									required
								></textarea>
							</div>

							<div className='relative w-full'>
								{/* Поле поиска */}
								<label className='block mb-2 text-gray-300'>Category Search</label>
								<input
									type='text'
									value={categorySearch}
									onChange={handleCategorySearch}
									className='w-full px-6 py-4 text-gray-900 bg-gray-300 rounded focus:outline-none'
									placeholder='Search categories...'
									onFocus={() => categorySearch && setShowDropdown(true)} // Показываем список при фокусе, если есть поиск
								/>

								{/* Выпадающий список */}
								{showDropdown && (
									<span className='z-10 flex w-full p-2 mt-1 overflow-y-auto bg-gray-300 rounded shadow max-h-40'>
										{filteredCategories.length === 0 ? (
											<span className='text-gray-600'>No categories found</span>
										) : (
											filteredCategories.map((catTitle, index) => {
												// Find the category object by title if needed
												const category = allCategories.find(cat => cat.title === catTitle);
												return (
													<Category
														key={index}
														name={catTitle}
														categoryId={category ? category.id : null}
														isLinkEnabled={false}
														onClick={() => handleCategorySelect(category)} // Pass the full category object
													/>
												);
											})
										)}
									</span>
								)}
							</div>

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
							<div className='mt-4 prose prose-lg text-gray-200 prose-invert' ref={previewRef} dangerouslySetInnerHTML={{ __html: convertToHTML(content) }} />

							{/* Author Info */}	
							<div className='flex items-center pt-4 mt-6'>
								<img src={`https://placehold.it/40x40`} alt='Author Avatar' className='w-10 h-10 mr-2 rounded-full' />
								<div className='flex flex-row space-x-2'>
									<span className='text-sm text-gray-300'>Author</span>
									<span className='text-xs text-gray-500'>Date</span>
								</div>
							</div>

							{/* Categories */}
							<div className='flex flex-wrap mt-4'>
								{' '}
								{/* Add flex and flex-wrap classes */}
								{selectedCategories.length > 0 ? (
									selectedCategories.map(cat => (
										<Category
											key={cat.id}
											name={cat.title}
											categoryId={cat.id}
											isLinkEnabled={false}
											onClick={() => handleRemoveCategory(cat.id)} // Optional: If you want to add click functionality
										/>
									))
								) : (
									<span className='text-gray-500'>No categories selected</span>
								)}
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
