// SortSelects.js
import React from 'react';

const SortSelects = ({ sortBy, setSortBy, sortOrder, setSortOrder }) => {
	const handleSortByChange = e => {
		setSortBy(e.target.value);
	};

	const handleSortOrderChange = e => {
		setSortOrder(e.target.value);
	};

	return (
		<div className='flex items-center justify-between p-4 mb-4 bg-gray-700 rounded-lg shadow-lg'>
			<div className='flex items-center'>
				<label className='mr-2 text-gray-300'>Sort by:</label>
				<div className='relative'>
					<select
						value={sortBy}
						onChange={handleSortByChange}
						className='block w-full px-4 py-2 pr-8 text-gray-300 transition-all duration-200 bg-gray-600 border border-gray-500 rounded-lg appearance-none focus:outline-none focus:ring-2 hover:bg-gray-500'
					>
						<option value='publish_date'>Date</option>
					</select>
					<span className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
						<svg className='w-4 h-4 text-gray-300' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 12z'
								clipRule='evenodd'
							/>
						</svg>
					</span>
				</div>

				<label className='ml-4 mr-2 text-gray-300'>Order:</label>
				<div className='relative'>
					<select
						value={sortOrder}
						onChange={handleSortOrderChange}
						className='block w-full px-4 py-2 pr-8 text-gray-300 transition-all duration-200 bg-gray-600 border border-gray-500 rounded-lg appearance-none focus:outline-none focus:ring-2 hover:bg-gray-500'
					>
						<option value='asc'>In ascending</option>
						<option value='desc'>In descending</option>
					</select>
					<span className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
						<svg className='w-4 h-4 text-gray-300' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 12z'
								clipRule='evenodd'
							/>
						</svg>
					</span>
				</div>
			</div>
		</div>
	);
};

export default SortSelects;
