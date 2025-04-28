import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiUser, FiArrowRight } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import '../../styles/header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userAvatar, setUserAvatar] = useState('');
  const [userId, setUserId] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    const avatar = localStorage.getItem('userAvatar');
    if (token) {
      setUserId(id);
      setIsLoggedIn(true);
      if (avatar) setUserAvatar(avatar);
    } else {
      setIsLoggedIn(false);
      setUserAvatar('');
    }
  }, [location]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {

    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    localStorage.removeItem('userAvatar');
    setIsLoggedIn(false);
    setUserAvatar('');
    setTimeout(() => {
      navigate('/');
    }, 0);
  };

  const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'Курсы', path: '/courses' },
    { name: 'Преподаватели', path: '/#teachers', hash: true },
    { name: 'Контакты', path: '/#contacts', hash: true },
    { name: 'Избранные', path: '/favorites', hash: true }
  ];

  return (
    
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      
      <div className="container">
        <Link to="/" className="logoo">IT-Academy</Link>

        <nav className="nav-links">
          {navItems.map((item) =>
            item.hash ? (
              <HashLink
                key={item.path}
                smooth
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </HashLink>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        {isLoggedIn ? (
          <div className="user-avatar-container">
            {userAvatar ? (
              <img
                src={userAvatar}
                width={50}
                alt="Аватар пользователя"
                className="user-avatar"

              />
            ) : (
              <div className="avatar-placeholder">
                <FiUser className="icon" />
              </div>
            )}
            <div className="logout-dropdown">
              <button onClick={() => { navigate(`/profile/${userId}`) }} className="profile-btn">Профиль</button>
              <button onClick={() => { navigate(`/favorites`) }} className="profile-btn">Избранные</button>
              <button onClick={handleLogout} className="logout-btn">Выйти</button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="login-btn desktop-btn">
            <FiUser className="icon" />
            <span>Войти</span>
            <FiArrowRight className="icon arrow" />
          </Link>
        )}

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Меню"
        >
          {isMenuOpen ? <FiX className="icon" /> : <FiMenu className="icon" />}
        </button>

        <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) =>
            item.hash ? (
              <HashLink
                key={item.path}
                smooth
                to={item.path}
                className={`mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </HashLink>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          )}

          {isLoggedIn ? (
            <>
              <button
                className="mobile-profile-btnn"
                onClick={() => {
                  navigate(`/profile/${userId}`)
                  setIsMenuOpen(false);
                }}
              >
                Профиль
              </button>
              <button
                className="mobile-logout-btnn"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                Выйти
              </button>

            </>
          ) : (
            <Link to="/login" className="mobile-login-btn" onClick={() => setIsMenuOpen(false)}>
              <FiUser className="icon" />
              <span>Войти</span>
            </Link>
          )}
        </div>

        <div className={`overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
};

export default Header;
