const Category = require('../models/category');
const Post = require('../models/post');
const User = require('../models/user');
const { Op } = require('sequelize');

exports.getAllCategories = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const pageSize = parseInt(req.query.pageSize) || 10;

		const offset = (page - 1) * pageSize;
		const limit = pageSize;

		const { title } = req.query;
		const filter = {};

		if (title) {
			filter.title = { [Op.like]: `%${title}%` };
		}

		const sortBy = req.query.sortBy || 'title';
		const sortOrder = req.query.sortOrder === 'asc' ? 'ASC' : 'DESC';

		const { count, rows: categories } = await Category.findAndCountAll({
			where: filter,
			offset,
			limit,
			order: [[sortBy, sortOrder]],
			distinct: true,
		});

		if (categories.length === 0) {
			return res.status(404).json({ message: 'No categories found' });
		}

		const totalPages = Math.ceil(count / pageSize);

		res.status(200).json({
			message: 'List of all categories',
			currentPage: page,
			totalPages,
			totalCategories: count,
			categoriesPerPage: pageSize,
			categories,
		});
	} catch (error) {
		console.error('Error getting categories:', error);
		res.status(500).json({ message: 'Server error when retrieving categories' });
	}
};

exports.getCategoryById = async (req, res) => {
	const { category_id } = req.params;

	try {
		const category = await Category.findByPk(category_id);
		if (!category) {
			return res.status(404).json({ message: `Category with ID ${category_id} not found` });
		}
		res.status(200).json({ category });
	} catch (error) {
		console.error(`Error getting category with ID ${category_id}:`, error);
		res.status(500).json({ message: 'Server error when retrieving categories' });
	}
};

exports.getPostsForCategory = async (req, res) => {
	const { category_id } = req.params;

	try {
		const category = await Category.findByPk(category_id, {
			include: [
				{
					model: Post,
					through: { attributes: [] },
					include: [
						{
							model: User,
							attributes: ['id', 'full_name', 'login', 'profile_picture'],
						},
						{
							model: Category,
							attributes: ['id', 'title'],
							through: { attributes: [] },
						},
					],
				},
			],
		});

		if (!category || category.Posts.length === 0) {
			return res.status(404).json({ message: `There are no posts in the category with ID ${category_id}` });
		}

		res.status(200).json({
			message: `Posts for category with ID ${category_id}`,
			posts: category.Posts,
		});
	} catch (error) {
		console.error(`Error when retrieving posts for category with ID ${category_id}:`, error);
		res.status(500).json({ message: 'Server error when receiving posts for a category' });
	}
};

exports.createCategory = async (req, res) => {
	const { title } = req.body;

	try {
		const userRole = req.user.role;
		const userId = req.user.id

		const user = await User.findOne({
			where: { id: userId },
			attributes: ['rating'],
		});


		if (userRole !== 'admin' && user.rating < 50) {
			return res.status(403).json({ message: 'Not enough rating. To create a category you must have a minimum rating of 50' });
		}

		if (!title) {
			return res.status(400).json({ message: 'The "title" field is required' });
		}

		const existingCategory = await Category.findOne({ where: { title } });
		if (existingCategory) {
			return res.status(400).json({ message: 'A category with the same name already exists' });
		}

		const newCategory = await Category.create({ title });

		res.status(201).json({ message: 'Category successfully created', category: newCategory });
	} catch (error) {
		console.error('Error creating category:', error);
		res.status(500).json({ message: 'Server error when creating a category' });
	}
};

exports.updateCategory = async (req, res) => {
	const { category_id } = req.params;
	const { title } = req.body;

	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Access denied. Only administrators can update categories' });
	}

	try {
		const category = await Category.findByPk(category_id);

		if (!category) {
			return res.status(404).json({ message: `Category with ID ${category_id} not found` });
		}

		category.title = title || category.title;
		await category.save();

		res.status(200).json({ message: `Category with ID ${category_id} was successfully updated`, category });
	} catch (error) {
		console.error(`Error when updating category with ID ${category_id}:`, error);
		res.status(500).json({ message: 'Server error when updating a category' });
	}
};

exports.deleteCategory = async (req, res) => {
	const { category_id } = req.params;

	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Access denied. Only administrators can delete categories' });
	}

	try {
		const category = await Category.findByPk(category_id);

		if (!category) {
			return res.status(404).json({ message: `Category with ID ${category_id} not found` });
		}

		await category.destroy();

		res.status(200).json({ message: `Category with ID ${category_id} successfully deleted` });
	} catch (error) {
		console.error(`Error when deleting category with ID ${category_id}:`, error);
		res.status(500).json({ message: 'Server error when deleting a category' });
	}
};
