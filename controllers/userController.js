// userController.js

exports.getAllUsers = (req, res) => {
    console.log('Получение всех пользователей');
    res.json({ message: 'Список всех пользователей' });
};

exports.getUserById = (req, res) => {
    console.log(`Получение пользователя с ID ${req.params.userId}`);
    res.json({ message: `Пользователь с ID ${req.params.userId}` });
};

exports.createUser = (req, res) => {
    console.log('Создание нового пользователя');
    res.json({ message: 'Пользователь создан' });
};

exports.uploadAvatar = (req, res) => {
    console.log('Загрузка аватара');
    res.json({ message: 'Аватар загружен' });
};

exports.updateUser = (req, res) => {
    console.log(`Обновление данных пользователя с ID ${req.params.userId}`);
    res.json({ message: `Данные пользователя с ID ${req.params.userId} обновлены` });
};

exports.deleteUser = (req, res) => {
    console.log(`Удаление пользователя с ID ${req.params.userId}`);
    res.json({ message: `Пользователь с ID ${req.params.userId} удален` });
};
