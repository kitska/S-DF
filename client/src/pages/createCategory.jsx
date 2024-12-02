import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Sidebar from '../components/sidebar';
import CategoryHandler from '../api/categoryHandler';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
	const [categoryName, setCategoryName] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSubmit = async e => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const token = localStorage.getItem('token');

		try {
			const categoryData = { title: categoryName };
			await CategoryHandler.createCategory(categoryData, token);
			navigate('/');
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col min-h-screen bg-gray-800'>
			<Header />
			<div className='flex flex-grow mt-20'>
				<Sidebar />
				<div className='flex-grow p-10'>
					<div className='max-w-2xl p-8 mx-auto bg-gray-700 rounded-lg shadow-lg'>
						<h1 className='mb-6 text-3xl font-bold text-center text-white'>Add the category</h1>
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div>
								<label htmlFor='categoryName' className='block mb-2 text-lg font-medium text-gray-300'>
									The name of the category
								</label>
								<input
									type='text'
									id='categoryName'
									value={categoryName}
									onChange={e => setCategoryName(e.target.value)}
									className='w-full p-3 text-gray-300 bg-gray-600 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
									placeholder='Enter the name of the category'
									required
								/>
							</div>
							{error && <p className='text-red-500'>{error}</p>}
							<button
								type='submit'
								className={`w-full py-3 text-lg font-medium text-white rounded-lg ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
								disabled={loading}
							>
								{loading ? 'Creating ... ' : ' Create a category'}
							</button>
						</form>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AddCategory;
