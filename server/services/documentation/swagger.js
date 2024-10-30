const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		title: 'S?DF API',
		description: 'API for forum',
	},
	host: 'localhost:3000',
	schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['../../app.js'];

swaggerAutogen(outputFile, routes, doc).then(async () => {
	await require('../../app.js');
});
