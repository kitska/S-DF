import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import User from '../components/UI/user';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import UserHandler from '../api/userHandler';
import Pagination from '../components/UI/pagination';
import { Link } from 'react-router-dom';

const UsersPage = () => {
	const [users, setUsers] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	// Получаем `page` из URL
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const currentPage = Number(searchParams.get('page')) || 1;

	const fetchUsers = async page => {
		setLoading(true);
		try {
			const response = await UserHandler.getAllUsers(page, 28, '', 'id', 'desc');
			if (response.status === 200) {
				setUsers(response.data.users);
				setTotalPages(response.data.totalPages);
			}
		} catch (error) {
			setError(error.message || 'Ошибка при загрузке пользователей');
		} finally {
			setLoading(false);
		}
	};

	// Обновляем данные при изменении страницы
	useEffect(() => {
		fetchUsers(currentPage);
	}, [currentPage]);

	const handlePageChange = page => {
		setSearchParams({ page }); // Обновляем URL при смене страницы
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-700'>
			<Header />
			<div className='flex flex-grow mt-24'>
				<Sidebar />
				<div className='flex-grow p-6'>
					{loading && <p className='text-gray-300'>Загрузка пользователей...</p>}
					{error && <p className='text-red-500'>{error}</p>}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{' '}
						{/* Добавили grid */}
						{users.length > 0 ? (
							users.map(user => (
								<Link to={`/user/${user.id}`}>
									<div key={user.id} className='p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-600'>
										<User
											fullName={user.login.length > 15 ? `${user.login.slice(0, 15)}...` : user.login}
											profilePicture={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture}`}
											rating={user.rating}
											userId={user.id}
										/>
									</div>
								</Link>
							))
						) : (
							<p className='text-gray-200'>Пользователи не найдены.</p>
						)}
					</div>
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} pageType='users' />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default UsersPage;
