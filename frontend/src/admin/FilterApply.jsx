/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { useAdminData } from "../context/AdminContext";

const FilterApply = ({ onSearchChange, onDepartmentChange }) => {
  const { departments } = useAdminData();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchTerm); // 🔁 send value to parent after debounce
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Department filter (immediate update)
  useEffect(() => {
    onDepartmentChange(departmentFilter);
  }, [departmentFilter]);

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <FiSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by roll no. or reg. ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments?.map((dept, index) => (
            <option key={index} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-2">
        <button className="btn btn-outline-secondary w-100">
          <FiFilter className="me-2" />
          Filters
        </button>
      </div>
    </div>
  );
};

export default FilterApply;
