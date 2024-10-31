// src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className='flex justify-center mt-4'>
			{pages.map(page => (
				<button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 mx-1 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-300'} rounded`}>
					{page}
				</button>
			))}
		</div>
	);
};

export default Pagination;
