import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./admin";
import AccountantDashboard from "./admin/AccountantAdmin/accountantDashboard/AccountantDashboard";
import AccountantCompletePayment from "./admin/AccountantAdmin/Student-Payment/AccountantCompletePayment";
import AccountantNewPayment from "./admin/AccountantAdmin/Student-Payment/AccountantNewPayment";
import AdminDashboard from "./admin/adminDept/admindahsboard/AdminDashboard";
import ClassesList from "./admin/adminDept/classes/ClassesList";
import CourseSchedule from "./admin/adminDept/classes/CourseSchedule";
import AdminProfile from "./admin/adminDept/profile/AdminProfile";
import CompleteRegisters from "./admin/adminDept/Registers/CompleteRegisters";
import NewRegisters from "./admin/adminDept/Registers/NewRegisters";
import CompleteAccount from "./admin/adminDept/Student-Account/CompleteAccount";
import NewAccount from "./admin/adminDept/Student-Account/NewAccount";
import CompleteApply from "./admin/adminDept/Student-Apply/CompleteApply";
import NewApply from "./admin/adminDept/Student-Apply/NewApply";
import FacultyDashboard from "./admin/adminFaculty/facultyDashboard/FacultyDashboard";
import Complete from "./admin/adminFaculty/transcript/Complete";
import New from "./admin/adminFaculty/transcript/New";
import RegisterDashboard from "./admin/adminRegister/RegisterDashboard/RegisterDashboard";
import CompleteTranscript from "./admin/adminRegister/transcript/CompleteTranscript";
import NewTranscriptApply from "./admin/adminRegister/transcript/NewTranscriptApply";
import Provider from "./context/Context";
import MainLayout from "./layouts/MainLayout";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Home from "./pages/home/Home";
import Forget from "./pages/login/Forget";
import Registration from "./pages/login/Registration";
import Sign from "./pages/login/Sign";
import SignUp from "./pages/login/SignUp";
import NotFound from "./pages/notfound/NotFound";
import AccountantProtect from "./routes/AccountantProtect";
import AdminDeptProtect from "./routes/AdminDeptProtect";
import AdminFacultyProtect from "./routes/AdminFacultyProtect";
import AdminProtect from "./routes/AdminProtect";
import AdminRegisterProtect from "./routes/AdminRegisterProtect";
import UserProtect from "./routes/UserProtect";
import UserLayout from "./users";
import Apply from "./users/apply";
import ApplyHistory from "./users/dashboard/ApplyHistory";
import Dashboard from "./users/dashboard/Dashboard";
import Profile from "./users/profile/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "home", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "registration", element: <Registration /> },
      { path: "sign", element: <Sign /> },
      { path: "forgot-password", element: <Forget /> },
      { path: "signup", element: <SignUp /> },
      // Authentication-related routes
      // {
      //   element: <Protected />,
      //   children: [
      //     { path: "sign", element: <Sign /> },
      //     { path: "forgot-password", element: <Forget /> },
      //     { path: "signup", element: <SignUp /> },
      //   ],
      // },

      // User-protected routes
      {
        element: <UserProtect />,
        children: [
          {
            path: "/",
            element: <UserLayout />,
            children: [
              { path: "profile", element: <Profile /> },
              {
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "/dashboard/applyHistory",
                element: <ApplyHistory />,
              },
              {
                path: "/dashboard/onlineExam",
                element: <ApplyHistory />,
              },
              { path: "apply", element: <Apply /> },
              { path: "/*", element: <NotFound /> },
            ],
          },
        ],
      },

      // Admin-protected routes
      {
        element: <AdminProtect />,
        children: [
          {
            path: "/",
            element: <Admin />,
            children: [
              {
                element: <AdminDeptProtect />, // Wrap the nested admin routes
                children: [
                  {
                    path: "admin/department/profile",
                    element: <AdminProfile />,
                  },
                  {
                    path: "admin/department/dashboard",
                    element: <AdminDashboard />,
                  },
                  {
                    path: "admin/department/new-register",
                    element: <NewRegisters />,
                  },
                  {
                    path: "admin/department/complete-register",
                    element: <CompleteRegisters />,
                  },
                  {
                    path: "admin/department/new-account",
                    element: <NewAccount />,
                  },
                  {
                    path: "admin/department/complete-account",
                    element: <CompleteAccount />,
                  },
                  {
                    path: "admin/department/new-apply",
                    element: <NewApply />,
                  },
                  {
                    path: "admin/department/complete-apply",
                    element: <CompleteApply />,
                  },
                  {
                    path: "admin/department/class-list",
                    element: <ClassesList />,
                  },
                  {
                    path: "admin/department/course-schedule",
                    element: <CourseSchedule />,
                  },
                  { path: "admin/department/*", element: <NotFound /> },
                ],
              },
              {
                element: <AdminFacultyProtect />,
                children: [
                  { path: "admin/faculty/profile", element: <AdminProfile /> },
                  {
                    path: "admin/faculty/dashboard",
                    element: <FacultyDashboard />,
                  },
                  {
                    path: "admin/faculty/new",
                    element: <New />,
                  },
                  {
                    path: "admin/faculty/complete",
                    element: <Complete />,
                  },
                  { path: "admin/faculty/*", element: <NotFound /> },
                ],
              },
              {
                element: <AdminRegisterProtect />,
                children: [
                  { path: "admin/register/profile", element: <AdminProfile /> },
                  {
                    path: "admin/register/dashboard",
                    element: <RegisterDashboard />,
                  },
                  {
                    path: "admin/register/new",
                    element: <NewTranscriptApply />,
                  },
                  {
                    path: "admin/register/complete",
                    element: <CompleteTranscript />,
                  },
                  { path: "admin/register/*", element: <NotFound /> },
                ],
              },
              {
                element: <AccountantProtect />,
                children: [
                  {
                    path: "admin/accountant/profile",
                    element: <AdminProfile />,
                  },
                  {
                    path: "admin/accountant/dashboard",
                    element: <AccountantDashboard />,
                  },
                  {
                    path: "admin/accountant/new-payment",
                    element: <AccountantNewPayment />,
                  },
                  {
                    path: "admin/accountant/complete-payment",
                    element: <AccountantCompletePayment />,
                  },
                  { path: "admin/accountant/*", element: <NotFound /> },
                ],
              },
            ],
          },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => {
  return (
    <>
      <ToastContainer />
      <Provider>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
};

export default App;
