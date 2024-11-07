// src/components/Category.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Category = ({ name, categoryId }) => {
	return (
		<Link to={`/category/${categoryId}`} className='px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded'>
			{name}
		</Link>
	);
};

export default Category;
