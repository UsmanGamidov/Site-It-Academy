import '../styles/courses.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Courses() {
  const [directions, setDirections] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDirection, setActiveDirection] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'default'
  });

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get('http://localhost:3001/directions');
        
        if (!data || !Array.isArray(data)) {
          throw new Error('Некорректный формат данных');
        }

        const dataWithIds = data.map((item, index) => ({
          ...item,
          id: item.id || item._id || `gen-${Date.now()}-${index}`
        }));

        setDirections(dataWithIds);
        setActiveDirection(dataWithIds[0] || null);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setError(err.response?.data?.message || err.message || 'Ошибка сервера');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirections();
  }, []);

  const filteredDirections = directions
    .filter(direction => {
      const searchTerm = filters.search.toLowerCase();
      return searchTerm 
        ? direction.title.toLowerCase().includes(searchTerm) ||
          (direction.description && direction.description.toLowerCase().includes(searchTerm))
        : true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'name-asc': return a.title.localeCompare(b.title);
        case 'name-desc': return b.title.localeCompare(a.title);
        case 'duration-asc': return (a.duration || 0) - (b.duration || 0);
        case 'duration-desc': return (b.duration || 0) - (a.duration || 0);
        default: return 0;
      }
    });

  if (isLoading) return <div className="body_home loading">Загрузка...</div>;
  if (error) return <div className="body_home error">Ошибка: {error}</div>;
  if (!directions.length) return <div className="body_home">Нет доступных направлений</div>;

  return (
    <div className={`body_home ${isMobile ? 'mobile-view' : ''}`}>
      <div className='course_navigation'>
        <h1 className='activeItemNavigation'>{'Выберите направление'}</h1>
        <nav className='courses-container'>
          {directions.map((item) => (
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
            placeholder={isMobile ? "Поиск..." : "Поиск по названию курса..."}
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="search-input"
          />

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            className="sort-select"
          >
            <option value="default">{isMobile ? "Сортировка" : "Сортировать по"}</option>
            <option value="name-asc">{isMobile ? "А-Я" : "Названию (А-Я)"}</option>
            <option value="name-desc">{isMobile ? "Я-А" : "Названию (Я-А)"}</option>
            <option value="duration-asc">{isMobile ? "Короткие" : "Длительности (короткие)"}</option>
            <option value="duration-desc">{isMobile ? "Длинные" : "Длительности (длинные)"}</option>
          </select>
        </div>
      </div>

      <div className="courses-main-content">
        <h1 className='courses-main-title'>{activeDirection?.title || 'Все направления'}</h1>

        <div className="profession-cards-container">
          {filteredDirections.length > 0 ? (
            filteredDirections.map(direction => (
              <div 
                key={direction.id}
                className="profession-card"
              >
                <div className="card-header">
                  <h3>{direction.title}</h3>
                  {direction.isPopular && <span className="popular-badge">Популярное</span>}
                </div>
                <div className="card-duration">{direction.duration} месяцев</div>
                <div className="card-type">{direction.type}</div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Ничего не найдено</p>
              <button 
                onClick={() => setFilters({...filters, search: ''})}
                className="reset-filters"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}