require('dotenv').config();
const express = require('express');
const path = require('path');
const createDatabase = require('./db/initDataBase');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const commentRouter = require('./routes/comments');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./services/documentation/swagger-output.json');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: `http://localhost:3000`,
	})
);

const assetsPath = path.join(__dirname, 'assets', 'img');
const uploadsPath = path.join(__dirname, 'uploads');

app.get('/api/assets/img/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(assetsPath, imageName);

    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Ошибка при отправке файла:', err);
            res.status(err.status).end();
        }
    });
});

app.get('/api/uploads/:fileName', (req, res) => {
	const fileName = req.params.fileName;
	const filePath = path.join(uploadsPath, fileName);

	res.sendFile(filePath, err => {
		if (err) {
			console.error('Ошибка при отправке файла:', err);
			res.status(err.status).end();
		}
	});
});

const adminRouter = require('./services/admin');

app.get('/', (req, res) => {
	res.send(`
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              body {
                  background-color: #333;
                  color: #fff;
                  font-family: Arial, sans-serif;
              }
              a {
                  color: #FFA500;
                  text-decoration: none;
                  font-weight: bold;
              }
              a:hover {
                  color: #FFD700;
                  text-decoration: underline;
              }
              .links {
                  display: flex;
                  flex-direction: column;
                  margin: 10px;
                  gap: 20px;
              }
          </style>
      </head>
      <body>
          <div class="links">
              <a href="https://documenter.getpostman.com/view/38849662/2sAXxWbA7H"> Documentation 1 </a>
              <a href="http://localhost:${PORT}/api-docs"> Documentation 2 </a>
              <a href="http://localhost:${PORT}/admin"> Admin </a>
          </div>
      </body>
      </html>
    `);
});
app.use('/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/comments', commentRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const startServer = async () => {
	try {
		await createDatabase();
		app.listen(PORT, () => {
			console.log(`Server running on: http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Error when starting the server or synchronizing the database:', error);
	}
};

startServer();

app.use((req, res, next) => {
	res.status(404).json({ message: 'Resource not found' });
});
