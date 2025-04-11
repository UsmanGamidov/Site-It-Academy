import '../styles/courses.css';
import { useEffect, useState } from 'react';
import api from "../axios";
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const [directions, setDirections] = useState([]);
  const [shuffledCourses, setShuffledCourses] = useState([]);
  const [activeDirection, setActiveDirection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', sortBy: 'default' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [directionsResponse, coursesResponse] = await Promise.all([
          api.get('/directions'),
          api.get('/courses')
        ]);

        const processData = (data) =>
          (data || []).map((item, index) => ({
            ...item,
            id: item.id || item._id || `gen-${Date.now()}-${index}`
          }));

        const preparedDirections = processData(directionsResponse.data);
        const preparedCourses = processData(coursesResponse.data);

        const shuffled = [...preparedCourses].sort(() => Math.random() - 0.5);

        setDirections(preparedDirections);
        setShuffledCourses(shuffled);
        setActiveDirection(preparedDirections[0] || null);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateAverageRating = (reviews = []) => {
    if (!reviews.length) return null;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviews.length;
  };

  const filterAndSort = () => {
    const base = [...shuffledCourses];

    const filtered = base.filter(item =>
      item.title.toLowerCase().includes(filters.search.toLowerCase())
    );

    if (filters.sortBy === 'name-asc') {
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (filters.sortBy === 'name-desc') {
      return filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (filters.sortBy === 'rating-asc') {
      return filtered.sort((a, b) => {
        const aRating = calculateAverageRating(a.reviews) || 0;
        const bRating = calculateAverageRating(b.reviews) || 0;
        return aRating - bRating;
      });
    }

    if (filters.sortBy === 'rating-desc') {
      return filtered.sort((a, b) => {
        const aRating = calculateAverageRating(a.reviews) || 0;
        const bRating = calculateAverageRating(b.reviews) || 0;
        return bRating - aRating;
      });
    }

    if (filters.sortBy === 'popular') {
      return filtered.sort((a, b) => (b.popular === true) - (a.popular === true));
    }

    return filtered;
  };

  const filteredCourses = filterAndSort();

  if (isLoading) return <div className="body_home loading">Загрузка...</div>;

  return (
    <div className="body_home">
      <div className='course_navigation'>
        <h1>Выберите направление</h1>
        <nav className='courses-container'>
          {directions.map(item => (
            <button
              type="button"
              className={`course-card ${activeDirection?.id === item.id ? 'active-course' : ''}`}
              key={item.id}
              onClick={() => setActiveDirection(item)}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="filters-top-panel">
        <div className="search-sort-container">
          <input
            type="search"
            placeholder="Поиск по названию курса..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="search-input"
          />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="sort-select"
          >
            <option value="default">Сортировка</option>
            <option value="rating-desc">Рейтинг (высокий → низкий)</option>
            <option value="rating-asc">Рейтинг (низкий → высокий)</option>
            <option value="popular">Популярные</option>
            <option value="name-asc">А-Я</option>
            <option value="name-desc">Я-А</option>
          </select>
        </div>
      </div>

      <div className="courses-main-content">
        <h1>{activeDirection?.title || 'Все направления'}</h1>
        <div className="profession-cards-container">
          {filteredCourses
            .filter(course =>
              Array.isArray(course.tags) &&
              Array.isArray(activeDirection?.tags) &&
              course.tags.some(tag => activeDirection.tags.includes(tag))
            )
            .map((course, index) => {
              const averageRating = calculateAverageRating(course.reviews);
              return (
                <div
                  key={course.id}
                  className={`profession-card color-${index % 6}`}
                  onClick={() => navigate(`/course/${course.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-header">
                    {course.popular && <span className="popular-badge">Популярное</span>}
                  </div>
                  <div className="card-header">
                    <h3 className="card-title">{course.title}</h3>
                    <img src={course.imageUrl} width="80px" alt={course.title} />
                  </div>
                  <div className="card-duration">{course.courseTime} месяцев</div>
                  {averageRating && (
                    <div className="card-rating">⭐ {averageRating.toFixed(1)}</div>
                  )}
                </div>
              );
            })
          }
          {filteredCourses.length === 0 && (
            <div className="no-results">Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
}
