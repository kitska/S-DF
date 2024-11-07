export const getRandomProfilePicture = () => {
	const pictures = ['assets/img/default.png', 'assets/img/default2.png', 'assets/img/default3.png'];
	return pictures[Math.floor(Math.random() * pictures.length)];
};
