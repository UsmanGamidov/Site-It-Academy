import React from 'react';
import '../styles/teachers.css';

const teachersData = [
    {
        name: 'Иван Иванов',
        role: 'Профессор по Python',
        image: 'https://i.pinimg.com/736x/6a/f7/ec/6af7ec8724b42cdc74c36564470a89cc.jpg',
        description: 'Иван имеет 10 лет опыта в разработке на Python и преподавании.'
    },
    {
        name: 'Мария Петрова',
        role: 'Старший преподаватель по UX/UI дизайну',
        image: 'https://i.pinimg.com/736x/20/ac/5f/20ac5fa7d4837201981f7bc7808214bd.jpg',
        description: 'Мария занимается UX/UI дизайном более 5 лет и обучает студентов с 2018 года.'
    },
    {
        name: 'Алексей Сидоров',
        role: 'Преподаватель по аналитике данных',
        image: 'https://i.pinimg.com/736x/c2/fc/01/c2fc01d69456bd5097c6ec39307f69be.jpg',
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
