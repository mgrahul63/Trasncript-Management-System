/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";

const ApplicationDetails = ({ applicationId }) => {
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `/api/getApplicationDetails.php?application_id=${applicationId}`
        );
        setApplication(response.data);
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    fetchApplication();
  }, [applicationId]);

  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Application Details</h1>
      <p>Student ID: {application.studentId}</p>
      <p>Faculty: {application.facultyName}</p>
      <p>Department: {application.departmentName}</p>
      <p>Transcript Fee: {application.transcript_fee}</p>

      <h2>Images</h2>
      <div>
        <h3>Uploaded Image:</h3>
        <img
          src={application.image_file}
          alt="Uploaded Image"
          style={{ width: "200px" }}
        />
      </div>
      <div>
        <h3>Previous Transcript Image:</h3>
        <img
          src={application.previous_transcript_image}
          alt="Previous Transcript Image"
          style={{ width: "200px" }}
        />
      </div>
    </div>
  );
};

export default ApplicationDetails;
