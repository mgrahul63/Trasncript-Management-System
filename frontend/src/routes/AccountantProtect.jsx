import { Navigate, Outlet } from "react-router-dom";
import { useAdminData } from "../context/AdminContext";

const AccountantProtect = () => {
  const { adminData } = useAdminData();

  // Still loading: show nothing or a loading spinner
  if (!adminData || !adminData.role_type) {
    return null; // or <Loading />
  }

  // Allow access for accountant admin
  if (adminData.role_type === "accountant") {
    return <Outlet />;
  }

  // Not allowed
  return <Navigate to="/" />;
};

export default AccountantProtect;
