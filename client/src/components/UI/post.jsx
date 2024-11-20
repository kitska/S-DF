// src/components/UI/Post.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaStar } from 'react-icons/fa';
import Category from './category';
import { Link } from 'react-router-dom';
import PostHandler from '../../api/postHandler'; // Импортируем API для работы с постами
import { decodeToken } from '../../utils/decodeJWT'; // Импортируем функцию для декодирования токена
import UserHandler from '../../api/userHandler';

const Post = ({ id, title, content, author, authorAvatar, likes, dislikes, date, status, categories = [] }) => {
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
		// Проверяем, находится ли пост в избранном
		const checkIfFavorite = async () => {
			try {
				const favouritesResponse = await UserHandler.getUserFavourites(token);
				const favouritePostIds = favouritesResponse.data.map(fav => fav.post_id);
				setIsFavorite(favouritePostIds.includes(parseInt(id))); // Проверяем, есть ли пост в избранном
			} catch (error) {
				console.warn('Ошибка при получении избранных постов:', error);
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

	const toggleFavorite = async () => {
		try {
			if (isFavorite) {
				// Если пост уже в избранном, удаляем его
				await PostHandler.deletePostFromFavourites(id, token);
				setIsFavorite(false);
			} else {
				// Если пост не в избранном, добавляем его
				await PostHandler.addPostToFavourites(id, token);
				setIsFavorite(true);
			}
		} catch (error) {
			console.error('Ошибка при добавлении/удалении из избранного:', error);
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

	const avatarUrl = `${process.env.REACT_APP_BASE_URL}/${authorAvatar}`;
	
	return (
		<Link to={`/post/${id}`} className='block'>
			<div
				className={`relative p-4 mb-4 bg-gray-900 rounded-lg shadow-md transition-transform duration-300 ${isHovered ? 'scale-[101%] z-10' : ''}`}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className='flex justify-between'>
					<div className='w-3/4'>
						<h2 className='text-lg font-semibold text-gray-100'>{title}</h2>
						<p className='flex items-center mt-1 text-xs text-gray-500'>
							{/* Display avatar */}
							<img src={avatarUrl} alt={`${author}'s avatar`} className='w-6 h-6 mr-2 rounded-full' />
							{author} | {date}
							<span className={`ml-2 inline-block w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} title={status ? 'Активен' : 'Неактивен'}></span>
						</p>
					</div>
					<div className='flex flex-col items-end w-1/4'>
						<div className='flex items-center mb-2 space-x-2 text-gray-400'>
							<button className='flex items-center '>
 <FaThumbsUp className='mr-1 text-blue-600' /> {likes}
							</button>
							<button className='flex items-center'>
								<FaThumbsDown className='mr-1 text-red-600' /> {dislikes}
							</button>
							<button className={`flex items-center hover:text-yellow-400 ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`} onClick={toggleFavorite}>
								<FaStar className='mr-1' />
							</button>
						</div>
						<div className='flex items-center space-x-1 text-xs text-gray-500'>
							{visibleCategories.map((category, index) => (
								<Category key={category.id} name={category.title} categoryId={category.id} className='mr-2' />
							))}
							{hasMoreCategories && (
								<span
									className='px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded cursor-pointer select-none'
									onMouseEnter={handleMouseEnterCategories}
									onMouseLeave={handleMouseLeaveCategories}
									onClick={handleToggleCategories}
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
		</Link>
	);
};

export default Post;