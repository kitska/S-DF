// categoryController.js

exports.getAllCategories = (req, res) => {
    console.log('Получение всех категорий');
    res.json({ message: 'Список всех категорий' });
};

exports.getCategoryById = (req, res) => {
    console.log(`Получение категории с ID ${req.params.categoryId}`);
    res.json({ message: `Категория с ID ${req.params.categoryId}` });
};

exports.getPostsForCategory = (req, res) => {
    console.log(`Получение постов для категории с ID ${req.params.categoryId}`);
    res.json({ message: `Посты для категории с ID ${req.params.categoryId}` });
};

exports.createCategory = (req, res) => {
    console.log('Создание новой категории');
    res.json({ message: 'Категория создана' });
};

exports.updateCategory = (req, res) => {
    console.log(`Обновление категории с ID ${req.params.categoryId}`);
    res.json({ message: `Категория с ID ${req.params.categoryId} обновлена` });
};

exports.deleteCategory = (req, res) => {
    console.log(`Удаление категории с ID ${req.params.categoryId}`);
    res.json({ message: `Категория с ID ${req.params.categoryId} удалена` });
};
