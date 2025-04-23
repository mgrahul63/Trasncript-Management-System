import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const AccountantDashboard = () => {
  const [newPaymentCount, setNewPaymentCount] = useState(0);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const registerRes = await axios.get(
          "http://localhost/versity/backend/api/admin/countRow.php",
          {
            params: { type: "newpaymentData" },
          }
        );

        if (registerRes?.data?.status === 1) {
          setNewPaymentCount(registerRes.data.count);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchQuery();
  }, []);

  // 💡 Dashboard links stored in an array
  const dashboardSections = [
    {
      title: "Transcript Payment Management",
      links: [
        {
          label: (
            <>
              ➕ New Payment{" "}
              {newPaymentCount > 0 && (
                <span className="badge bg-danger ms-2">{newPaymentCount}</span>
              )}
            </>
          ),
          to: "/admin/accountant/new-payment",
          btnClass: "btn-outline-primary",
        },
        {
          label: "✅ Completed Payments",
          to: "/admin/accountant/complete-payment",
          btnClass: "btn-outline-success",
        },
        {
          label: "📊 View Reports",
          to: "/admin/accountant/payment-reports",
          btnClass: "btn-outline-secondary",
        },
      ],
    },

    {
      title: "My Profile",
      links: [
        {
          label: "👤 Manage Profile",
          to: "/admin/accountant/profile",
          btnClass: "btn-outline-dark",
        },
      ],
    },
    {
      title: "Noticeboard",
      links: [
        {
          label: "📢 View Notices",
          to: "/admin/noticeboard",
          btnClass: "btn-outline-warning",
        },
      ],
    },
  ];

  return (
    <div className="container pb-5" style={{ minHeight: "90vh" }}>
      <h1 className="text-center text-dark mb-4 underline">
        Accountant Dashboard
      </h1>

      <div className="row g-4 justify-content-center">
        {dashboardSections.map((section, index) => (
          <div key={index} className="col-lg-4 col-md-6 col-sm-12">
            <div
              className="p-4 border rounded text-center"
              style={{ background: "#E6F7FF" }}
            >
              <h5>{section.title}</h5>
              <div className="d-flex flex-column gap-2 mt-3">
                {section.links.map((link, i) => (
                  <NavLink
                    key={i}
                    to={link.to}
                    className={`btn ${link.btnClass}`}
                  >
                    {link.label}
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

export default AccountantDashboard;
