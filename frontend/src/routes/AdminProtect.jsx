import { Navigate, Outlet } from "react-router-dom";
import { useData } from "../context/Context";

const AdminProtect = () => {
  const { role } = useData();

  // Check if the role is admin
  if (role === "admin") {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminProtect;
