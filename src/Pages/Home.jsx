
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import Teachers from '../components/Teachers';
import Contacts from '../components/Contacts';
import Footer from '../components/layout/Footer'


export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [
        "https://cdn.skillbox.pro/wbd-front/skillbox-static/main-page/start-screen/story/sonya-xl-new@2x.webp",
        "https://cdn.skillbox.pro/wbd-front/skillbox-static/main-page/start-screen/story/alexander-xl-new@2x.webp",
        "https://cdn.skillbox.pro/wbd-front/skillbox-static/main-page/start-screen/story/darya-xl-new@2x.webp",
        "https://cdn.skillbox.pro/wbd-front/skillbox-static/main-page/start-screen/story/nikita-xl-new@2x.webp",
        "https://cdn.skillbox.pro/wbd-front/skillbox-static/main-page/start-screen/story/uliana1-xl-new@2x.webp",
        "https://cdn.skillbox.pro/wbd-front/skillbox-static/main-page/start-screen/story/kirill-xl-new@2x.webp"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);



    return (
        <>
            <section className="hero-section">
                <div className="hero-background-carousel">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Фон ${index}`}
                            className={`hero-image ${index === currentImageIndex ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <div className="hero-content">
                    <h1>
                        Найди себя и новую<br /> профессию в IT-Academy
                    </h1>
                    <p>
                        <span className="highlight">106 000+</span> выпускников уже нашли работу мечты!
                    </p>
                    <div className="tags">
                        {[
                            'Популярное', 'Программирование', 'Дизайн', 'Аналитика',
                            'Маркетинг', 'Управление', 'Финансы', 'Создание игр',
                            'Кино и Музыка', 'Психология', 'Английский язык'
                        ].map((tag, index) => (
                            <Link to="/courses" className="span_link" key={index}>
                                <span>{tag}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>



            {/* Программы */}
            <section className="programs-section">
                <h2>Более 700 программ<br />для карьеры и жизни</h2>

                <div className="programs-grid">
                    {[
                        {
                            title: 'Python-разработчик',
                            duration: '10 месяцев',
                            placement: 'с трудоустройством',
                            image: 'https://i.pinimg.com/originals/6d/80/2f/6d802ffd14b32795b4deb0b886a7815a.gif'
                        },
                        {
                            title: 'Бухгалтер',
                            duration: '6 месяцев',
                            placement: 'с трудоустройством',
                            image: 'https://i.pinimg.com/originals/36/e4/d0/36e4d0b856694fc471344b644a1dd6e4.gif'
                        },
                        {
                            title: 'Графический дизайнер',
                            duration: '12 месяцев',
                            placement: 'с трудоустройством',
                            image: 'https://i.pinimg.com/originals/c2/d6/eb/c2d6eb31dba84eaa7ae2ec231af47040.gif'
                        },
                        {
                            title: '3D-дженералист',
                            duration: '13 месяцев',
                            placement: 'с трудоустройством',
                            image: 'https://i.pinimg.com/originals/6a/e0/9d/6ae09d56f3894692b0c0c735a9882916.gif'
                        },
                        {
                            title: 'Менеджер маркетплейсов',
                            duration: '7 месяцев',
                            placement: 'с трудоустройством',
                            image: 'https://i.pinimg.com/originals/27/04/38/270438188a0443edd8aad3dd24476170.gif'
                        },
                        {
                            title: 'Нейросети: практический курс',
                            duration: '3 месяца',
                            placement: '',
                            image: 'https://i.pinimg.com/originals/76/e5/23/76e52333cbc543ac2c73e180b871849c.gif'
                        },
                        {
                            title: 'UX/UI Дизайнер',
                            duration: '8 месяца',
                            placement: '',
                            image: 'https://i.pinimg.com/originals/1e/ab/99/1eab99078b7817af05508cd0f65387c0.gif'
                        },
                        {
                            title: 'Нейросети на Python',
                            duration: '3 месяца',
                            placement: '',
                            image: 'https://i.pinimg.com/originals/6b/b6/5b/6bb65b184f4b26a7897cd989d42d3811.gif'
                        }
                    ].map((course, index) => (
                        <Link to='/courses' key={index}> {/* key для Link */}
                            <div className="program-card" style={{ backgroundImage: `url(${course.image})` }}>
                                <div className="program-card-content">
                                    <span className="label">Профессия</span>
                                    <h3>{course.title}</h3>
                                    <p>{course.duration} {course.placement && `• ${course.placement}`}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <Link to='/courses'>
                    <button className="load-more">Выбрать курс</button>
                </Link>
            </ section>

            <section className="events-section" id="events">
                <div className="events-header">
                    <h2>Ближайшие мероприятия</h2>
                    <p>Присоединяйтесь к событиям, которые прокачают ваши навыки и расширят круг общения</p>
                </div>
                <div className="events-grid">
                    <div className="event-card">
                        <h3>🔥 Хакатон по Frontend</h3>
                        <p>15 май 2025</p>
                        <p>Онлайн-соревнование среди начинающих и опытных верстальщиков.</p>
                    </div>
                    <div className="event-card">
                        <h3>🎤 Вебинар: Как войти в IT</h3>
                        <p>20 май 2025</p>
                        <p>Советы от менторов IT-Academy, реальные кейсы и путь новичков.</p>
                    </div>
                    <div className="event-card">
                        <h3>🧠 Мастер-класс по UX/UI</h3>
                        <p>28 май 2025</p>
                        <p>Погружаемся в основы дизайна интерфейсов и делаем первый проект.</p>
                    </div>
                </div>
            </section>



            {/* Секция преподавателей */}
            <Teachers />
            <Contacts />
            <Footer />

        </>
    );
}
