export default function FiltersPanel({ filters, setFilters }) {
    const topics = ['1C', 'Backend-разработка', 'C#', 'C++', 'Data analytics'];
    const tip = ['Любой', 'Пррофесия', 'Курс'];
  
    return (
      <div className="filters-panel">

        <h3>Тип обучения на платформе</h3>
        <div className="topics-container">
          {tip.map(topic => (
            <div key={topic} className="topic-item">
              <input
                type="checkbox"
                id={`topic-${topic}`}
                checked={filters.topics.includes(topic)}
                onChange={() => {
                  const newTopics = filters.topics.includes(topic)
                    ? filters.topics.filter(t => t !== topic)
                    : [...filters.topics, topic];
                  setFilters({...filters, topics: newTopics});
                }}
              />
              <label htmlFor={`topic-${topic}`}>{topic}</label>
            </div>
          ))}
        </div>

        <div className="filter-group">
          <input 
            type="checkbox" 
            id="employment" 
            checked={filters.employment}
            onChange={(e) => setFilters({...filters, employment: e.target.checked})}
          />
          <label htmlFor="employment">С трудоустройством</label>
        </div>
  
        <h3>Уровень сложности</h3>
        <select 
          value={filters.difficulty}
          onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
        >
          <option value="Любой">Любой</option>
          <option value="Для новичков">Для новичков</option>
          <option value="Для специалистов">Для специалистов</option>
        </select>
  
        <h3>Длительность</h3>
        <div className="duration-range">
          <span>От {filters.duration[0]} до {filters.duration[1]} месяцев</span>
          <input 
            type="range" 
            min="1" 
            max="24" 
            value={filters.duration[1]}
            onChange={(e) => setFilters({...filters, duration: [filters.duration[0], parseInt(e.target.value)]})}
          />
        </div>
  
        <h3>Тематика</h3>
        <div className="topics-container">
          {topics.map(topic => (
            <div key={topic} className="topic-item">
              <input
                type="checkbox"
                id={`topic-${topic}`}
                checked={filters.topics.includes(topic)}
                onChange={() => {
                  const newTopics = filters.topics.includes(topic)
                    ? filters.topics.filter(t => t !== topic)
                    : [...filters.topics, topic];
                  setFilters({...filters, topics: newTopics});
                }}
              />
              <label htmlFor={`topic-${topic}`}>{topic}</label>
            </div>
          ))}
        </div>
      </div>
    );
  }