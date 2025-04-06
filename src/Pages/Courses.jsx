import '../styles/courses.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Courses() {
  const [directions, setDirections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeDirection, setActiveDirection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', sortBy: 'default' });

  useEffect(() => {
    const fetchDirections = async () => {
      setIsLoading(true);
      try {
        const directionsResponse = await axios.get('http://localhost:3001/directions');
        const coursesResponse = await axios.get('http://localhost:3001/courses');

        const dataDirections = directionsResponse.data || [];
        const dataCourses = coursesResponse.data || [];

        const dataDirectionsWithIds = dataDirections.map((item, index) => ({
          ...item,
          id: item.id || item._id || `gen-${Date.now()}-${index}`
        }));

        const dataCoursesWithIds = dataCourses.map((item, index) => ({
          ...item,
          id: item.id || item._id || `gen-${Date.now()}-${index}`
        }));

        setDirections(dataDirectionsWithIds);
        setCourses(dataCoursesWithIds);
        setActiveDirection(dataDirectionsWithIds[0] || null);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirections();
  }, []);

  const filteredDirections = directions
    .filter(direction => direction.title.toLowerCase().includes(filters.search.toLowerCase()))
    .sort((a, b) => {
      if (filters.sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (filters.sortBy === 'name-desc') return b.title.localeCompare(a.title);
      return 0;
    });

  const filteredCourses = courses
    .filter(course => course.title.toLowerCase().includes(filters.search.toLowerCase()))
    .sort((a, b) => {
      if (filters.sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (filters.sortBy === 'name-desc') return b.title.localeCompare(a.title);
      return 0;
    });

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
              <div key={course.id} className="profession-card">
                <h3>{course.title}</h3>
                <div>{course.courseTime} месяцев</div>
              </div>
            ))
          ) : (
            <div className="no-results">Ничего не найдено</div>
          )}
        </div>
      </div>
    </div>
  );
}