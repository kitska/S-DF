const Category = require('../models/category');
const Post = require('../models/post');
const PostCategory = require('../models/post_category');

exports.getAllCategories = async (req, res) => {
	try {
		const categories = await Category.findAll();
		if (categories.length === 0) {
			return res.status(404).json({ message: 'No categories found' });
		}
		res.status(200).json({ categories });
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
					attributes: ['id', 'title', 'content', 'publish_date'],
					through: { attributes: [] },
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
		const user = req.user;

		if (user.role !== 'admin' && user.rating < 50) {
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
