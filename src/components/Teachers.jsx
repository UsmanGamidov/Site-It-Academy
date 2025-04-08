import React from 'react';
import '../styles/teachers.css';

const teachersData = [
    {
        name: 'Иван Иванов',
        role: 'Профессор по Python',
        image: 'https://i.pinimg.com/736x/97/bb/06/97bb067e30ff6b89f4fbb7b9141025ca.jpg',
        description: 'Иван имеет 10 лет опыта в разработке на Python и преподавании.'
    },
    {
        name: 'Мария Петрова',
        role: 'Старший преподаватель по UX/UI дизайну',
        image: 'https://i.pinimg.com/736x/64/18/a8/6418a8d86eb4e6178fcd485178135e36.jpg',
        description: 'Мария занимается UX/UI дизайном более 5 лет и обучает студентов с 2018 года.'
    },
    {
        name: 'Алексей Сидоров',
        role: 'Преподаватель по аналитике данных',
        image: 'https://i.pinimg.com/736x/33/c6/0d/33c60da2e2d75f5fc31a2b25d268d452.jpg',
        description: 'Алексей работает с данными более 7 лет и специализируется на Data Science.'
    }
    // Добавьте других преподавателей, если нужно
];

export default function Teachers() {
    return (
        <section className="teachers-section" id="teachers">
            <h2>Наши преподаватели</h2>
            <div className="teachers-grid">
                {teachersData.map((teacher, index) => (
                    <div className="teacher-card" key={index}>
                        <img src={teacher.image} alt={teacher.name} className="teacher-image" />
                        <div className="teacher-info">
                            <h3>{teacher.name}</h3>
                            <p className="teacher-role">{teacher.role}</p>
                            <p className="teacher-description">{teacher.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

    );
}
