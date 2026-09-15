
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../main";
import axios from "axios";
import "./Login.css";

import { useDispatch } from "react-redux";
import { setUserData, setSelectedUser } from "../redux/userSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessages("Please enter email and password.");
      return;
    }

    setLoading(true);
    setErrorMessages("");

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(setUserData(result.data));

      // Clear previously selected chat/user
      dispatch(setSelectedUser(null));

      setEmail("");
      setPassword("");

      navigate("/");
    } catch (err) {
      console.log("Login Error:", err);

      if (err.response) {
        setErrorMessages(
          err.response.data?.message || "Login failed. Please try again."
        );
      } else if (err.request) {
        setErrorMessages(
          "Server is not responding. Please try again."
        );
      } else {
        setErrorMessages(
          err.message || "Something went wrong."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page overflow-hidden">
      {/* Background decorative blobs */}
      <div className="login-blob login-blob-one"></div>
      <div className="login-blob login-blob-two"></div>
      <div className="login-blob login-blob-three"></div>

      <div className="login-container">

        {/* LEFT BRAND SECTION */}
        <div className="login-brand">
          <div className="brand-content">

            <div className="brand-logo">
              V
            </div>

            <h1>
              Welcome to <span>Velora</span>
            </h1>

            <p className="brand-tagline">
              Connect. Communicate. Create your aura.
            </p>

            <div className="brand-values">
              <span>Velocity</span>
              <span>Aura</span>
              <span>Valor</span>
            </div>

            <div className="floating-message message-one">
              💬 Stay connected
            </div>

            <div className="floating-message message-two">
              ✨ Share your aura
            </div>

          </div>
        </div>

        {/* LOGIN SECTION */}
        <div className="login-card">

          <div className="mobile-logo">
            V
          </div>

          <div className="login-heading">
            <h2>Login</h2>
            <p>Welcome back to your Velora space</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">

            {/* EMAIL */}
            <div className="input-group">
              <label htmlFor="email">Email</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {errorMessages && (
              <div className="login-error">
                <span>⚠</span>
                {errorMessages}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span>
                {loading ? "Logging in..." : "Login"}
              </span>

              {!loading && <span className="button-arrow">→</span>}
            </button>

          </form>

          <div className="signup-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>
              Create one
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
