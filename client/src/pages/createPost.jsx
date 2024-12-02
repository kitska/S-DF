import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import { marked } from 'marked';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
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
	const [isFavorite, setIsFavorite] = useState(false);
	const [likes, setLikes] = useState(0);
	const [dislikes, setDislikes] = useState(0);
	const [showDropdown, setShowDropdown] = useState(false);
	const token = localStorage.getItem('token');
	const previewRef = useRef(null);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const total = await CategoryHandler.getAllCategories(1, 1);
				const response = await CategoryHandler.getAllCategories(1, total.data.totalPages);
				setAllCategories(response.data.categories || []);
			} catch (error) {
				console.error('Error when loading categories:', error.message);
			}
		};
		fetchCategories();
	}, []);

	const handleCategorySearch = event => {
		const searchValue = event.target.value;
		setCategorySearch(searchValue);

		if (searchValue) {
			const filtered = allCategories.filter(cat => cat.title.toLowerCase().includes(searchValue.toLowerCase()));
			setFilteredCategories(filtered.map(cat => cat.title));
			setShowDropdown(true);
		} else {
			setFilteredCategories([]);
			setShowDropdown(false);
		}
	};

	const handleCategorySelect = category => {
		if (!selectedCategories.some(cat => cat.id === category.id)) {
			setSelectedCategories([...selectedCategories, category]);
		}
		setCategorySearch('');
		setShowDropdown(false);
	};

	const handleRemoveCategory = categoryId => {
		setSelectedCategories(selectedCategories.filter(cat => cat.id !== categoryId));
	};

	const handleSubmit = async e => {
		e.preventDefault();
		const postData = {
			title,
			content,
			categories: selectedCategories.map(category => category.id),
		};

		try {
			const response = await PostHandler.createPost(postData, token);
			navigate(`/post/${response.data.post.id}`);
		} catch (error) {
			console.error('Error in creating a post:', error);
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Tab') {
			e.preventDefault();
			const { selectionStart, selectionEnd } = e.target;
			const newValue = content.substring(0, selectionStart) + '\t' + content.substring(selectionEnd);
			setContent(newValue);
			setTimeout(() => {
				e.target.selectionStart = e.target.selectionEnd = selectionStart + 1;
			}, 0);
		}
	};

	const convertToHTML = markdown => {
		return marked(markdown);
	};

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
				<main className='flex flex-col items-center justify-center flex-1 p-6 overflow-hidden'>
					<div className='w-full max-w-6xl p-12 overflow-hidden bg-gray-700 rounded shadow-lg'>
						<h2 className='text-3xl font-bold text-center text-white'>Create New Post</h2>
						<form onSubmit={handleSubmit} className='mt-6 space-y-6'>
							<div>
								<label className='block text-gray-300'>Title</label>
								<input
									type='text'
									value={title}
									onChange={e => setTitle(e.target.value)}
									className='w-full px-6 py-4 overflow-hidden text-gray-900 bg-gray-500 rounded focus:outline-none'
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
									className='w-full px-6 py-4 overflow-y-auto text-gray-900 bg-gray-500 rounded focus:outline-none'
									placeholder='Write your post content here (Markdown supported)'
									rows='8'
									required
								></textarea>
							</div>

							<div className='relative w-full'>
								<label className='block mb-2 text-gray-300'>Category Search</label>
								<input
									type='text'
									value={categorySearch}
									onChange={handleCategorySearch}
									className='w-full px-6 py-4 overflow-hidden text-gray-900 bg-gray-500 rounded focus:outline-none'
									placeholder='Search categories...'
									onFocus={() => categorySearch && setShowDropdown(true)}
								/>

								{showDropdown && (
									<span className='z-10 flex w-full p-2 mt-1 overflow-y-auto bg-gray-300 rounded shadow max-h-40'>
										{filteredCategories.length === 0 ? (
											<span className='text-gray-600'>No categories found</span>
										) : (
											filteredCategories.map((catTitle, index) => {
												const category = allCategories.find(cat => cat.title === catTitle);
												return (
													<Category
														key={index}
														name={catTitle}
														categoryId={category ? category.id : null}
														isLinkEnabled={false}
														onClick={() => handleCategorySelect(category)}
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

					<div className='w-full max-w-6xl p-8 mx-auto mt-6 overflow-hidden bg-gray-900 rounded-lg shadow-md'>
						<h3 className='text-2xl font-bold text-gray-100'>Post Preview</h3>
						<div className='mt-4 text-white'>
							<h1 className='text-4xl font-bold text-gray-100 break-words'>{title}</h1>
							<a href='https://github.com/DMYTRO-DOLHII'>
								<hr className='h-1 my-4 border-0 rounded-full bg-[linear-gradient(to_bottom_left,_#0800A7_0%,_#EC7EEA_91%)]' />
							</a>
							<div className='mt-4 prose prose-lg text-gray-200 prose-invert' ref={previewRef} dangerouslySetInnerHTML={{ __html: convertToHTML(content) }} />

							<div className='flex items-center pt-4 mt-6'>
								<img src={`https://placehold.it/40x40`} alt='Author Avatar' className='w-10 h-10 mr-2 rounded-full' />
								<div className='flex flex-row space-x-2'>
									<span className='text-sm text-gray-300'>Author</span>
									<span className='text-xs text-gray-500'>Date</span>
								</div>
							</div>

							<div className='flex flex-wrap mt-4'>
								{selectedCategories.length > 0 ? (
									selectedCategories.map(cat => (
										<Category key={cat.id} name={cat.title} categoryId={cat.id} isLinkEnabled={false} onClick={() => handleRemoveCategory(cat.id)} />
									))
								) : (
									<span className='text-gray-500'>No categories selected</span>
								)}
							</div>

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
									<FaStar className={`mr-2 ${isFavorite ? 'text-yellow-500' : 'text-gray-400'} transition-all hover:text-yellow-300`} onClick={toggleFavorite} />
									<span>{isFavorite ? 'Favorite' : 'Add to favorites'}</span>
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
