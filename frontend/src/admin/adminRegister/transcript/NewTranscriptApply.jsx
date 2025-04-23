import axios from "axios";
import { useEffect, useState } from "react";
import FilterApply from "../../FilterApply";
import NewApplyTranscriptLIst from "./NewApplyTranscriptLIst";
import ShowDetails from "./ShowDetails";

const NewTranscriptApply = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");

  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    data: {},
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
        { params: { type: "pending", searchQuery, department } }
      );

      if (response?.data?.status === 0) {
        setError(response.data.message);
      } else {
        setData(response.data?.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to retrieve transcript applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, department]);

  return (
    <div
      className="container mb-5"
      style={{
        minHeight: Array.isArray(data) && data.length === 0 ? "400px" : "80vh",
      }}
    >
      {/* Beautiful Heading Section */}
      <div
        className="  text-white p-3 mb-4 rounded-3"
        style={{
          backgroundImage: "linear-gradient(to right, #007bff, #00c6ff)", // Gradient background
          // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h4 className="mb-3 text-center text-uppercase fw-bold">
          New Transcript Applications
        </h4>
        <p style={{ fontSize: "17px" }}>
          As an admin, you are viewing the latest transcript requests submitted
          by students. Please review the details carefully and proceed with the
          appropriate action for each application.
        </p>
      </div>

      {/* Filters Section */}
      <FilterApply
        onSearchChange={(value) => setSearchQuery(value)}
        onDepartmentChange={(value) => setDepartment(value)}
      />

      {/* Table Section List*/}
      <NewApplyTranscriptLIst
        loading={loading}
        error={error}
        data={data}
        setIsModalOpen={setIsModalOpen}
      />

      {/* Modal Open  */}
      {isModalOpen.status && (
        <ShowDetails
          data={isModalOpen.data}
          setIsModalOpen={setIsModalOpen}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default NewTranscriptApply;

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { DateFormate } from "../../../utils/DateFormate";
// import ShowDetails from "./ShowDetails";
// import { FiSearch, FiFilter, FiRefreshCw, FiDownload } from "react-icons/fi";
// import { BsThreeDotsVertical, BsClockHistory } from "react-icons/bs";

// const NewTranscriptApply = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("all");

//   const [isModalOpen, setIsModalOpen] = useState({
//     status: false,
//     data: {},
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await axios.get(
//         "http://localhost/versity/backend/api/admin/registerAdmin/newApplyTranscript.php",
//         { params: { type: "pending" } }
//       );

//       if (response?.data?.status === 0) {
//         setError(response.data.message);
//       } else {
//         setData(response.data?.data || []);
//       }
//     } catch (err) {
//       console.error("Fetch error:", err);
//       setError("Failed to retrieve transcript applications.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const filteredData = data.filter(item => {
//     const matchesSearch =
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.studentId.includes(searchTerm) ||
//       item.registerId.includes(searchTerm);
//     const matchesDepartment =
//       departmentFilter === "all" ||
//       item.departmentName === departmentFilter;

//     return matchesSearch && matchesDepartment;
//   });

//   const uniqueDepartments = [...new Set(data.map(item => item.departmentName))];

//   return (
//     <div className="container-fluid py-4">
//       {/* Header Section */}
//       <div className="card border-0 shadow-sm mb-4">
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <div>
//               <h4 className="mb-1 fw-bold text-primary">New Transcript Applications</h4>
//               <p className="text-muted mb-0">
//                 Review and manage pending transcript requests
//               </p>
//             </div>
//             <button
//               className="btn btn-primary"
//               onClick={fetchData}
//             >
//               <FiRefreshCw className="me-2" />
//               Refresh
//             </button>
//           </div>

//           {/* Filters Section */}
//           <div className="row g-3">
//             <div className="col-md-6">
//               <div className="input-group">
//                 <span className="input-group-text bg-white">
//                   <FiSearch />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search by name, roll no. or reg. ID"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="col-md-4">
//               <select
//                 className="form-select"
//                 value={departmentFilter}
//                 onChange={(e) => setDepartmentFilter(e.target.value)}
//               >
//                 <option value="all">All Departments</option>
//                 {uniqueDepartments.map((dept, index) => (
//                   <option key={index} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-2">
//               <button className="btn btn-outline-secondary w-100">
//                 <FiFilter className="me-2" />
//                 Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Applications Table */}
//       <div className="card border-0 shadow-sm">
//         <div className="card-body p-0">
//           <div className="table-responsive">
//             <table className="table table-hover align-middle mb-0">
//               <thead className="bg-light">
//                 <tr>
//                   <th width="60" className="ps-4">SN</th>
//                   <th>Student</th>
//                   <th>Roll No.</th>
//                   <th>Reg. ID</th>
//                   <th>Department</th>
//                   <th>Semester</th>
//                   <th>Session</th>
//                   <th>Applied On</th>
//                   <th>Status</th>
//                   <th width="150" className="text-end pe-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="10" className="text-center py-5">
//                       <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan="10" className="text-center text-danger py-4">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : filteredData.length === 0 ? (
//                   <tr>
//                     <td colSpan="10" className="text-center text-muted py-4">
//                       {searchTerm || departmentFilter !== "all"
//                         ? "No matching applications found"
//                         : "No new transcript applications available"}
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredData.map((register, index) => (
//                     <tr key={index}>
//                       <td className="ps-4 text-muted">{index + 1}</td>
//                       <td>
//                         <div className="d-flex align-items-center">
//                           <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
//                             {register?.name?.charAt(0) || "S"}
//                           </div>
//                           <div className="ms-3">
//                             <p className="mb-0 fw-medium">{register.name}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td>{register.studentId}</td>
//                       <td>{register.registerId}</td>
//                       <td>{register.departmentName}</td>
//                       <td>{register.semester_id}</td>
//                       <td>{register.session_id}</td>
//                       <td>{DateFormate(register.application_date)}</td>
//                       <td>
//                         <span className="badge bg-warning bg-opacity-10 text-warning">
//                           <BsClockHistory className="me-1" />
//                           Pending
//                         </span>
//                       </td>
//                       <td className="pe-4">
//                         <div className="d-flex justify-content-end">
//                           <button
//                             onClick={() =>
//                               setIsModalOpen({
//                                 status: true,
//                                 data: register,
//                               })
//                             }
//                             className="btn btn-sm btn-outline-primary me-2"
//                           >
//                             Details
//                           </button>
//                           <div className="dropdown">
//                             <button
//                               className="btn btn-sm btn-outline-secondary dropdown-toggle"
//                               type="button"
//                               data-bs-toggle="dropdown"
//                             >
//                               <BsThreeDotsVertical />
//                             </button>
//                             <ul className="dropdown-menu dropdown-menu-end">
//                               <li><button className="dropdown-item">Approve</button></li>
//                               <li><button className="dropdown-item">Reject</button></li>
//                               <li><button className="dropdown-item">Download</button></li>
//                             </ul>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Status Summary and Pagination */}
//       <div className="d-flex justify-content-between align-items-center mt-3">
//         <div className="text-muted">
//           Showing <strong>{filteredData.length}</strong> of <strong>{data.length}</strong> applications
//         </div>
//         <nav>
//           <ul className="pagination pagination-sm mb-0">
//             <li className="page-item disabled">
//               <a className="page-link" href="#">Previous</a>
//             </li>
//             <li className="page-item active"><a className="page-link" href="#">1</a></li>
//             <li className="page-item"><a className="page-link" href="#">2</a></li>
//             <li className="page-item"><a className="page-link" href="#">3</a></li>
//             <li className="page-item">
//               <a className="page-link" href="#">Next</a>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {isModalOpen.status && (
//         <ShowDetails
//           data={isModalOpen.data}
//           setIsModalOpen={setIsModalOpen}
//           fetchData={fetchData}
//         />
//       )}
//     </div>
//   );
// };

// export default NewTranscriptApply;
