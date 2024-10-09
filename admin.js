const AdminJS = require('adminjs');
const AdminJSExpress = require('@adminjs/express');
const AdminJSequalize = require('@adminjs/sequelize');
const Post = require('./models/post');
const Category = require('./models/category');
const PostCategory = require('./models/post_category');
const Comment = require('./models/comment')
const User = require('./models/user');
const Like = require('./models/like');
// const Post = require('./models/Post');
// const { Comment } = require('./models/Comment');
// const { Category } = require('./models/Category');
// const { Like } = require('./models/Like');
// const { RP } = require('../models/associations');
// const { postCategory } = require('../models/associations');

const DEFAULT_ADMIN = {
    email: 'admin@example.com',
    password: 'password',
};

const authenticate = async (email, password) => {
    if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
        return Promise.resolve(DEFAULT_ADMIN);
    }
    return null;
};

AdminJS.registerAdapter({
    Resource: AdminJSequalize.Resource,
    Database: AdminJSequalize.Database,
});

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
});

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