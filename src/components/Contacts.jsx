import React from 'react';
import '../styles/contacts.css';

const Contacts = () => {
    return (
        <section className="contacts-section" id="contacts">
            <div className="container">
                <div className="contacts-wrapper">
                    {/* Карта */}
                    <div className="map-container">
                        <iframe src="https://yandex.ru/map-widget/v1/?um=constructor%3A5ea7be5a20790247ed577dc64e2981b6e8014fae0384b1133d9b5f11c9301e1c&amp;source=constructor" width="500" height="400" frameBorder="0"></iframe>
                    </div>

                    {/* Контактная информация */}
                    <div className="contact-info">
                        <h2>Наши Контакты</h2>
                        <p><b>Адрес:</b> ул. Батманова, 2, Каспийск, Россия</p>
                        <p><b>Телефон: </b><a href="tel:+79882277166">+7 988 22 77 166</a></p>
                        <p><b>Emaiil: </b><a href="mailto:osmangamidov026@gmail.com">it_top_acamdemy@it_top.com</a></p>
                        <p><b>Часы работы:</b> Без выходных: 9:00 - 18:00</p>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contacts;
