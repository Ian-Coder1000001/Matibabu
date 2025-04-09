import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Prevent login with empty email/password
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post("https://matibabu-backend.onrender.com/auth/admin-login", { email, password });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userRole", "admin");
        navigate("/admin"); // Redirect admin to dashboard
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Admin login failed:", error.response?.data || error);

      if (error.response?.status === 403) {
        setError("Access denied. You are not an admin.");
      } else if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleAdminLogin} className="formStyle">
        <h4>Admin Login</h4>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Enter Admin Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="submit-btn">Login</button>
        {/* <p>Don't have an admin account?
          <button type="button" className="link-button" onClick={() => navigate("/admin-register")}>
            Register
          </button>
        </p> */}
      </form>
    </div>
  );
}

export default AdminLogin;
