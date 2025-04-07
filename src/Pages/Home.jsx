import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

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
    );
}
