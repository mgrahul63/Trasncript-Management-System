import { NavLink } from "react-router-dom";
import { useAdminData } from "../../../context/AdminContext";
import { useEffect } from "react";

const FacultyDashboard = () => {
  const {adminData} = useAdminData()
  console.log(adminData.faculty_id);
  useEffect(()=>{
    // newRegister.php
  },[])
  return (
    <div
      className="container pb-5 "
      style={{
        minHeight: "90vh",
      }}
    >
      <h1 className="text-center text-dark mb-4 underline">Admin Dashboard</h1>

      {/* Grid layout for dashboard sections */}
      <div className="row g-4">
        {/* Student Register */}
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div
            className="p-3 border rounded text-center"
            style={{ background: "#B0E0E6" }}
          >
            <h5>Transcript</h5>
            <div className="d-flex justify-content-center gap-4 mt-2">
              <NavLink
                to="/admin/faculty/new"
                className="btn btn-outline-success position-relative"
              >
                New
                {/* {result.newRegister > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {result.newRegister}
                  </span>
                )} */}
              </NavLink>
              <NavLink
                to="/admin/faculty/complete"
                className="btn btn-outline-success"
              >
                Complete
              </NavLink>
            </div>
          </div>
        </div>

        {/* New Student Account */}
        <div className="col-lg-3 col-md-4 col-sm-12 ">
          <div
            className="p-3 border rounded text-center"
            style={{ background: "#B0E0E6" }}
          >
            <h5>Student Account</h5>
            <div className="d-flex justify-content-center gap-4 mt-2">
              <NavLink
                to="/admin/new-account"
                className="btn btn-outline-success position-relative"
              >
                New
                {/* {result.newAccount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {result.newAccount}
                  </span>
                )} */}
              </NavLink>
              <NavLink
                to="/admin/complete-account"
                className="btn btn-outline-success"
              >
                Complete
              </NavLink>
            </div>
          </div>
        </div>

        {/* Application for transcript or certificate */}
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div
            className="p-3 border rounded text-center"
            style={{ background: "#B0E0E6" }}
          >
            <h5>Applications form</h5>
            <div className="d-flex justify-content-center gap-4 mt-2">
              <NavLink
                to="/admin/new-apply"
                className="btn btn-outline-success position-relative"
              >
                New
                {/* {result.newApply > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {result.newApply}
                  </span>
                )} */}
              </NavLink>
              <NavLink
                to="/admin/complete-apply"
                className="btn btn-outline-success"
              >
                Complete
              </NavLink>
            </div>
          </div>
        </div>

        {/* Class */}
        <div className="col-lg-3 col-md-4 col-sm-12 ">
          <div
            className="p-3 border rounded text-center"
            style={{ background: "#B0E0E6" }}
          >
            <h5>Class</h5>
            <NavLink
              to="/AdminDashboard/class"
              className="btn btn-outline-success mt-2"
            >
              View Classes
            </NavLink>
          </div>
        </div>

        {/* Profile */}
        <div className="col-lg-3 col-md-4 col-sm-12 ">
          <div
            className="p-3 border rounded text-center"
            style={{ background: "#B0E0E6" }}
          >
            <h5>Profile</h5>
            <NavLink
              to="/AdminDashboard/profile"
              className="btn btn-outline-success mt-2"
            >
              Manage Profile
            </NavLink>
          </div>
        </div>

        {/* Assignments */}
        <div className="col-lg-3 col-md-4 col-sm-12 ">
          <div
            className="p-3 border rounded text-center"
            style={{ background: "#B0E0E6" }}
          >
            <h5>Assignments</h5>
            <NavLink
              to="/AdminDashboard/assignments"
              className="btn btn-outline-success mt-2"
            >
              View Assignments
            </NavLink>
          </div>
        </div>

        {/* Online Exam */}
        <div className="col-lg-3 col-md-4 col-sm-12 ">
          <div
            className="p-3 border rounded text-center"
            style={{ background: "#B0E0E6" }}
          >
            <h5>Online Exam</h5>
            <NavLink
              to="/AdminDashboard/onlineExam"
              className="btn btn-outline-success mt-2"
            >
              Take Exam
            </NavLink>
          </div>
        </div>

        {/* Noticeboard */}
        <div className="col-lg-3 col-md-4 col-sm-12  ">
          <div
            className="p-3 border rounded text-center "
            style={{ background: "#B0E0E6" }}
          >
            <h5>Noticeboard</h5>
            <NavLink
              to="/admin/noticeboard"
              className="btn btn-outline-success mt-2"
            >
              View Notices
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
