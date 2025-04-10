import React, { useState } from 'react';
import '../styles/userProfile.css'; // Подключим стили отдельно
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from "../axios";



const UserProfile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("authToken"))
    const { id } = useParams();

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        avatarUrl: '',
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '',
        gender: '',
        phone: '',
        country: '',
        city: '',
        email: '',
        street: '',
        house: '',
        apartment: '',
        timezone: '',
    });

    useEffect(() => {
        api.get(`/profile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(res => {
            const data = res.data;
      
            setProfile(data);
            setFormData({
              avatarUrl: data.avatarUrl || '',
              firstName: data.firstName || '',
              lastName: data.lastName || '',
              middleName: data.middleName || '',
              birthDate: formatDate(data.birthDate), // ← форматируем дату
              gender: data.gender || '',
              phone: data.phone || '',
              country: data.country || '',
              city: data.city || '',
              email: data.email || '',
              street: data.street || '',
              house: data.house || '',
              apartment: data.apartment || '',
              timezone: data.timezone || '',
            });
          })
          .catch(err => console.error('Ошибка загрузки:', err));
      }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`/profile/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert("Профиль успешно изменен");
        } catch (err) {
            console.error(err);
            alert("Ошибка при сохранении");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img
                    src={formData.avatarUrl || "https://i.imgur.com/Vz9oUoO.png"}
                    alt="avatar"
                    className="profile-avatar"
                />
                <div>
                    <h2>{formData.firstName} {formData.lastName}</h2>
                    <p>{formData.email}</p>
                </div>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
                <h3>👤 Учетные данные</h3>

                <div className="form-group">
                    <label>Имя</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Фамилия</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Отчество (если есть)</label>
                    <input name="middleName" value={formData.middleName} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Дата рождения</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Пол</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option>Мужской</option>
                        <option>Женский</option>
                        <option>Другое</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Номер телефона</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Страна</label>
                    <input name="country" value={formData.country} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Город</label>
                    <input name="city" value={formData.city} onChange={handleChange} />
                </div>

                <button type="submit" className="save-btn">Сохранить</button>
            </form>

            {/* <p className="delete-account">Удалить аккаунт</p> */}
        </div>
    );
};

export default UserProfile;
