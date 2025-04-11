import { useState, useEffect, useMemo } from "react";
import api from "../axios";
import "../styles/courseReviews.css";

export default function CourseReviews({ course }) {
  const [reviews, setReviews] = useState(course?.reviews || []);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState("");
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [sortOption, setSortOption] = useState("date-desc");
  
  const token = localStorage.getItem("authToken");
  const id = localStorage.getItem("userId");

  useEffect(() => {
    if (!id || !token) return;

    api
      .get(`/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Ошибка загрузки профиля:", err));
  }, [id, token]);

  const userReview = reviews.find((review) => review.userId === id);

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (sortOption === "rating") {
      return copy.sort((a, b) => b.rating - a.rating);
    }
    return copy.sort((a, b) => new Date(b.date) - new Date(a.date)); // по убыванию даты
  }, [reviews, sortOption]);

  const ratingBreakdown = useMemo(() => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });
    return breakdown;
  }, [reviews]);


  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newReview || !rating || !user?.firstName) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newItem = {
      userId: id,
      name: user.firstName,
      avatar: user.avatarUrl || "https://i.pravatar.cc/100",
      date: formattedDate,
      rating: Number(rating),
      text: newReview,
      edited: editing ? true : false,
    };

    const updatedReviews = editing
      ? reviews.map((r) => (r.userId === id ? newItem : r))
      : [newItem, ...reviews];

    api
      .patch(`/courses/${course._id}`, { reviews: updatedReviews })
      .then(() => api.get(`/courses/${course._id}`))
      .then((res) => {
        setReviews(res.data.reviews);
        setEditing(false);
        setNewReview("");
        setRating("");
      });
  };

  const handleDelete = () => {
    const filtered = reviews.filter((r) => r.userId !== id);
    api
      .patch(`/courses/${course._id}`, { reviews: filtered })
      .then(() => {
        setReviews(filtered);
        setNewReview("");
        setRating("");
        setEditing(false);
      });
  };

  useEffect(() => {
    if (editing && userReview) {
      setNewReview(userReview.text);
      setRating(userReview.rating.toString());
    }
  }, [editing, userReview]);

  const reviewsToShow = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="reviews-section">
      {user && (
        <>
          {!userReview || editing ? (
            <form className="review-form" onSubmit={handleSubmit}>
              <h3>{editing ? "Редактировать отзыв" : "Оставить отзыв"}</h3>
              <input type="text" value={user.firstName} readOnly required />
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
              <button type="submit">
                {editing ? "Сохранить изменения" : "Отправить"}
              </button>
            </form>
          ) : (
            <div style={{ marginBottom: "30px" }}>
              <p>Спасибо за отзыв!</p>
              <button className="edit-review-btn" onClick={() => setEditing(true)}>
                ✏️ Редактировать
              </button>
              <button className="delete-review-btn" onClick={handleDelete}>
                🗑️ Удалить
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="sort-bar">
        <h2>Отзывы о курсе</h2>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date">По дате</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>


      {reviews.length > 0 && (
        <div style={{ marginBottom: "20px", fontSize: "18px", fontWeight: 600, color: "#4f46e5" }}>
          Средняя оценка: {averageRating}{" "}
          <span style={{ fontSize: "18px", color: "#f5b301" }}>
            {"⭐".repeat(Math.round(averageRating))}
          </span>
        </div>
      )}

      <div style={{ margin: "20px 0" }}>
        {Object.entries(ratingBreakdown)
          .sort((a, b) => b[0] - a[0]) // от 5 к 1
          .map(([stars, count]) => (
            <div key={stars} style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ width: "50px", fontSize: "14px" }}>{stars} ⭐</span>
              <div style={{
                height: "10px",
                background: "#e5e7eb",
                borderRadius: "5px",
                flex: 1,
                marginRight: "10px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${(count / reviews.length) * 100}%`,
                  height: "100%",
                  background: "#fbbf24"
                }} />
              </div>
              <span style={{ fontSize: "14px", width: "30px" }}>{count}</span>
            </div>
          ))}
      </div>


      <div className="review-list">
        {(showAll ? sortedReviews : sortedReviews.slice(0, 3)).length > 0 ? (
          (showAll ? sortedReviews : sortedReviews.slice(0, 3)).map((review, index) => (
            <div className="review-card" key={index}>
              <div className="review-header">
                <img src={review.avatar} alt="avatar" />
                <div>
                  <p className="name">{review.name}</p>
                  <p className="date">
                    {review.date} {review.edited && <em>(изменено)</em>}
                  </p>
                  <div className="stars">{"⭐".repeat(review.rating)}</div>
                </div>
              </div>
              <p className="text">{review.text}</p>
            </div>
          ))
        ) : (
          <p>Отзывов пока нету</p>
        )}
      </div>

      {reviews.length > 3 && (
        <button
          className="toggle-reviews-btn"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Скрыть" : "Показать ещё"}
        </button>
      )}
    </section>
  );
}
