import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate admin email format
    if (!email.endsWith("@virtualcareadmin.com")) {
      setError("Admin email not correct");
      return;
    }

    try {
      await axios.post("https://matibabu-backend.onrender.com/auth/admin-register", { name, email, password });
      alert("Admin registration successful! Please login.");
      navigate("/admin-login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      setError(error.response?.data?.error || "Error registering. Try again.");
    }
  };

  return (
    <div className="admin-register-container">
      <form onSubmit={handleRegister} className="formStyle">
        <h4>Admin Registration</h4>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input type="text" placeholder="Name" value={name} required onChange={(e) => setName(e.target.value)} />
        <input 
          type="email" 
          placeholder="Admin Email (@.com)" 
          value={email} 
          required 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="submit-btn">Register</button>
        <p>Already have an admin account?  
          <button type="button" className="link-button" onClick={() => navigate("/admin-login")}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}

export default AdminRegister;
