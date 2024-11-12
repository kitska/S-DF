// src/components/UI/Notification.jsx
import React from 'react';

const Notification = ({ message, onClose }) => {
	return (
		<div className='fixed z-50 flex items-center justify-between p-4 text-white bg-green-600 rounded-lg shadow-lg top-4 right-4 w-80'>
			<span>{message}</span>
			<button onClick={onClose} className='ml-4 text-white focus:outline-none'>
				&times;
			</button>
		</div>
	);
};

export default Notification;
