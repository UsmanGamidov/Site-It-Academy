import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from "../axios";

import '../styles/courseDetail.css';
import CourseReviews from './CourseReviews';

export default function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/courses/${id}`)
            .then(res => setCourse(res.data))
            .catch(err => console.error('Ошибка загрузки:', err));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            await api.post('/api/send-email', {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                title: course.title
            });

            setSubmitStatus('success');
            setForm({ fullName: '', email: '', phone: '' });

            // Очищаем сообщение через 4 секунды и закрываем модалку
            setTimeout(() => {
                setSubmitStatus(null);
                setShowModal(false);
            }, 2000);

        } catch (err) {
            console.error(err);
            setSubmitStatus('error');

            // Убираем сообщение через 4 секунды
            setTimeout(() => setSubmitStatus(null), 2000);
        }
    };


    const handleEnrollClick = () => {
        const token = localStorage.getItem('authToken');

        if (token) {
            setShowModal(true);
        } else {
            navigate('/login', { state: { redirectAfterLogin: `/course/${id}` } });
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    if (!course) return <div>Загрузка...</div>;

    return (
        <div className="course-landing">
            <div className="course-hero">
                <div className="course-info">
                    <div className="course-label">
                        ОНЛАЙН | {course.courseTime} МЕСЯЦЕВ | СТАРТ СКОРО
                    </div>
                    <h1 className="course-title">{course.title}</h1>
                    <p className="course-description">{course.description}</p>
                    <button className="course-btn" onClick={handleEnrollClick}>
                        записаться на курс
                    </button>
                </div>
                <div className="course-image">
                    <img src={course.imageUrl} alt={course.title} />
                </div>
            </div>

            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal animated" onClick={(e) => e.stopPropagation()}>
                        <h3>Заполните заявку</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Ваше ФИО"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Ваш email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Ваш номер телефона"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                            <button type="submit" className="send-btn">Отправить</button>
                            {submitStatus === 'success' && (
                                <div className="status-message success">Заявка успешно отправлена!</div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="status-message error">Произошла ошибка. Попробуйте позже.</div>
                            )}
                            <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Отмена</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="course-benefits">
                <div className="benefit"><div className="icon">[+]</div><p>Решите реальные задачи от компаний-партнёров</p></div>
                <div className="benefit"><div className="icon">[+]</div><p>Сертификат и диплом по окончании курса</p></div>
                <div className="benefit"><div className="icon">[+]</div><p>Подходит новичкам без опыта в IT</p></div>
                <div className="benefit"><div className="icon">[+]</div><p>5 проектов в портфолио</p></div>
            </div>
            
            <CourseReviews course={course} />
        </div>
        
    );
}
