import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CourseList from "./CourseList";

const CourseSchedule = () => {
  const location = useLocation();
  const { sessionId, semesterId, departmentId, deptName } =
    location.state || {};

  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      department_id: departmentId,
      session_id: sessionId,
      semester: semesterId,
      deptName: deptName,
      courses: courses,
      action: "INSERT",
    };

    try {
      const res = await axios.post(
        "http://localhost/versity/backend/api/admin/departmentAdmin/course.php",
        payload
      );
      if (res.data.status === 1) {
        setCourseList((prev) => [...prev, ...courses]);
        setCourses([]);
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCourseUpdate = async (index, updatedCourse) => {
    const updatedCourses = [...courseList];
    updatedCourses[index] = updatedCourse;
    setCourseList(updatedCourses);
    try {
      const res = await axios.post(
        "http://localhost/versity/backend/api/admin/departmentAdmin/course.php",
        {
          action: "UPDATE",
          department_id: departmentId,
          session_id: sessionId,
          semester: semesterId,
          updatedCourse,
        }
      );

      if (res.data.status === 1) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  const handleCourseDelete = async (id, course_code) => {
    const updatedCourses = courseList.filter((course) => course.id !== id);
    setCourseList(updatedCourses);

    try {
      const res = await axios.post(
        "http://localhost/versity/backend/api/admin/departmentAdmin/course.php",
        {
          action: "DELETE",
          department_id: departmentId,
          session_id: sessionId,
          semester: semesterId,
          course_code,
          id,
        }
      );

      if (res.data.status === 1) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Error deleting course:", err);
      toast.error("Something went wrong.");
    }
  };

  const handleChange = (index, e) => {
    const updatedCourses = [...courses];
    updatedCourses[index][e.target.name] = e.target.value;
    setCourses(updatedCourses);
  };

  const addCourseField = () => {
    setCourses([...courses, { course_code: "", course_title: "", credit: "" }]);
    setError(null);
  };

  const handleCancle = () => {
    setCourses([]);
    if (courseList.length === 0) setError("No Course Added!");
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost/versity/backend/api/admin/departmentAdmin/course.php",
          {
            params: {
              semesterId,
              sessionId,
              departmentId,
            },
          }
        );
        if (res.data.status === 1) {
          setCourseList(res.data.data);
          setError(null);
        } else {
          setCourseList([]);
          setError(res.data.message);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching courses.");
        setCourseList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [semesterId, sessionId, departmentId]);

  return (
    <div className="container">
      <h3 className="fw-bold text-primary mb-4">
        {sessionId} Session - {deptName} | Semester: {semesterId}
      </h3>

      <div className="row">
        <div className="col-6">
        <h5>Course List</h5>
          <table className="table table-sm table-hover align-middle table-bordered rounded">
            <thead className="table-light">
              <tr className="text-center">
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "20%" }}>Course Code</th>
                <th>Course Title</th>
                <th style={{ width: "10%" }}>Credit</th>
                <th style={{ width: "15%" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    />
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-danger text-center fw-semibold"
                  >
                    {error}
                  </td>
                </tr>
              ) : (
                courseList.map((course, index) => (
                  <CourseList
                    key={course.id || index}
                    index={index}
                    course={course}
                    handleCourseUpdate={handleCourseUpdate}
                    handleCourseDelete={() =>
                      handleCourseDelete(course.id, course.course_code)
                    }
                  />
                ))
              )}

              {courses.length > 0 &&
                courses.map((course, index) => (
                  <tr key={`new-${index}`} className="bg-light-subtle">
                    <td className="text-center">
                      {courseList.length + index + 1}
                    </td>
                    <td>
                      <input
                        type="text"
                        name="course_code"
                        className="form-control form-control-sm"
                        value={course.course_code}
                        onChange={(e) => handleChange(index, e)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="course_title"
                        className="form-control form-control-sm"
                        value={course.course_title}
                        onChange={(e) => handleChange(index, e)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="credit"
                        className="form-control form-control-sm"
                        value={course.credit}
                        onChange={(e) => handleChange(index, e)}
                        required
                      />
                    </td>
                    <td className="text-center">
                      {index === courses.length - 1 && (
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={handleCancle}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className="mb-3 d-flex justify-content-end align-items-end">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={addCourseField}
            >
              + Add New Course
            </button>
          </div>
        </div>
        <div className="col-4">
          <h5>Class Schedule List</h5>
        </div>
      </div>
    </div>
  );
};

export default CourseSchedule;
