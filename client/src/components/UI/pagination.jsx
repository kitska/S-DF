import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pagination = ({ currentPage, totalPages, onPageChange, pageType }) => {
	const navigate = useNavigate();

	const handlePageChange = page => {
		onPageChange(page);
		navigate(`/${pageType}?page=${page}`);
	};

	const handlePrevious = () => {
		if (currentPage > 1) handlePageChange(currentPage - 1);
	};

	const handleNext = () => {
		if (currentPage < totalPages) handlePageChange(currentPage + 1);
	};

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 3), currentPage + 2);

	return (
		<div className='flex items-center justify-center mt-6 space-x-2'>
			{currentPage > 1 && (
				<button onClick={() => handlePageChange(1)} className='px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
					1
				</button>
			)}

			<button
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
			>
				&larr; Prev
			</button>

			{pages.map(page => (
				<button
					key={page}
					onClick={() => handlePageChange(page)}
					className={`px-3 py-1 rounded-lg transition ${currentPage === page ? 'bg-blue-700 text-white font-semibold' : 'bg-gray-400 text-gray-700 hover:bg-gray-300'}`}
				>
					{page}
				</button>
			))}

			<button
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
			>
				Next &rarr;
			</button>

			{currentPage < totalPages && (
				<button onClick={() => handlePageChange(totalPages)} className='px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
					{totalPages}
				</button>
			)}
		</div>
	);
};

export default Pagination;
