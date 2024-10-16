require('dotenv').config();
const express = require('express');
const createDatabase = require('./db/initDataBase')
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const categoryRouter = require('./routes/categories');
const commentRouter = require('./routes/comments');

const app = express();
app.use(express.json());

const adminRouter = require('./services/admin');
app.use('/admin', adminRouter)
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/comments', commentRouter);

const startServer = async () => {
    try {
        await createDatabase();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Сервер запущен на: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Ошибка при запуске сервера или синхронизации базы данных:', error);
    }
};

startServer();

app.use((req, res, next) => {
    res.status(404).json({ message: 'Ресурс не найден' });
});
