import { useEffect, useState } from "react";
import api from "../axios";
import "../styles/applications.css";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin";

  const fetchApplications = async () => {
    try {
      const endpoint = isAdmin ? "/applications" : `/applications/user/${userId}`;
      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Ошибка загрузки заявок:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(
        `/applications/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications(); // Обновление списка
    } catch (err) {
      console.error("Не удалось обновить статус:", err);
    }
  };

  useEffect(() => {
    if (token && userId) fetchApplications();
  }, [token, userId]);

  if (loading) return <div className="body_home loading">Загрузка...</div>;

  return (
    <div className="body_home">
      <h1>{isAdmin ? "Все заявки" : "Мои заявки"}</h1>
      {applications.length === 0 ? (
        <p>Заявок пока нет.</p>
      ) : (
        <div className="application-grid">
          {applications.map((app) => {
            const [titleFromMsg, messageText] = app.message?.split(/\.(.+)/) || [];

            return (
              <div key={app._id} className="application-card">
                <h3>{app.courseId?.title || titleFromMsg || "Без названия курса"}</h3>

                <p><strong>ФИО:</strong> {app.fullName}</p>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Телефон:</strong> {app.phone}</p>

                {messageText && (
                  <p><strong>Комментарий:</strong> {messageText.trim()}</p>
                )}

                <p>
                  <strong>Статус:</strong>{" "}
                  <span className={`status ${app.status || "Ожидает"}`}>
                    {app.status || "Ожидает"}
                  </span>
                </p>

                {isAdmin && (
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      Изменить статус:
                      <select
                        value={app.status || "Ожидает"}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      >
                        <option value="Ожидает">Ожидает</option>
                        <option value="Одобрено">Одобрено</option>
                        <option value="Отклонено">Отклонено</option>
                      </select>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
