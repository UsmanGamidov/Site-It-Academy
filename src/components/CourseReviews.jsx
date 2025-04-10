import { useState } from "react";
import '../styles/courseReviews.css';


const initialReviews = [
  {
    name: "Алексей Иванов",
    avatar: "https://i.pravatar.cc/100?img=1",
    date: "15 марта 2025",
    rating: 5,
    text: "Курс превзошёл ожидания! Очень понятная подача материала и отличные проекты.",
  },
];

export default function CourseReviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview || !rating || !name) return;

    const newItem = {
      name,
      avatar: `https://i.pravatar.cc/100?u=${name}`, // динамический аватар
      date: new Date().toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      rating: Number(rating),
      text: newReview,
    };

    setReviews([newItem, ...reviews]);
    setNewReview("");
    setRating("");
    setName("");
  };

  return (
    <section className="reviews-section">
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

      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Оставить отзыв</h3>
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
    </section>
  );
}
