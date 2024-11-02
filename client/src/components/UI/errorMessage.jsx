// components/ErrorMessage.jsx

import React from 'react';

const ErrorMessage = ({ errorCode, errorMessage }) => {
	return (
		<div className='p-4 mt-4 text-white bg-red-600 rounded'>
			<h3 className='font-bold'>{errorCode}</h3>
			<p>{errorMessage}</p>
		</div>
	);
};

export default ErrorMessage;
