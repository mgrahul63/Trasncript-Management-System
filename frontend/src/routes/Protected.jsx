import { Outlet } from "react-router-dom";
import { useData } from "../context/Context";
import SignIn from "../pages/login/Sign";

const Protected = () => {
  const {isAuthenticated} = useData(); 
  
  // console.log(isAuthenticated);
  
  return isAuthenticated ? <Outlet /> : <SignIn />;
};

export default Protected;
