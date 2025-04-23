/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useData } from "../../context/Context";

const ApplicationFrom = ({ setShowData, setFormData }) => {
  const { userInfo } = useData();
  const { studentId, session_id, registerId, facultyName, departmentName } =
    userInfo;

  const location = useLocation();
  const OldformData = location.state?.OldformData;
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: OldformData || {},
  });

  const applyType = watch("apply_type");

  const handleSubmit = async (data) => {
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("session_id", session_id);
    formData.append("registerId", registerId);
    formData.append("facultyName", facultyName);
    formData.append("departmentName", departmentName);
    formData.append("apply_type", data.apply_type);
    formData.append("semester_id", data.semester_id);

    if (data?.previous_transcript_image?.[0]) {
      formData.append(
        "previous_transcript_image",
        data?.previous_transcript_image?.[0]
      );
    }

    if (data.image_file?.[0]) {
      formData.append("image_file", data?.image_file?.[0]);
    }

    if (applyType === "Transcript") {
      formData.append("amount", 150);
    } else if (applyType === "Certificate") {
      formData.append("amount", 300);
    }
    if (OldformData) {
      formData.append("action", "editApply");
      formData.append("id", OldformData?.id);
    } else formData.append("action", "newApply");

    setShowData(true);
    setFormData(formData);
  };

  return (
    <div className="container mt-1 p-4">
      <form
        onSubmit={handleFormSubmit(handleSubmit)}
        className="p-4 border rounded shadow-sm"
      >
        <h2 className="text-center text-black mb-4">Apply From</h2>

        <div className="row">
          {/* Student ID */}
          <div className="col-md-6 mb-3">
            <label htmlFor="studentId" className="form-label">
              Student ID
            </label>
            <input
              type="number"
              id="studentId"
              value={studentId}
              readOnly
              className="form-control"
              {...register("studentId")}
            />
          </div>
          {/* Register ID */}
          <div className="col-md-6 mb-3">
            <label htmlFor="registerId" className="form-label">
              Register ID
            </label>
            <input
              type="number"
              id="registerId"
              value={registerId}
              readOnly
              className="form-control"
              {...register("registerId")}
            />
          </div>
        </div>

        <div className="row">
          {/* Faculty Name */}
          <div className="col-md-6 mb-3">
            <label htmlFor="facultyName" className="form-label">
              Faculty Name
            </label>
            <input
              id="facultyName"
              value={facultyName}
              readOnly
              className="form-control"
              {...register("facultyName")}
            />
          </div>

          {/* Department Name */}
          <div className="col-md-6 mb-3">
            <label htmlFor="departmentName" className="form-label">
              Department Name
            </label>
            <input
              id="departmentName"
              value={departmentName}
              readOnly
              className="form-control"
              {...register("departmentName")}
            />
          </div>
        </div>

        {/* Session ID */}
        <div className="mb-3">
          <label htmlFor="session_id" className="form-label">
            Session Id
          </label>
          <input
            id="session_id"
            value={session_id}
            readOnly
            className="form-control"
            {...register("session_id")}
          />
        </div>

        {/* Apply Type */}
        <div className="mb-3">
          <label htmlFor="apply_type" className="form-label">
            Apply Type
          </label>
          <select
            id="apply_type"
            className={`form-select ${errors.apply_type ? "is-invalid" : ""}`}
            {...register("apply_type", {
              required: "Please select an apply type.",
            })}
          >
            <option value="">Select Apply Type</option>
            <option value="Transcript">Transcript</option>
            <option value="Certificate">Certificate</option>
          </select>
          {errors.apply_type && (
            <div className="invalid-feedback">{errors.apply_type.message}</div>
          )}
        </div>

        {/* Conditional Rendering for Transcript */}
        {applyType === "Transcript" && (
          <>
            <div className="mb-3">
              <label htmlFor="transcriptFee" className="form-label">
                Transcript Fee
              </label>
              <input
                type="text"
                id="transcriptFee"
                value="One Hundred Fifty taka"
                readOnly
                className="form-control"
                {...register("semesterId")}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="semester_id" className="form-label">
                Semester ID
              </label>
              <select
                id="semester_id"
                className={`form-select ${
                  errors.semester_id ? "is-invalid" : ""
                }`}
                {...register("semester_id", {
                  required: "Please select a semester.",
                })}
              >
                <option value="">Select Semester</option>
                {[...Array(8)].map((_, index) => (
                  <option key={index} value={`Semester ${index + 1}`}>
                    Semester {index + 1}
                  </option>
                ))}
              </select>
              {errors.semester_id && (
                <div className="invalid-feedback">
                  {errors.semester_id.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="previous_transcript_image" className="form-label">
                Previous Transcript
              </label>
              <input
                type="file"
                accept="image/*"
                id="previous_transcript_image"
                {...register("previous_transcript_image", {
                  required: "Please upload your transcript.",
                  validate: {
                    lessThan1MB: (files) =>
                      files[0]?.size < 200 * 1024 ||
                      "File size should be less than 200KB",
                  },
                })}
                className="form-control"
              />
              {errors.previous_transcript_image && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {errors.previous_transcript_image.message}
                </div>
              )}
            </div>
          </>
        )}

        {/* Applicant's Image */}
        <div className="mb-3">
          <label htmlFor="image_file" className="form-label">
            Applicant&apos;s Image
          </label>
          <input
            type="file"
            id="image_file"
            accept="image/*"
            {...register("image_file", {
              required: "Please upload your image.",
              validate: {
                lessThan1MB: (files) =>
                  files[0]?.size < 200 * 1024 ||
                  "File size should be less than 200KB",
              },
            })}
            className="form-control"
          />
          {errors.image_file && (
            <div className="invalid-feedback" style={{ display: "block" }}>
              {errors.image_file.message}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            {OldformData ? "Update" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationFrom;
