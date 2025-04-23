import { Navigate, Outlet } from "react-router-dom";
import { useAdminData } from "../context/AdminContext";

const AdminRegisterProtect = () => {
  const { adminData } = useAdminData();

  // Still loading: show nothing or a loading spinner
  if (!adminData || !adminData.role_type) {
    return null; // or <Loading />
  }

  // Allow access for faculty or department admin
  if (adminData.role_type === "registerAdmin") {
    return <Outlet />;
  }

  // Not allowed
  return <Navigate to="/" />;
};

export default AdminRegisterProtect;
