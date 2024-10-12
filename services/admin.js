const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSequalize = require('@adminjs/sequelize');
const Post = require('../models/post');
const Category = require('../models/category');
const PostCategory = require('../models/post_category');
const Comment = require('../models/comment')
const User = require('../models/user');
const Like = require('../models/like');
const bcrypt = require('bcrypt');


const authenticate = async (email, password) => {
    // Находим пользователя с ролью 'admin' по email
    const user = await User.findOne({
        where: { email, role: 'admin' },
    });

    // Если пользователь не найден, возвращаем null
    if (!user) {
        return null;
    }

    // Проверяем, соответствует ли введённый пароль хэшированному паролю в базе
    const validPassword = await bcrypt.compare(password, user.password);
    
    // Если пароль не совпадает, возвращаем null
    if (!validPassword) {
        return null;
    }

    // Если всё успешно, возвращаем пользователя
    return Promise.resolve({ email, password });
};

AdminJS.registerAdapter({
    Resource: AdminJSequalize.Resource,
    Database: AdminJSequalize.Database,
});

// Установка отношений постов и категорий
const makeRelationships = async (req) => {
    if (req.record.params) {
        const { id } = req.record.params;
        let uniqueCategories = new Set();

        // Собираем все категории, которые переданы в запросе
        for (const key in req.record.params) {
            if (key.startsWith('categories.')) {
                const CategoryId = req.record.params[key];
                uniqueCategories.add(CategoryId);
            }
        }

        try {
            // Получаем категории, которые соответствуют переданным CategoryId
            const categories = await Category.findAll({
                where: { id: Array.from(uniqueCategories) },
            });

            // Получаем пост по его ID и устанавливаем категории
            const post = await Post.findByPk(id);
            if (post) {
                await post.setCategories(categories); // Устанавливаем категории для поста
            }
        } catch (err) {
            console.error('Ошибка при установке категорий:', err);
        }
    }

    return req;
};

// Локализация
const locale = {
    translations: {
        labels: {},
        messages: {
            loginWelcome: 'Добро пожаловать на страницу администрирования. Введите данные для входа администратора.',
        },
    },
};

// Конфигурация AdminJS
const admin = new AdminJS({
    resources: [
        {
            resource: User,
            options: {
                listProperties: [
                    'id', 'login', 'password', 'full_name', 'email',
                    'profile_picture', 'rating', 'role', 'email_confirmed',
                ],
                filterProperties: [
                    'id', 'login', 'password', 'full_name', 'email',
                    'profile_picture', 'rating', 'role', 'email_confirmed',
                ],
                editProperties: [
                    'id', 'login', 'password', 'full_name', 'email',
                    'profile_picture', 'rating', 'role', 'email_confirmed',
                ],
                showProperties: [
                    'id', 'login', 'password', 'full_name', 'email',
                    'profile_picture', 'rating', 'role', 'email_confirmed',
                ],
            },
        },
        {
            resource: Post,
            options: {
                listProperties: ['id', 'title', 'author_id', 'status', 'publish_date'],
                filterProperties: ['id', 'title', 'author_id', 'status'],
                editProperties: ['title', 'author_id', 'status', 'content'],
                showProperties: ['id', 'title', 'author_id', 'status', 'content', 'publish_date'],
                after: {
                    edit: makeRelationships,
                    new: makeRelationships,
                },
            },
        },
        {
            resource: Category,
            options: {
                listProperties: ['id', 'title', 'description'],
                filterProperties: ['id', 'title'],
                editProperties: ['title', 'description'],
                showProperties: ['id', 'title', 'description'],
            },
        },
        {
            resource: Comment,
            options: {
                listProperties: ['id', 'post_id', 'author_id', 'content', 'publish_date'],
                filterProperties: ['id', 'post_id', 'author_id'],
                editProperties: ['post_id', 'author_id', 'content'],
                showProperties: ['id', 'post_id', 'author_id', 'content', 'publish_date'],
            },
        },
        {
            resource: Like,
            options: {
                listProperties: ['id', 'post_id', 'comment_id', 'author_id', 'type', 'publish_date'],
                filterProperties: ['id', 'post_id', 'comment_id', 'author_id', 'type'],
                editProperties: ['post_id', 'comment_id', 'author_id', 'type'],
                showProperties: ['id', 'post_id', 'comment_id', 'author_id', 'type', 'publish_date'],
            },
        },
        {
            resource: PostCategory,
            options: {
                listProperties: ['post_id', 'category_id'],
                filterProperties: ['post_id', 'category_id'],
                editProperties: ['post_id', 'category_id'],
                showProperties: ['post_id', 'category_id'],
            },
        },
    ],
    locale,
    branding: {
        companyName: 'Mythical Production',
    },
});

// Конфигурация маршрутов для AdminJS с аутентификацией
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: 'sessionsecret',
    },
    null, {
    resave: true, saveUninitialized: true
}
);

module.exports = adminRouter;