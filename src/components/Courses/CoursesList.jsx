export default function CoursesList({ directions, filters }) {
    const filteredDirections = directions.filter(direction => {
      if (filters.programType !== 'Любой' && direction.type !== filters.programType) return false;
      if (filters.employment && !direction.hasEmployment) return false;
      if (filters.difficulty !== 'Любой' && direction.difficulty !== filters.difficulty) return false;
      if (direction.duration < filters.duration[0] || direction.duration > filters.duration[1]) return false;
      if (filters.topics.length > 0 && !filters.topics.some(topic => direction.topics?.includes(topic))) return false;
      return true;
    });
  
    return (
      <div className="courses-panel">
        <h2>Профессии ({filteredDirections.length})</h2>
        <div className="profession-cards">
          {filteredDirections.map(direction => (
            <div 
              key={direction.id || direction._id} // Уникальный ключ из данных
              className="profession-card"
            >
              <div className="card-header">
                <h3>{direction.title}</h3>
                {direction.isPopular && <span className="popular-badge">Популярное</span>}
              </div>
              <div className="card-duration">{direction.duration} месяцев</div>
              <div className="card-type">{direction.type}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }