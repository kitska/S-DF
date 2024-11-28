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
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers(currentPage);
	}, [currentPage]);

	const handlePageChange = page => {
		setSearchParams({ page });
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-800'>
			<Header />
			<div className='flex flex-grow mt-24'>
				<Sidebar />
				<div className='flex-grow p-6'>
					{loading && <p className='text-gray-300'>User loading...</p>}
					{error && <p className='text-red-500'>{error}</p>}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{' '}
						{users.map(user => (
							<Link key={user.id} to={`/user/${user.id}`}>
								<div className='p-4 rounded-lg hover:bg-gray-600'>
									<User
										fullName={user.login.length > 15 ? `${user.login.slice(0, 15)}...` : user.login}
										profilePicture={`${process.env.REACT_APP_BASE_URL}/${user.profile_picture}`}
										rating={user.rating}
										userId={user.id}
									/>
								</div>
							</Link>
						))}
					</div>
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} pageType='users' />
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default UsersPage;
