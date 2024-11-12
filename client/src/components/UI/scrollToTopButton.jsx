import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ScrollToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		// Показать кнопку при прокрутке вниз
		const toggleVisibility = () => {
			if (window.scrollY > 450) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener('scroll', toggleVisibility);
		return () => window.removeEventListener('scroll', toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		isVisible && (
			<button
				onClick={scrollToTop}
				className='fixed z-50 p-3 text-white transition-transform transform bg-blue-600 rounded-full shadow-lg bottom-8 right-8 hover:bg-blue-700 hover:scale-110'
			>
				<FontAwesomeIcon icon={faChevronUp} size='lg' />
			</button>
		)
	);
};

export default ScrollToTopButton;
