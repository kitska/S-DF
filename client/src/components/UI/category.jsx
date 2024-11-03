// src/components/Category.jsx
import React from 'react';

const Category = ({ name }) => {
	return <span className='px-2 py-1 mt-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded'>{name}</span>;
};

export default Category;
