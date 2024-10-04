// authController.js

exports.register = (req, res) => {
    res.status(200).json({ message: 'Регистрация успешна' });
};

exports.login = (req, res) => {
    console.log('Вход пользователя');
    res.json({ message: 'Вход успешен' });
};

exports.logout = (req, res) => {
    console.log('Выход пользователя');
    res.json({ message: 'Выход успешен' });
};

exports.sendResetLink = (req, res) => {
    console.log('Отправка ссылки для сброса пароля');
    res.json({ message: 'Ссылка для сброса пароля отправлена' });
};

exports.confirmNewPassword = (req, res) => {
    console.log('Подтверждение нового пароля');
    res.json({ message: 'Пароль успешно изменен' });
};
