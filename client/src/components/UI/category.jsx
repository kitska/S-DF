import React from 'react';
import { Link } from 'react-router-dom';

const Category = ({ name, categoryId, isLinkEnabled = true, onClick }) => {
	return isLinkEnabled ? (
		<Link to={`/category/${categoryId}`} className='px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded'>
			{name}
		</Link>
	) : (
		<div className='px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded cursor-pointer' onClick={onClick}>
			{name}
		</div>
	);
};

export default Category;
