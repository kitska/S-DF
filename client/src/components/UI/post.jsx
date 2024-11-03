// src/components/UI/Post.jsx
import React, { useState, useRef } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import Category from './category';

const Post = ({ title, content, author, likes, dislikes, date, status, categories = [] }) => {
	const [showAllCategories, setShowAllCategories] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const timeoutRef = useRef(null);

	const maxVisibleCategories = 3;
	const visibleCategories = categories.slice(0, maxVisibleCategories);
	const hasMoreCategories = categories.length > maxVisibleCategories;

	const handleMouseEnter = () => {
		setIsHovered(true);
		clearTimeout(timeoutRef.current); // Очищаем таймер при наведении
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setIsHovered(false);
			setShowAllCategories(false); // Закрываем окно после задержки
		}, 200); // Задержка в 200 мс
	};

	const handleToggleCategories = () => {
		setShowAllCategories(!showAllCategories);
	};

	return (
		<div
			className='relative p-3 mb-3 bg-gray-900 rounded-lg shadow-sm'
			onMouseLeave={handleMouseLeave} // Убираем общий mouse leave с поста
		>
			<div className='flex justify-between'>
				<div className='w-3/4'>
					<h2 className='text-lg font-semibold text-gray-100'>{title}</h2>
					<p className='mt-1 text-sm text-gray-400'>{content}</p>
					<p className='mt-1 text-xs text-gray-500'>
						{author} | {date}
						<span className={`ml-2 inline-block w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} title={status ? 'Активен' : 'Неактивен'}></span>
					</p>
				</div>
				<div className='flex flex-col items-end w-1/4'>
					<div className='flex items-center mb-2 space-x-2 text-gray-400'>
						<button className='flex items-center hover:text-gray-200'>
							<FaThumbsUp className='mr-1' /> {likes}
						</button>
						<button className='flex items-center hover:text-gray-200'>
							<FaThumbsDown className='mr-1' /> {dislikes}
						</button>
					</div>
					<div className='flex items-center space-x-1 text-xs text-gray-500'>
						{visibleCategories.map((category, index) => (
							<Category key={index} name={category} className='mr-2' />
						))}
						{hasMoreCategories && (
							<span
								className='px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded cursor-pointer select-none'
								onMouseEnter={() => {
									setShowAllCategories(true);
								}}
								onMouseLeave={handleMouseLeave} // Добавляем mouse leave для "..."
								onClick={handleToggleCategories}
							>
								...
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Выпадающее окно для показа всех категорий */}
			{(showAllCategories || isHovered) && (
				<div
					className='absolute right-0 z-50 w-48 p-2 mt-2 bg-gray-800 rounded-md shadow-lg'
					onMouseEnter={() => {
						setShowAllCategories(true);
						clearTimeout(timeoutRef.current); // Очищаем таймер при наведении на окно
					}}
					onMouseLeave={handleMouseLeave} // Закрываем окно, если курсор уходит
				>
					<h3 className='mb-2 text-xs font-semibold text-center text-gray-200'>All Categories</h3>
					<div className='flex flex-wrap mt-2 space-x-1 text-xs text-gray-100'>
						{categories.map((category, index) => (
							<Category key={index} name={category} className='mr-2' />
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Post;
