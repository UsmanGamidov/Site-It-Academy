import React from 'react';
import '../../styles/footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section links">
                    <h4>Навигация</h4>
                    <ul>
                        <li><a href="/">Главная</a></li>
                        <li><a href="/courses">Курсы</a></li>
                        <li><a href="/about">О нас</a></li>
                        <li><a href="/contact">Контакты</a></li>
                    </ul>
                </div>

                <div className="footer-section contact-form">
                    <h4>Обратная связь</h4>
                    <form>
                        <input type="text" placeholder="Ваше имя" required />
                        <input type="email" placeholder="Email" required />
                        <textarea placeholder="Сообщение..." rows="3" required></textarea>
                        <button type="submit">Отправить</button>
                    </form>
                </div>

                <div className="footer-section social">
                    <h4>Мы в соцсетях</h4>
                    <ul>
                        <li><a href="#" >Instagram</a></li>

                        <li><a href="#" >Telegram</a></li>

                        <li><a href="#" >Vk</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} IT-Academy. Все права защищены.</p>
            </div>
        </footer>
    );
}
