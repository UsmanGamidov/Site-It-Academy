/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../axios";

import "../styles/login.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const successRegister = location.state?.successRegister;

  // Reset password states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [step, setStep] = useState(1);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Некорректный email";
    if (formData.password.length < 6) newErrors.password = "Минимум 6 символов";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const { data } = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data._id);
      localStorage.setItem("userAvatar", data.avatarUrl || false);
      localStorage.setItem("role", data.role);

      const redirectPath = location.state?.redirectAfterLogin || "/";
      navigate(redirectPath);
    } catch (err) {
      setErrors({
        server: err.response?.data?.message || "Ошибка авторизации",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Вход в аккаунт</h2>

        {successRegister && (
          <div className="success-message">
            Регистрация прошла успешно! Теперь вы можете войти.
          </div>
        )}

        {errors.server && <div className="error-message">{errors.server}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Ваш email"
              autoComplete="username"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group password-group">
            <label>Пароль</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                placeholder="Ваш пароль"
                autoComplete="current-password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-visibility"
              >
                <img
                  width="20px"
                  src={showPassword ? "/hide.png" : "/eye.png"}
                  alt="toggle visibility"
                />
              </span>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="forgot-password">
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setShowResetModal(true);
                setStep(1);
                setResetError("");
              }}
            >
              Забыли пароль?
            </button>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className="register-link">
          Нет аккаунта?{" "}
          <Link
            to="/register"
            state={{ redirectAfterLogin: location.state?.redirectAfterLogin }}
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>

      {showResetModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowResetModal(false)}
        >
          <div className="modal animated" onClick={(e) => e.stopPropagation()}>
            <form>
              {step === 1 ? (
                <>
                  <h3>Сброс пароля</h3>
                  <input
                    type="email"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      setResetError("");
                      try {
                        await api.post("/api/check-email", {
                          email: resetEmail,
                        });
                        await api.post("/api/send-code", {
                          email: resetEmail,
                        });
                        setStep(2);
                      } catch (err) {
                        if (err.response?.status === 404) {
                          setResetError("Пользователь с таким email не найден");
                        } else {
                          setResetError("Ошибка при проверке email");
                        }
                      }
                    }}
                    className="send-btn"
                  >
                    Отправить код
                  </button>
                </>
              ) : (
                <>
                  <h3>Введите код из письма</h3>
                  <input
                    type="text"
                    placeholder="Код из email"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                  />
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        await api.post("/api/verify-code", {
                          email: resetEmail,
                          code: resetCode,
                        });
                        await api.post("/api/reset-password", {
                          email: resetEmail,
                          password: newPassword,
                        });
                        setResetSuccess("Пароль успешно сброшен");
                        setTimeout(() => setShowResetModal(false), 2000);
                      } catch (err) {
                        setResetError("Неверный код или ошибка при сбросе");
                      }
                    }}
                    className="send-btn"
                  >
                    Сбросить пароль
                  </button>
                </>
              )}

              {resetError && (
                <div className="status-message error">{resetError}</div>
              )}
              {resetSuccess && (
                <div className="status-message success">{resetSuccess}</div>
              )}

              <button
                className="cancel-btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowResetModal(false);
                }}
              >
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
