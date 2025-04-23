import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const links = [
    { to: "/dashboard/noticeboard", label: "📢 University Notices" },
    { to: "/dashboard/applyHistory", label: "📄 Application Records" },
    { to: "/dashboard/class", label: "📚 My Classes" },
    { to: "/dashboard/profile", label: "👨‍🎓 Student Profile" },
    { to: "/dashboard/assignments", label: "📝 Assignments & Submissions" },
    { to: "/dashboard/onlineExam", label: "🧪 Online Examinations" },
  ];

  return (
    <div className="min-vh-100 p-5" style={{ backgroundColor: "#e1ecf4" }}>
      <div className="container">
        <h1 className="text-center text-primary fw-bold mb-5">
          🎓 Student Dashboard
        </h1>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {links.map(({ to, label }, index) => (
            <div className="col " key={index}>
              <NavLink to={to} className="text-decoration-none">
                <div
                  className="w-100 text-center p-4 rounded-3 fw-semibold fs-5 text-dark"
                  style={{
                    height: '140px',
                    backgroundColor: index % 2 === 0 ? "#aeb0b3" : "#cfd1d3",
                    transition: "0.3s ease-in-out",
                    cursor: "pointer",
                    overflow: "hidden", // hide overflow text
                    textOverflow: "ellipsis", // add "..." when text overflows
                    zIndex: -9,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  title={label} // optional: shows full text on hover
                >
                  {label}
                </div>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
