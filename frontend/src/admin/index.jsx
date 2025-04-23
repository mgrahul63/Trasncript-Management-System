import Provider from "../context/AdminContext";
import AdminPage from "./AdminPage";

const Admin = () => {
  
  return (
    <>
      <Provider>
        <AdminPage />
      </Provider>
    </>
  );
};

export default Admin;
