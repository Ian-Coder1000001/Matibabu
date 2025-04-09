import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await axios.post("https://matibabu-backend.onrender.com/auth/login", { email, password });
      
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/app"); // Redirect after successful login
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error);
      setError(error.response?.data?.error || "Invalid email or password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="formStyle">
      <h4>Login</h4>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <p>Don't have an account?
        <button type="button" className="link-button" onClick={() => navigate("/register")}>
          Register
        </button>
      </p>
    </form>
  );
}

export default Login;
