import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiArrowRight } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Проверка авторизации при загрузке и при изменении location
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const avatar = localStorage.getItem('userAvatar');

    if (token) {
      setIsLoggedIn(true);
      if (avatar) {
        setUserAvatar(avatar);
      }
    } else {
      setIsLoggedIn(false);
      setUserAvatar('');
    }
  }, [location]);

  // Закрытие меню при смене страницы
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Эффект скролла для хедера
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Выход из системы
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userAvatar');
    setIsLoggedIn(false);
    setUserAvatar('');
    navigate('/');
  };

  // Ссылки меню
  const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'Курсы', path: '/courses' },
    { name: 'Преподаватели', path: '/#teachers' },
    { name: 'Контакты', path: '/#contacts' }
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        {/* Логотип */}
        <Link to="/" className="logoo">
          IT-Academy
        </Link>

        {/* Десктопное меню */}
        <nav className="nav-links">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Кнопка входа или аватар */}
        {isLoggedIn ? (
          <div className="user-avatar-container">
            {userAvatar ? (
              <img
                src={userAvatar}
                width={50}
                alt="Аватар пользователя"
                className="user-avatar"
                onClick={() => navigate('/profile')}
              />
            ) : (
              <div
                className="avatar-placeholder"
                onClick={() => navigate('/profile')}
              >
                <FiUser className="icon" />
              </div>
            )}
            <div className="logout-dropdown">
              <button onClick={handleLogout} className="logout-btn">
                Выйти
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-btn desktop-btn">
            <FiUser className="icon" />
            <span>Войти</span>
            <FiArrowRight className="icon arrow" />
          </Link>
        )}

        {/* Кнопка мобильного меню */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Меню"
        >
          {isMenuOpen ? <FiX className="icon" /> : <FiMenu className="icon" />}
        </button>

        {/* Мобильное меню */}
        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Профиль
              </Link>
              <button
                className="mobile-logout-btn"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mobile-login-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              <FiUser className="icon" />
              <span>Войти</span>
            </Link>
          )}
        </div>

        {/* Оверлей */}
        <div
          className={`overlay ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        />
      </div>
    </header>
  );
};

export default Header;