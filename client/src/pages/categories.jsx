import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import Category from '../components/UI/category';
import CategoryHandler from '../api/categoryHandler';
import Pagination from '../components/UI/pagination';

const CategoriesPage = () => {
	const [categories, setCategories] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Получаем `page` из URL
	const [searchParams, setSearchParams] = useSearchParams();
	const currentPage = Number(searchParams.get('page')) || 1;

	const fetchCategories = async page => {
		setLoading(true);
		try {
			const response = await CategoryHandler.getAllCategories(page, 44, '', 'id', 'asc');
			if (response.status === 200) {
				setCategories(response.data.categories);
				setTotalPages(response.data.totalPages);
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Обновляем данные при изменении страницы
	useEffect(() => {
		fetchCategories(currentPage);
	}, [currentPage]);

	const handlePageChange = page => {
		setSearchParams({ page }); // Обновляем URL при смене страницы
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-700'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-6'>
					{loading && <p className='text-gray-300'>Загрузка категорий...</p>}
					{error && <p className='text-red-500'>{error}</p>}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{categories.map(category => (
							<div key={category.id} className='p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-600'>
								<Category name={category.title} />
							</div>
						))}
					</div>
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} pageType='categories' />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default CategoriesPage;
