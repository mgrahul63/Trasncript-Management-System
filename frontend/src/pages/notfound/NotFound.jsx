import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{ height: "90vh", backgroundColor: "#f8f9fa" }}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
        alt="Not Found"
        style={{ width: "150px", marginBottom: "20px" }}
      />
      <h1 className="display-4 text-danger mb-3">404</h1>
      <h2 className="mb-2">Page Not Found</h2>
      <p className="text-muted mb-4">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to={-1} className="btn btn-outline-secondary mb-2 rounded-pill">
        🔙 Go Back
      </Link>
      <Link to="/" className="btn btn-primary px-4 rounded-pill">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
