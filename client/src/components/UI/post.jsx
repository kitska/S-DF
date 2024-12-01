import React, { useState, useRef, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
import Category from './category';
import { Link, useNavigate } from 'react-router-dom';
import PostHandler from '../../api/postHandler';
import { decodeToken } from '../../utils/decodeJWT';
import UserHandler from '../../api/userHandler';

const Post = ({ id, title, content, author, authorAvatar, likes, dislikes, date, status, categories = [] }) => {
	const navigate = useNavigate();
	const [showAllCategories, setShowAllCategories] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [isFavorite, setIsFavorite] = useState(false);
	const timeoutRef = useRef(null);
	const token = localStorage.getItem('token');
	const user = decodeToken(token);

	const maxVisibleCategories = 3;
	const visibleCategories = categories.slice(0, maxVisibleCategories);
	const hasMoreCategories = categories.length > maxVisibleCategories;

	useEffect(() => {
		const checkIfFavorite = async () => {
			try {
				const favoritesResponse = await UserHandler.getUserFavorites(token);
				const favoritePostIds = favoritesResponse.data.map(fav => fav.post_id);
				setIsFavorite(favoritePostIds.includes(parseInt(id)));
			} catch (error) {
				console.warn('Error when receiving selected posts:', error);
			}
		};

		checkIfFavorite();
	}, [id, token]);

	const handleMouseEnter = () => {
		setIsHovered(true);
		clearTimeout(timeoutRef.current);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			if (!showAllCategories) {
				setIsHovered(false);
			}
		}, 200);
	};

	const handleToggleCategories = () => {
		setShowAllCategories(!showAllCategories);
	};

	const toggleFavorite = async event => {
		event.stopPropagation();
		try {
			if (isFavorite) {
				await PostHandler.deletePostFromFavorites(id, token);
				setIsFavorite(false);
			} else {
				await PostHandler.addPostToFavorites(id, token);
				setIsFavorite(true);
			}
		} catch (error) {
			console.error('Error when adding/removing from the favorites:', error);
		}
	};

	const handleMouseEnterCategories = () => {
		clearTimeout(timeoutRef.current);
		setShowAllCategories(true);
	};

	const handleMouseLeaveCategories = () => {
		timeoutRef.current = setTimeout(() => {
			setShowAllCategories(false);
		}, 200);
	};

	const handlePostClick = () => {
		navigate(`/post/${id}`)
	};

	const avatarUrl = `${process.env.REACT_APP_BASE_URL}/${authorAvatar}`;

	return (
		<div className='block cursor-pointer'>
			<div
				className={`relative p-4 mb-4 bg-gray-900 rounded-lg shadow-md transition-transform duration-300 ${isHovered ? 'scale-[101%] z-10' : ''}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handlePostClick}
			>
				<div className='flex flex-col justify-between md:flex-row'>
					<div className='w-full md:w-3/4'>
						<h2 className='text-lg font-semibold text-gray-100'>{title}</h2>
						<p className='flex items-center mt-1 text-xs text-gray-500'>
							<img src={avatarUrl} alt={`${author}'s avatar`} className='object-cover w-6 h-6 mr-2 rounded-full' />
							{author} | {date}
							<span className={`ml-2 inline-block w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} title={status ? 'Active' : 'Inactive'}></span>
						</p>
					</div>
					<div className='flex flex-col items-end w-full mt-4 md:w-1/4 md:mt-0'>
						<div className='flex items-center mb-2 space-x-2 text-gray-400'>
							<button className='flex items-center' onClick={event => event.stopPropagation()}>
								<FaThumbsUp className='mr-1 text-blue-600' /> {likes}
							</button>
							<button className='flex items-center' onClick={event => event.stopPropagation()}>
								<FaThumbsDown className='mr-1 text-red-600' /> {dislikes}
							</button>
							<button className={`flex items-center hover:text-yellow-400 ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`} onClick={toggleFavorite}>
								<FaStar className='mr-1' />
							</button>
						</div>
						<div className='flex items-center space-x-1 text-xs text-gray-500'>
							{visibleCategories.map((category, index) => (
								<Category
									key={category.id}
									name={category.title}
									categoryId={category.id}
									onClick={event => {
										event.stopPropagation();
									}}
									className='mr-2'
								/>
							))}
							{hasMoreCategories && (
								<span
									className='px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded cursor-pointer select-none'
									onMouseEnter={handleMouseEnterCategories}
									onMouseLeave={handleMouseLeaveCategories}
									onClick={event => {
										event.stopPropagation();
										handleToggleCategories();
									}}
								>
									...
								</span>
							)}
						</div>
					</div>
				</div>

				{showAllCategories && (
					<div
						className='absolute right-0 w-48 p-2 mt-2 bg-gray-800 rounded-md shadow-lg z-100'
						onMouseEnter={handleMouseEnterCategories}
						onMouseLeave={handleMouseLeaveCategories}
					>
						<h3 className='mb-2 text-xs font-semibold text-center text-gray-200'>All Categories</h3>
						<div className='flex flex-wrap mt-2 space-x-1 text-xs text-gray-100'>
							{categories.map((category, index) => (
								<Category key={category.id} name={category.title} categoryId={category.id} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Post;
