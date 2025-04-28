import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from "../axios";

import '../styles/courseDetail.css';
import CourseReviews from './CourseReviews';

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        async function fetchCourse() {
            try {
                const courseRes = await api.get(`/courses/${id}`);
                setCourse(courseRes.data);
            } catch (err) {
                console.error('Ошибка загрузки курса:', err);
            }
        }
        fetchCourse();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('authToken');

            if (userId && token) {
                const profileRes = await api.get(`/profile/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { firstName, middleName, lastName, email, phone } = profileRes.data;
                let fullNameUser = lastName + " " + firstName + " " + middleName;
                setForm({
                    fullName: fullNameUser || '',
                    email: email || '',
                    phone: phone || ''
                });
            }
        } catch (err) {
            console.error('Ошибка загрузки профиля:', err);
        }
    };

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
            setTimeout(() => {
                setSubmitStatus(null);
                setShowModal(false);
            }, 2000);

        } catch (err) {
            console.error('Ошибка отправки заявки:', err);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 2000);
        }
    };

    const handleEnrollClick = async () => {
        const token = localStorage.getItem('authToken');

        if (token) {
            await fetchProfile(); // ПОДГРУЖАЕМ ДАННЫЕ ПРОФИЛЯ перед открытием модалки
            setShowModal(true);
        } else {
            navigate('/login', { state: { redirectAfterLogin: `/course/${id}` } });
        }
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
                        Записаться на курс
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
                                value={form.fullName}
                                placeholder="Ваше ФИО"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                placeholder="Ваш Email"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                placeholder="Ваш номер телефона"
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
