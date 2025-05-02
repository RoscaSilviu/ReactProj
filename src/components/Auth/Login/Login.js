import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsAuthenticated } = useAuth();
  const [rememberMe, setRememberMe] = useState(false); // Starea pentru "Remember Me"
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedToken = localStorage.getItem("authToken");

    if (location.pathname === "/login" && savedEmail && savedToken) {
      navigate("/home");
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    sessionStorage.removeItem("authToken");

    if (!email.includes("@") || password.length < 3) {
      alert("Email invalid sau parolă prea scurtă!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);

        // Storage handling
        if (rememberMe) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.setItem("authToken", data.token);
          localStorage.removeItem("rememberedEmail");
        }

        localStorage.setItem("userId", data.user.id);
        navigate(location.state?.from || "/home");
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };
  const handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      localStorage.setItem("googleAuthToken", credentialResponse.credential);
      localStorage.setItem("rememberedEmail", decoded.email);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error("JWT decode error:", error);
      alert("Google authentication failed");
    }
  };

  const handleGoogleLoginFailure = () => {
    alert("Eroare la autentificarea cu Google. Încearcă din nou!");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Login</h2>
          <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="flex justify-center">
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-check-input"
                />
                <label htmlFor="rememberMe" className="form-check-label">
                  Remember Me
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="text-center mt-3">
            Nu ai un cont?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="btn btn-link text-decoration-none"
            >
              Înregistrează-te aici
            </button>
          </p>
          <p className="text-center mt-3">
            Esti Administrator?{" "}
            <button
              onClick={() => navigate("/CatLogin")}
              className="btn btn-link text-decoration-none"
            >
              Intra in contul tau!
            </button>
          </p>
          <div className="text-center">
            <div className="mt-3">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
