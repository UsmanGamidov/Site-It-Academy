import '../styles/courses.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Courses() {
  const [directions, setDirections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeDirection, setActiveDirection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', sortBy: 'default' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [directionsResponse, coursesResponse] = await Promise.all([
          axios.get('https://site-it-academy-backend.onrender.com/directions'),
          axios.get('https://site-it-academy-backend.onrender.com/courses')
        ]);

        const processData = (data) =>
          (data || []).map((item, index) => ({
            ...item,
            id: item.id || item._id || `gen-${Date.now()}-${index}`
          }));

        setDirections(processData(directionsResponse.data));
        setCourses(processData(coursesResponse.data));
        setActiveDirection(processData(directionsResponse.data)[0] || null);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterAndSort = (data) => {
    return data
      .filter(item => item.title.toLowerCase().includes(filters.search.toLowerCase()))
      .sort((a, b) => {
        if (filters.sortBy === 'name-asc') return a.title.localeCompare(b.title);
        if (filters.sortBy === 'name-desc') return b.title.localeCompare(a.title);
        return 0;
      });
  };

  const filteredCourses = filterAndSort(courses);

  if (isLoading) return <div className="body_home loading">Загрузка...</div>;

  return (
    <div className="body_home">
      <div className='course_navigation'>
        <h1 >Выберите направление</h1>
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
            <option value="name-asc">А-Я</option>
            <option value="name-desc">Я-А</option>
          </select>
        </div>
      </div>

      <div className="courses-main-content">
        <h1>{activeDirection?.title || 'Все направления'}</h1>
        <div className="profession-cards-container">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              course.tags.map(tags => (
                tags == activeDirection.tags && ( // Ваше условие для отображения карточек
                  <div key={course.id} className="profession-card" onClick={() => navigate(`/course/${course.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="card-header">
                      <span className="card-badge">{ Math.floor(Math.random() * 2)  == 1 ? "Профессия": "Курс"}</span>
                      {course.popular && <span className="popular-badge">Популярное</span>}
                    </div>
                    <div className="card-header">
                      <h3 className="card-title">{course.title}</h3>
                      <img src={course.imageUrl} width="80px" />
                    </div>
                    <div className="card-duration">{course.courseTime} месяцев</div>
                  </div>
                )
              ))
            ))
          ) : (
            <div className="no-results">Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
}