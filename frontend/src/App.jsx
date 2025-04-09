import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Admin from "./pages/Admin";
import UploadForm from "./components/UploadForm";
import "./styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* <Route path="/admin-register" element={<AdminRegister />} /> */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/app" element={<UploadForm />} />
      </Routes>
    </Router>
  );
}

export default App;