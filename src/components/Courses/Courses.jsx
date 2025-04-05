import { useState } from 'react';
import FiltersPanel from './FiltersPanel';
import CoursesList from './CoursesList';
import '../../styles/courses.css';

export default function Courses({ directions }) {
  const [filters, setFilters] = useState({
    programType: 'Любой',
    employment: false,
    difficulty: 'Любой',
    duration: [1, 24],
    topics: []
  });

  return (
    <div className="content-container">
      <FiltersPanel filters={filters} setFilters={setFilters} />
      <CoursesList directions={directions} filters={filters} />
    </div>
  );
}