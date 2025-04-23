const RecentNews = () => {
  // Sample data (replace with API/fetch later)
  const adminMembers = [
    {
      id: 1,
      name: "John Doe",
      role: "Vice Chancellor",
      imageSrc: "/images/hall1.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Registrar",
      imageSrc: "/images/hall2.jpg",
    },
    {
      id: 3,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 4,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 5,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 6,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 7,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 8,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 9,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 10,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
    {
      id: 11,
      name: "Alan Walker",
      role: "Treasurer",
      imageSrc: "/images/hall3.jpg",
    },
  ];

  return (
    <div className="container pb-4" style={{ marginTop: "100px" }}>
      <h2
        className="text-3xl font-bold mb-4 "
        style={{ color: "#025c53", textTransform: "uppercase" }}
      >
        Recent
        <span style={{ color: "#ff3c00" }}>News</span>
      </h2>
      <div className="row g-4">
        {adminMembers.map((member) => (
          <div className="col-md-3" key={member.id}>
            <a
              href={`/administratorprofile.php?id=${member.id}`}
              style={{
                textDecoration: "none",
                transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for scaling and shadow
                display: "block", // Ensures the link takes up the full card
                borderRadius: "5px", // Rounded corners for the card
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Subtle shadow
                color: "#ff3c00",
              }}
              onMouseOver={(e) => {
                (e.currentTarget.style.color = "#ff9c00"),
                  (e.currentTarget.style.boxShadow =
                    "0px 6px 30px rgba(0, 0, 0, 0.15)"); // Enhance shadow on hover
              }}
              onMouseOut={(e) => {
                (e.currentTarget.style.color = "#ff3c00"),
                  (e.currentTarget.style.boxShadow =
                    "0px 4px 20px rgba(0, 0, 0, 0.1)"); // Reset shadow
              }}
            >
              <div className="driver-card">
                <img
                  src={member.imageSrc}
                  alt="Profile Picture"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderTopLeftRadius: "5px", // Rounded top corners for the image
                    borderTopRightRadius: "5px", // Rounded top corners for the image
                  }}
                />
                <div className="card-body p-3">
                  <h4
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {member.name}
                  </h4>
                  <p style={{ fontSize: "0.95rem" }}>{member.role}</p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentNews;
