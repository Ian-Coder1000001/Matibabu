import { useState, useEffect } from "react";
import axios from "axios";

function UploadForm() {
  const [facility, setFacility] = useState("");
  const [patient, setPatient] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState("");
  const [allReports, setAllReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("https://matibabu-backend.onrender.com/pdf/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllReports(res.data.data);
    } catch (error) {
      console.error("Failed to fetch reports", error);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("facility", facility);
    formData.append("patient", patient);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("file", file);

    const token = localStorage.getItem("token");

    try {
      await axios.post("https://matibabu-backend.onrender.com/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      alert("Uploaded Successfully!");
      setFacility("");
      setPatient("");
      setEmail("");
      setPhone("");
      setFile("");
      fetchReports();
    } catch (error) {
      alert("Upload failed. Try again.");
    }
  };

  return (
    <div className="upload-container">
      <h4>Upload Report</h4>
      <form onSubmit={submitForm} className="upload-form">
        <input type="text" placeholder="Facility Name" value={facility} onChange={(e) => setFacility(e.target.value)} required />
        <input type="text" placeholder="Patient Name" value={patient} onChange={(e) => setPatient(e.target.value)} required />
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>

      <h4>Uploaded Reports</h4>
      <div className="reports-list">
        {allReports.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Facility</th>
                <th>Patient</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Report</th>
              </tr>
            </thead>
            <tbody>
              {allReports.map((data, index) => (
                <tr key={index}>
                  <td>{data.facility}</td>
                  <td>{data.patient}</td>
                  <td>{data.email}</td>
                  <td>{data.phone}</td>
                  <td>
                    <a href={`https://matibabu-backend.onrender.com/files/${data.pdf}`} target="_blank" rel="noopener noreferrer">View Report</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reports uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default UploadForm;
