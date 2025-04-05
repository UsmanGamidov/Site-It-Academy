import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

export default function Home() {
  const [directions, setDirections] = useState([]);
  const [navigationItem, setNavigationItem] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDirections = async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/directions');
        setDirections(data);
        if (data.length > 0) {
          setNavigationItem(data[0].title);
        }
      } catch (err) {
        console.error('Ошибка при получении направлений:', err);
        setError(err.message);
      }
    }; 
    fetchDirections();
  }, []);

  if (error) return <div className="body_home">Ошибка: {error}</div>;
  if (directions.length === 0) return <div className="body_home">Нет доступных направлений</div>;

  return (
    <div className='body_home'>
      <div className='course_navigation'>
        <h1 className='activeItemNavigation'>{navigationItem}</h1>
        <nav className='courses-container'>
          {directions.map((item) => {
            // Проверяем наличие id, если нет - создаем уникальный ключ
            const uniqueKey = item.id || `${item.title}_${Math.random().toString(36).substr(2, 9)}`;
            
            return (
              <a
                className={`course-card ${navigationItem === item.title ? 'active-course' : ''}`}
                key={uniqueKey} // Уникальный ключ
                onClick={() => setNavigationItem(item.title)}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
      <div>
        {/* Здесь можно отображать контент выбранного направления */}
      </div>
    </div>
  );
}