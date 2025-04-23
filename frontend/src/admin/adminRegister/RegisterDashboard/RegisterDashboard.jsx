import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAdminData } from "../../../context/AdminContext";

const RegisterDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { adminData } = useAdminData();
  const [count, setCount] = useState({
    newTranscript: 0,
    newStudent: 0,
  });
  const fetchData = async () => {
    try {
      const response1 = await axios.get(
        "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
        { params: { type: "add" } }
      );
      if (response1.data.status === 1) {
        console.log(response1.data?.data);
      }

      const response = await axios.get(
        "http://localhost/versity/backend/api/admin/countRow.php",
        { params: { type: "newTranscriptcount" } }
      );
      if (response?.data?.status === 1) {
        setCount((prev) => ({
          ...prev,
          newTranscript: response.data?.count || 0, // if the backend sends a count
        }));
      }
      if (response?.data?.status === 0) {
        console.log(response.data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const sections = [
    {
      title: "Transcript",
      background: "	#F5DEB3",
      links: [
        { label: "New", to: "/admin/register/new", countKey: "newTranscript" },
        { label: "Complete", to: "/admin/register/complete" },
      ],
    },
    {
      title: "Student Account",
      background: "#e0f7fa",
      links: [
        {
          label: "New",
          to: "/admin/register/new-account",
          countKey: "newStudent",
        },
        { label: "Complete", to: "/admin/register/complete-account" },
      ],
    },
    {
      title: "Profile",
      background: "	#F5DEB3",
      links: [{ label: "Manage Profile", to: "/admin/register/profile" }],
    },
    {
      title: "Noticeboard",
      background: "#e0f7fa",
      links: [{ label: "View Notices", to: "/admin/register/noticeboard" }],
    },
  ];
  return (
    <div className="container py-5" style={{ minHeight: "90vh" }}>
      <h1 className="text-center text-primary mb-4 fw-bold">
        Welcome to Controller Dashboard
      </h1>

      <div className="row g-4">
        {sections.map((section, index) => (
          <div key={index} className="col-lg-3 col-md-4 col-sm-6">
            <div
              style={{
                background: section.background,
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                minHeight: "200px",
              }}
            >
              <h5 className="mb-3 fw-semibold text-dark">{section.title}</h5>
              {section.links.map((link, i) => (
                <div
                  key={i}
                  className="d-block mx-auto mb-2"
                  style={{ width: "80%" }}
                >
                  <NavLink
                    to={link.to}
                    className="btn btn-outline-primary btn-sm w-100 px-2 text-nowrap"
                    style={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                    title={link.label} // Tooltip on hover for longer labels
                  >
                    {link.label}
                    {link?.countKey && count[link?.countKey] > 0 && (
                      <span
                        className="badge bg-danger"
                        style={{ fontSize: "0.7rem", marginLeft: "10px" }}
                      >
                        {count[link?.countKey]}
                      </span>
                    )}
                  </NavLink>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegisterDashboard;
