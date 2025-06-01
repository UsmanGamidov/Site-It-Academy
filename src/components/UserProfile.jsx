import React, { useState, useEffect } from 'react';
import '../styles/userProfile.css';
import { useNavigate } from 'react-router-dom';
import api from "../axios";

const UserProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const [submitStatus, setSubmitStatus] = useState(null);

  const [formData, setFormData] = useState({
    avatarUrl: '',
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    gender: '',
    phone: '',
    email: '',
  });

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }

    api.get(`/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(res => {
        const data = res.data;
        setFormData({
          avatarUrl: data.avatarUrl || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          middleName: data.middleName || '',
          birthDate: formatDate(data.birthDate),
          gender: data.gender || '',
          phone: data.phone || '',
          email: data.email || '',
        });
      })
      .catch(err => {
        console.error('Ошибка загрузки профиля:', err);
      });
  }, [navigate, token, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/profile/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      setSubmitStatus('error');
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
          <h2>{formData.lastName} {formData.firstName}</h2>
          <p>{formData.email}</p>
        </div>
      </div>

      <form className="profile-form" onSubmit={handleSubmit}>
        <h3>👤 Учетные данные</h3>

        {[ 
          { label: "Фамилия", name: "lastName" },
          { label: "Имя", name: "firstName" },
          { label: "Отчество", name: "middleName" },
          { label: "Номер телефона", name: "phone" },
          { label: "Email", name: "email" },
        ].map(({ label, name }) => (
          <div className="form-group" key={name}>
            <label>{label}</label>
            <input
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Дата рождения</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate || ''}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Пол</label>
          <select
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
          >
            <option value="">Выберите</option>
            <option value="Мужской">Мужской</option>
            <option value="Женский">Женский</option>
            <option value="Другое">Другое</option>
          </select>
        </div>

        {submitStatus === 'success' && (
          <div className="status-message success">Профиль успешно изменен!</div>
        )}
        {submitStatus === 'error' && (
          <div className="status-message error">Произошла ошибка. Попробуйте позже.</div>
        )}

        <button type="submit" className="save-btn">Сохранить</button>
      </form>
    </div>
  );
};

export default UserProfile;
