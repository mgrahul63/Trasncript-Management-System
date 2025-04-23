/* eslint-disable react/prop-types */

import { useState } from "react";

const CourseList = ({
  course,
  index,
  handleCourseUpdate,
  handleCourseDelete,
}) => {
  const [edit, setEdit] = useState(false);
  const [editedCourse, setEditedCourse] = useState(course);

  const handleEdit = () => {
    // Triggering edit mode for course fields
    setEdit(true);
  };

  const handleSave = () => {
    handleCourseUpdate(index, { ...editedCourse });
    setEdit(false);
  };

  const handleCancel = () => {
    // Reset to original course details and exit edit mode
    setEditedCourse(course);
    setEdit(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = () => {
    handleCourseDelete(index);
  };
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        {edit ? (
          <input
            type="text"
            name="course_code"
            className="form-control form-control-sm"
            value={editedCourse.course_code}
            onChange={handleChange}
          />
        ) : (
          <span className="text-sm">{course.course_code}</span>
        )}
      </td>
      <td>
        {edit ? (
          <input
            type="text"
            name="course_title"
            className="form-control form-control-sm"
            value={editedCourse.course_title}
            onChange={handleChange}
          />
        ) : (
          <span className="text-sm">{course.course_title}</span>
        )}
      </td>
      <td>
        {edit ? (
          <input
            type="text"
            name="credit"
            className="form-control form-control-sm"
            value={editedCourse.credit}
            onChange={handleChange}
          />
        ) : (
          <span className="text-sm">{course.credit}</span>
        )}
      </td>
      <td>
        {edit ? (
          <>
            <div className="d-flex gap-2">
              <button onClick={handleSave} className="btn btn-success btn-sm">
                Save
              </button>
              <button onClick={handleCancel} className="btn btn-danger btn-sm">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="d-flex gap-2">
              <button className="btn btn-warning btn-sm" onClick={handleEdit}>
                Edit
              </button>
              <button className="btn btn-warning btn-sm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
};

export default CourseList;
