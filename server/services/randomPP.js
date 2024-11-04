export const getRandomProfilePicture = () => {
	const pictures = ['assets/img/default.png', 'assets/img/default2.png'];
	return pictures[Math.floor(Math.random() * pictures.length)];
};
