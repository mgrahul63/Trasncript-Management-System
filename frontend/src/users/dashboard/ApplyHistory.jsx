import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QueryFetchData } from "../../api/QueryFetch";
import { useData } from "../../context/Context";
import ApplyList from "../apply/ApplyList";
import DetailsShow from "../apply/DetailsShow";
import Status from "../apply/Status";
import Transaction from "../apply/Transaction";

const ApplyHistory = () => {
  const { userInfo } = useData();
  const { registerId, studentId } = userInfo;

  const [isShowTxID, setIsShowTxId] = useState({
    status: false,
    id: "",
    studentId: "",
    registerId: "",
    payment_type: "",
    apply_type: "",
    semester_id: "",
    amount: 0,
    action: "",
  });

  const [isShowModal, setIsShowModal] = useState({
    status: false,
    id: "",
  });

  const [modal, setModal] = useState({
    status: false,
    data: {},
  });

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["applicants", { studentId, registerId }],
    queryFn: QueryFetchData,
  });

  const handleTxId = (
    id,
    studentId,
    registerId,
    payment_type,
    apply_type,
    semester_id,
    amount,
    e,
    action
  ) => {
    e.preventDefault();
    setIsShowTxId((prev) => ({
      ...prev,
      status: true,
      id,
      studentId,
      registerId,
      payment_type,
      apply_type,
      semester_id,
      amount,
      action,
    }));
  };

  const handleShowDetails = (id, e) => {
    e.preventDefault();
    setIsShowModal((prev) => ({
      ...prev,
      status: true,
      id: id,
    }));
  };

  const handleShowStatus = (data) => {
    setModal((prev) => ({
      ...prev,
      status: true,
      data: data,
    }));
  };

  const mergedStyle = {
    ...styles.wrapper,
    ...(isShowModal.status || isShowTxID.status || modal.status
      ? styles.blurred
      : {}),
    minHeight: data?.length <4 ? "500px" : "auto",
  };

  return (
    <>
      <div className="container-fluid" style={mergedStyle}>
        <h2 className="text-center fw-bold text-primary mb-4">
          📄 Application Records
        </h2>

        <div className="table-responsive rounded-3">
          <table className="table table-bordered table-striped table-hover text-center align-middle">
            <thead className="table-primary">
              <tr>
                {[
                  "SN",
                  "Roll",
                  "Reg",
                  "Department",
                  "Apply",
                  "Payment Method",
                  "Amount",
                  "Semester",
                  "Date",
                  "Action",
                ].map((header) => (
                  <th key={header} className="fs-6 text-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10}>
                    <p style={styles.loadingText}>⏳ Loading...</p>
                  </td>
                </tr>
              ) : !isError && data && data.length > 0 ? (
                data
                  .sort(
                    (a, b) =>
                      new Date(b.application_date) -
                      new Date(a.application_date)
                  )
                  .map((item, index) => (
                    <ApplyList
                      key={index}
                      index={index}
                      item={item}
                      onClickTxID={handleTxId}
                      onClickShowDetails={handleShowDetails}
                      onClickShowStatus={handleShowStatus}
                    />
                  ))
              ) : (
                <tr>
                  <td colSpan={10}>
                    <p style={styles.emptyText}>
                      {error?.message ||
                        "🚫 There are no application records available at this time."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal */}
      {isShowTxID.status && (
        <Transaction
          isShowTxID={isShowTxID}
          setIsShowTxId={setIsShowTxId}
          data={data}
        />
      )}

      {/* Show Details Modal */}
      {isShowModal.status && (
        <DetailsShow
          id={isShowModal.id}
          data={data}
          setIsShowModal={setIsShowModal}
        />
      )}

      {/* Show status */}
      {modal.status && (
        <Status modal={modal} setModal={setModal} onhandleTxId={handleTxId} />
      )}
    </>
  );
};

console.log(window.innerWidth);
const styles = {
  wrapper: {
    marginBottom: "200px",
    transition: "0.3s ease",
    backgroundColor: "white",
    padding: "1.5rem 1rem",
    borderRadius: "1rem",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
  },
  blurred: {
    filter: "blur(3px)",
    pointerEvents: "none",
  },
  loadingText: {
    margin: "1rem 0",
    color: "#6c757d",
  },
  emptyText: {
    margin: "1rem 0",
    color: "#6c757d",
  },
};

export default ApplyHistory;
