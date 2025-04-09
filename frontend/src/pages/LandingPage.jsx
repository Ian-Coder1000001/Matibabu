import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h2>Virtual Care Portal</h2>
      <div className="button-container">
        <div className="option-card">
          <h3>Patient Portal</h3>
          <p>Upload and manage your medical reports</p>
          <div className="button-group">
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="btn btn-outline" onClick={() => navigate("/register")}>
              Register
            </button>
          </div>
        </div>

        <div className="option-card">
          <h3>Admin Portal</h3>
          <p>View and manage all patient records</p>
          <div className="button-group">
            <button className="btn btn-secondary" onClick={() => navigate("/admin-login")}>
              Login
            </button>
            {/* <button className="btn btn-outline-secondary" onClick={() => navigate("/admin-register")}>
              Register
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

