import { useState, useEffect } from "react";
import api from "../axios";
import "../styles/courseReviews.css";

export default function CourseReviews({ course }) {
  const [reviews, setReviews] = useState(course.reviews || []);
  const [newReview, setNewReview] = useState("");
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState("");

  const token = localStorage.getItem("authToken");
  const id = localStorage.getItem("userId");

  // Загружаем пользователя при монтировании
  useEffect(() => {
    if (!id || !token) return;

    api
      .get(`/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.error("Ошибка загрузки профиля:", err));
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newReview || !rating || !user?.firstName) return;

    const newItem = {
      name: user.firstName,
      avatar: user.avatarUrl || "https://i.pravatar.cc/100",
      date: new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      rating: Number(rating),
      text: newReview,
    };

    api.patch(`/courses/${course._id}`, {
      reviews: [newItem, ...reviews]
    })
      .then(() => {
        return api.get(`/courses/${course._id}`);
      })
      .then((res) => {
        setReviews(res.data.reviews);
      });
    
    setNewReview("");
    setRating("");
  };

  return (
    <section className="reviews-section">
      {user ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <h3>Оставить отзыв</h3>
          <input
            type="text"
            value={user.firstName}
            readOnly
            required
          />
          <textarea
            placeholder="Ваш отзыв..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            required
          />
          <div className="rating">
            <label>Ваша оценка:</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="">Выберите</option>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>
          </div>
          <button type="submit">Отправить</button>
        </form>
      ) : (
        <p></p>
      )}

      <h2>Отзывы о курсе</h2>

      <div className="review-list">
        {reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-header">
              <img src={review.avatar} alt="avatar" />
              <div>
                <p className="name">{review.name}</p>
                <p className="date">{review.date}</p>
                <div className="stars">{"⭐".repeat(review.rating)}</div>
              </div>
            </div>
            <p className="text">{review.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
