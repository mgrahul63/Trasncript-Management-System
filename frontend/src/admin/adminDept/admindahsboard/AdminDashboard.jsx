import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAdminData } from "../../../context/AdminContext";

const AdminDashboard = () => {
  const { adminData } = useAdminData();
  const [result, setResult] = useState({
    newRegister: 0,
    // newAccount: 0,
    newApply: 0,
  });

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const registerRes = await axios.get(
          "http://localhost/versity/backend/api/admin/countRow.php",
          {
            params: {
              type: "newRegister",
              department_id: adminData?.department_id,
              faculty_id: adminData?.faculty_id,
            },
          }
        );

        if (registerRes?.data?.status === 1) {
          console.log(registerRes?.data?.department);
          setResult((prev) => ({
            ...prev,
            newRegister: registerRes?.data?.count,
          }));

          // const accountRes = await axios.get(
          //   "http://localhost/versity/backend/api/admin/countRow.php",
          //   {
          //     params: { type: "newAccount" },
          //   }
          // );
          // if (accountRes?.data?.status === 1) {
          //   setResult((prev) => ({
          //     ...prev,
          //     newAccount: accountRes?.data?.count,
          //   }));
          // }

          const applyRes = await axios.get(
            "http://localhost/versity/backend/api/admin/countRow.php",
            {
              params: { type: "newApply" },
            }
          );
          if (applyRes?.data?.status === 1) {
            setResult((prev) => ({ ...prev, newApply: applyRes?.data?.count }));
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    if (adminData?.department_id && adminData?.faculty_id) {
      fetchQuery();
    }
  }, [adminData?.department_id, adminData?.faculty_id]);

  const cards = [
    {
      title: "Student Register",
      link: [
        {
          label: "New",
          to: "/admin/department/new-register",
          count: result.newRegister,
        },
        {
          label: "Complete",
          to: "/admin/department/complete-register",
          count: result.oldRegister,
        },
      ],
    },
    {
      title: "Student Account",
      link: [
        {
          label: "New",
          to: "/admin/department/complete-account",
          count: result.newAccount,
        },
      ],
    },
    {
      title: "Transcript Applications Form",
      link: [
        {
          label: "New",
          to: "/admin/department/new-apply",
          count: result.newApply,
        },
        {
          label: "Complete",
          to: "/admin/department/complete-apply",
          count: result.oldApply,
        },
      ],
    },
    {
      title: "Class",
      link: [
        {
          label: "",
          to: "/admin/department/class-list",
        },
      ],
    },
    {
      title: "Profile",
      link: [
        {
          label: "",
          to: "/admin/department/profile",
        },
      ],
    },
    {
      title: "Assignments",
      link: [
        {
          label: "",
          to: "/admin/department/assignments",
        },
      ],
    },
    {
      title: "Online Exam",
      link: [
        {
          label: "",
          to: "/admin/department/onlineExam",
        },
      ],
    },
    {
      title: "Noticeboard",
      link: [
        {
          label: "",
          to: "/admin/department/noticeboard",
        },
      ],
    },
  ]; 
  return (
    <div className="container py-2" style={{ minHeight: "90vh" }}>
      <h2 className="text-center text-dark mb-1 border-bottom pb-2">
        Department Dashboard
      </h2>

      <div className="row g-4">
        {cards.map((card, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
            <div
              className="p-3 rounded h-100 d-flex flex-column justify-content-start shadow-sm"
              style={{ background: "#E6F7FF" }}
            >
              <h5 className="text-center text-dark mb-3">{card.title}</h5>
              <div className="d-flex flex-column gap-2">
                {card.link?.map((item, linkIndex) => (
                  <NavLink
                    key={linkIndex}
                    to={item.to}
                    className={`btn ${
                      linkIndex === 0
                        ? "btn-outline-primary"
                        : "btn-outline-secondary"
                    }`}
                  >
                    {item.label || "View"}
                    {item.count > 0 && (
                      <span className="ms-3 badge rounded-pill bg-danger">
                        {item?.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
