import { Navigate, Outlet } from "react-router-dom";
import { useData } from "../context/Context";

const UserProtect = () => {
  const { isAuthenticated } = useData();

  // Still loading: show nothing or a loading spinner
  if (!isAuthenticated) {
    return null;
  }

  // Allow access for faculty or department admin
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Not allowed
  return <Navigate to="/" />;
};

export default UserProtect;
