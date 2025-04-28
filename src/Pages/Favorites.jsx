import { useEffect, useState } from 'react';
import api from '../axios';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; // Красное сердечко

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(res.data);
    } catch (err) {
      console.error('Ошибка загрузки избранных', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFavorites();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleRemoveFavorite = async (courseId, e) => {
    e.stopPropagation(); // чтобы не переходить на курс при клике
    try {
      await api.post(`/favorites/${courseId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFavorites(); // Обновить список после удаления
    } catch (err) {
      console.error('Ошибка удаления из избранных', err);
    }
  };

  if (isLoading) return <div className="body_home loading">Загрузка...</div>;

  if (!token) return <div className="body_home">Пожалуйста, войдите в аккаунт для просмотра избранных курсов.</div>;

  return (
    <div className="body_home">
      <h1>Желаемые курсы ❤️</h1>
      <div className="profession-cards-container">
        {favorites.length > 0 ? (
          favorites.map((course, index) => (
            <div
              key={course._id}
              className={`profession-card color-${index % 6}`}
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <div
                className="favorite-icon"
                style={{ position: 'absolute', top: 10, right: 10 }}
                onClick={(e) => handleRemoveFavorite(course._id, e)}
              >
                <FaHeart color="red" size={24} />
              </div>
              <div className="card-header">
                {course.popular && <span className="popular-badge">Популярное</span>}
              </div>
              <div className="card-header">
                <h3 className="card-title">{course.title}</h3>
                <img src={course.imageUrl} width="80px" alt={course.title} />
              </div>
              <div className="card-duration">{course.courseTime} месяцев</div>
            </div>
          ))
        ) : (
          <div className="no-results">Вы ещё не добавили курсы в желаемые ❤️</div>
        )}
      </div>
    </div>
  );
}
