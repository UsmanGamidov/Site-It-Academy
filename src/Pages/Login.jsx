
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from "../axios";

import '../styles/login.css';

export default function Login() {
    const [formData, setFormData] = useState({ // Добавлено состояние формы
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const successRegister = location.state?.successRegister;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email.includes('@')) {
            newErrors.email = 'Некорректный email';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Минимум 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {
            const { data } = await api.post('/login', {
                email: formData.email,
                password: formData.password
            });

            // Сохраняем токен (адаптируйте под вашу структуру ответа)
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data._id);
            localStorage.setItem('userAvatar', (data.avatarUrl) ? data.avatarUrl : false);
            localStorage.setItem('role', data.role);

            const redirectPath = location.state?.redirectAfterLogin || '/';
            navigate(redirectPath);
            

        } catch (err) {
            setErrors({
                server: err.response?.data?.message || 'Ошибка авторизации'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Вход в аккаунт</h2>

                {successRegister && (
                    <div className="success-message">
                        Регистрация прошла успешно! Теперь вы можете войти.
                    </div>
                )}

                {errors.server && <div className="error-message">{errors.server}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Ваш email"
                            autoComplete="username"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Ваш пароль"
                            autoComplete="current-password"
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="forgot-password">
                        {/* <Link to="/forgot-password">Забыли пароль?</Link> */}
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="register-link">
                    Нет аккаунта? <Link to="/register" state={{ redirectAfterLogin: location.state?.redirectAfterLogin }}>Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    );
}