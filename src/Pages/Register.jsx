import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/register.css';

export default function Register() {
  const location = useLocation();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const newErrors = {};

    // Изменяем username на fullName
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Полное имя обязательно';
    } else if (formData.firstName.length < 3) {
      newErrors.fullName = 'Минимум 3 символа';
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Некорректный email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      await axios.post('https://site-it-academy-backend.onrender.com/register', {
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password
      });

      navigate('/login', { state: { successRegister: true, redirectAfterLogin: location.state?.redirectAfterLogin } });
    } catch (err) {
      // Добавим более подробное логирование ошибки
      console.error('Registration error:', err);
      setErrors({
        server: err.response?.data?.message ||
          err.message ||
          'Ошибка регистрации. Пожалуйста, попробуйте позже.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Создать аккаунт</h2>

        {errors.server && <div className="error-message">{errors.server}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Полное имя</label>  {/* Изменяем label */}
            <input
              type="text"
              name="firstName"  // Изменяем name на fullName
              value={formData.firstName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Ваше полное имя"
              autoComplete="name"
            />
            {errors.fullName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Ваш email"
              autoComplete="email"
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
              placeholder="Не менее 6 символов"
              autoComplete="new-password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Повторите пароль"
              autoComplete="new-password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="login-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
}