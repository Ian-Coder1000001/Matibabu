
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:4000/auth/register", { name, email, password });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      setError(error.response?.data?.error || "Error registering. Try again.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="formStyle">
      <h4>Register</h4>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input type="text" placeholder="Name" required onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>

      {/* ✅ New Button to Navigate to Login Page */}
      <p>Already have an account?  
        <button type="button" className="link-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </p>
    </form>
  );
}

export default Register;

