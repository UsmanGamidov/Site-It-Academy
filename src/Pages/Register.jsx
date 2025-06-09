import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../axios";
import "../styles/register.css";

export default function Register() {
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Полное имя обязательно";
    } else if (formData.firstName.length < 3) {
      newErrors.fullName = "Минимум 3 символа";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Некорректный email";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      await api.post("/api/send-code-register", { email: formData.email });
      setShowCodeModal(true);
    } catch (err) {
      console.error("Ошибка при отправке кода:", err);
      setErrors({ server: "Ошибка при отправке кода на почту" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setCodeError("");
    setErrors({});

    try {
      await api.post("/api/verify-code", {
        email: formData.email,
        code: verificationCode,
      });

      await api.post("/register", {
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password,
      });

      setShowCodeModal(false);
      navigate("/login", {
        state: {
          successRegister: true,
          redirectAfterLogin: location.state?.redirectAfterLogin,
        },
      });
    } catch (err) {
      if (
        err.response?.data?.message ===
        "Пользователь с таким email уже существует"
      ) {
        setErrors({ server: "Пользователь с таким email уже существует" });
        setShowCodeModal(false);
      } else if (err.response?.data?.message === "Неверный код") {
        setCodeError("Неверный код. Попробуйте ещё раз.");
      } else {
        setErrors({ server: "Ошибка при регистрации. Попробуйте позже." });
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Создать аккаунт</h2>

        {errors.server && <div className="error-message">{errors.server}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Полное имя</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.fullName ? "error" : ""}
              placeholder="Ваше полное имя"
              autoComplete="name"
            />
            {errors.fullName && (
              <span className="error-text">{errors.firstName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Ваш email"
              autoComplete="email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Не менее 6 символов"
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Подтвердите пароль</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
              placeholder="Повторите пароль"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>

        <div className="login-link">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>

      {showCodeModal && (
        <div className="modal-backdrop" onClick={() => setShowCodeModal(false)}>
          <div className="modal animated" onClick={(e) => e.stopPropagation()}>
            <h3>Введите код подтверждения</h3>
            <form onSubmit={handleVerifyCode}>
              <input
                type="text"
                placeholder="Код из email"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              {codeError && (
                <div className="status-message error">{codeError}</div>
              )}
              <button type="submit" className="send-btn">
                Подтвердить
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowCodeModal(false)}
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
