/* eslint-disable react/prop-types */
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import money from "../../assets/Images/many-us-dollars-banknotes_1398-4254.webp";

const ApplyPaymentsDetails = ({
  studentId,
  registerId,
  apply_type,
  semester_id,
}) => {
  const PaymentDetails = async ({ queryKey }) => {
    try {
      const response = await axios.get(
        `http://localhost/versity/backend/api/${queryKey?.[0]}.php${
          // Only append parameters if they exist
          queryKey[1]?.studentId ||
          queryKey[1]?.registerId ||
          queryKey[1]?.semester_id ||
          queryKey[1]?.apply_type
            ? `?${
                queryKey[1]?.studentId
                  ? `studentId=${queryKey[1]?.studentId}`
                  : ""
              }${
                queryKey[1]?.studentId &&
                (queryKey[1]?.registerId ||
                  queryKey[1]?.semester_id ||
                  queryKey[1]?.apply_type)
                  ? "&"
                  : ""
              }${
                queryKey[1]?.registerId
                  ? `registerId=${queryKey[1]?.registerId}`
                  : ""
              }${
                queryKey[1]?.registerId &&
                (queryKey[1]?.semester_id || queryKey[1]?.apply_type)
                  ? "&"
                  : ""
              }${
                queryKey[1]?.semester_id
                  ? `semester_id=${queryKey[1]?.semester_id}`
                  : ""
              }${
                queryKey[1]?.semester_id && queryKey[1]?.apply_type ? "&" : ""
              }${
                queryKey[1]?.apply_type
                  ? `apply_type=${queryKey[1]?.apply_type}`
                  : ""
              }`
            : ""
        }`
      );

      return response.data; // Successful response
    } catch (error) {
      // Throw an error so react-query can catch it
      throw new Error(error.response?.data?.message || "Error fetching data");
    }
  };

  const {
    data: payments,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment", { studentId, registerId, apply_type, semester_id }],
    queryFn: PaymentDetails,
  });

  const paymentDetails = payments?.data;

  return (
    <div className="container mt-4">
      <div className="border rounded-top bg-white">
        <h3
          className="text-left p-2 bg-success rounded-top"
          style={{ fontSize: "17px", color: "#151615" }}
        >
          Payment Details
        </h3>
        {isLoading && <p>Loading....</p>}
        {isError && <p>Error: {error.message}</p>}

        <table className="table table-bordered table-striped table-hover">
          <thead className="table-success">
            <tr>
              <th>Transaction ID</th>
              <th>Payment Date</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {paymentDetails ? (
              <tr>
                <td>{paymentDetails?.transaction_id}</td>
                <td>{paymentDetails?.payment_date}</td>
                <td>${paymentDetails?.amount}</td>
                <td>{paymentDetails?.payment_method}</td>
                <td>
                  <span
                    className={`badge ${
                      paymentDetails?.status?.toLowerCase() === "rejected"
                        ? "bg-danger"
                        : paymentDetails?.status?.toLowerCase() === "approved"
                        ? "bg-success"
                        : paymentDetails?.status?.toLowerCase() === "pending"
                        ? "bg-warning"
                        : "bg-secondary"
                    }`}
                  >
                    {paymentDetails?.status?.charAt(0).toUpperCase() +
                      paymentDetails?.status.slice(1).toLowerCase()}
                  </span>
                </td>

                <td className="text-center">
                  <img
                    src={paymentDetails.image_file || money}
                    alt="Payment Proof"
                    className="img-thumbnail"
                    style={{ maxWidth: "60px", borderRadius: "8px" }}
                  />
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Unpaid
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplyPaymentsDetails;
