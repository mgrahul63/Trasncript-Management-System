/* eslint-disable react/prop-types */

import axios from "axios";
import { useEffect, useState } from "react";

const ApplyList = ({
  item,
  index,
  onClickTxID,
  onClickShowDetails,
  onClickShowStatus,
}) => {
  const [paymentStatus, setPaymentStatus] = useState();

  useEffect(() => {
    const query = async () => {
      try {
        const response = await axios.post(
          "http://localhost/versity/backend/api/status.php",
          {
            studentId: item?.studentId,
            registerId: item?.registerId,
            semester_id: item?.semester_id,
          }
        );
        

        if (response.data?.status === 1) {
          setPaymentStatus(response.data?.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (item?.studentId && item?.registerId && item?.semester_id) {
      query();
    }
  }, [item?.studentId, item?.registerId, item?.semester_id]);

  console.log(paymentStatus);
  return (
    <tr className={index % 2 === 0 ? "table-light" : "table-white"}>
      <th scope="row">{index + 1}</th>
      <td>{item?.studentId}</td>
      <td>{item?.registerId}</td>
      <td>{item?.departmentName}</td>
      <td>{item?.apply_type}</td>
      <td>
        {item?.payment_type === "Offline" ? (
          paymentStatus?.toLowerCase() === "approved" ? (
            <>
              <span>{item?.payment_type}</span> <br />
              <span className="small text-success">✅ Approved</span>
            </>
          ) : paymentStatus?.toLowerCase() === "pending" ? (
            <>
              <span>{item?.payment_type}</span>
              <br />
              <button className="btn btn-sm btn-secondary small" disabled>
                Pending
              </button>
            </>
          ) : (
            <>
              <span>{item?.payment_type}</span>
              <br />
              <button
                className="btn btn-sm btn-primary mt-2 small"
                onClick={(e) =>
                  onClickTxID(
                    item?.id,
                    item?.studentId,
                    item?.registerId,
                    item?.payment_type,
                    item?.apply_type,
                    item?.semester_id,
                    item?.amount,
                    e
                  )
                }
              >
                Verify Payment
              </button>
            </>
          )
        ) : (
          <span className="small">{item?.payment_type}</span>
        )}
      </td>

      <td>{item?.amount}</td>
      <td>{item?.apply_type === "Certificate" ? "" : item?.semester_id}</td>
      <td>{item?.application_date}</td>
      <td>
        <div className="d-flex justify-content-between align-items-center gap-2">
          <button
            onClick={(e) => onClickShowDetails(item?.id, e)}
            className="btn btn-success btn-sm"
            title="Click to view details"
          >
            Show
          </button>
          <button
            onClick={() => onClickShowStatus(item)}
            className="btn btn-info btn-sm"
            title="Click to view application status"
          >
            Status
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ApplyList;
