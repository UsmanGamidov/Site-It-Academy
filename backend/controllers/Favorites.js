import User from "../models/User.js";

export const create_or_delete = async (req, res) => {
    try {
        const user = await User.findById(req.userId); // правильно req.userId
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        const courseId = req.params.courseId;

        const index = user.favorites.indexOf(courseId);
        if (index > -1) {
            user.favorites.splice(index, 1); // Удалить из избранного
        } else {
            user.favorites.push(courseId); // Добавить в избранное
        }

        await user.save();
        res.json(user.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

export const getAll = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('favorites');
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

        res.json(user.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
