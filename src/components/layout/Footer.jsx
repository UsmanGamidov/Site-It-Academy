import React from 'react';
import '../../styles/footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-section">
                    <h4>IT-ACADEMY</h4>
                    <p>Образовательная платформа для всех, кто хочет учиться и развиваться.</p>
                    <div className="social-icons">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
                        <a href="https://t.me" target="_blank" rel="noopener noreferrer">✈️</a>
                        <a href="https://vk.com" target="_blank" rel="noopener noreferrer">🆎</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>О нас</h4>
                    <ul>
                        <li><a href="/#">О школе</a></li>
                        <li><a href="/#">Отзывы</a></li>
                        <li><a href="/#">Оферта</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Полезное</h4>
                    <ul>
                        <li><a href="/#">FAQ</a></li>
                        <li><a href="/#">Оплата</a></li>
                        <li><a href="/#">Требования</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Контакты</h4>
                    <ul>
                        <li><a href="mailto:osmangamidov026@gmail.com">it_top_acamdemy@it_top.com</a></li>
                        <li><a href="tel:+79882277166">+7 988 22 77 166</a></li>
                        <li><a href="https://t.me/At_taqwa_tw">Telegram</a></li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} It-Academy. Все права защищены.
            </div>
        </footer>
    );
}
