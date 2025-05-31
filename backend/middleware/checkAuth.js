/* eslint-disable no-unused-vars */
// middleware/checkAuth.js
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const checkAuth = async (req, res, next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        if (!token) {
            return res.status(403).json({ message: 'Нет доступа' });
        }

        const decoded = jwt.verify(token, 'yourSecretKey');
        req.userId = decoded._id;

        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(403).json({ message: 'Пользователь не найден' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Нет доступа' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Доступ только для администратора' });
    }
    next();
};

export default checkAuth;
