import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Admin() {
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    
    if (!token) {
      navigate("/admin-login");
      return;
    }
    
    // Verify token and fetch reports
    const checkAuthAndFetchData = async () => {
      try {
        // Verify if the user is an admin
        if (userRole !== "admin") {
          throw new Error('Not admin');
        }
        
        await fetchReports();
      } catch (error) {
        console.error("Auth error:", error);
        setError("Authentication failed. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setTimeout(() => navigate("/admin-login"), 2000);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndFetchData();
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://matibabu-backend.onrender.com/pdf/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data && res.data.data) {
        setAllReports(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Failed to load reports. Please try again later.");
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setTimeout(() => navigate("/admin-login"), 2000);
      }
    }
  };

  // Function to convert month number to month name
  const getMonthName = (monthNumber) => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    // monthNumber is likely 1-12, so subtract 1 to get the correct index (0-11)
    return months[parseInt(monthNumber) - 1] || "Unknown Month";
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/admin-login");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h3>Admin Dashboard</h3>
        <button onClick={logout} className="btn btn-primary">Logout</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-content">
        <div className="card">
          <h4>All Uploaded Reports</h4>

          {allReports.length > 0 ? (
            allReports.map((monthData, index) => (
              <div key={index} className="month-section">
                <h5>Month: {getMonthName(monthData._id.month)}</h5>
                <div className="reports-list">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Facility</th>
                        <th>Patient</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthData.submissions.map((data, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{data.facility}</td>
                          <td>{data.patient}</td>
                          <td>{data.email}</td>
                          <td>{data.phone}</td>
                          <td>
                            {data.pdf && (
                              <a href={`https://matibabu-backend.onrender.com/files/${data.pdf}`} target="_blank" rel="noopener noreferrer">
                                View Report
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <p>No reports available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
