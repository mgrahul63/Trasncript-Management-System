import ApplyDetailsShow from "./ApplyDetailsShow";
import ApplyPaymentsDetails from "./ApplyPaymentsDetails";

/* eslint-disable react/prop-types */
const DetailsShow = ({ id, data, setIsShowModal }) => {
  const showData = data?.filter((item) => item.id === id);

  const studentId = showData[0]?.studentId;
  const registerId = showData[0]?.registerId;
  const apply_type = showData[0]?.apply_type;
  const semester_id = showData[0]?.semester_id;

  const closeModal = () => {
    setIsShowModal((prev) => ({
      ...prev,
      status: false,
      id: "",
    }));
  };

  return (
    <>
      <style>
        {`
          @media print {
            .modal-header {
              visibility: hidden;
            }

            #printArea, #printArea * {
              visibility: visible;
            }

            #printArea {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }

           
          }
        `}
      </style>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="detailsModalLabel"
        aria-hidden="true"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div className="modal-content">
            <div
              className="modal-header"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h5 className="modal-title text-black" id="detailsModalLabel">
                Application Details
              </h5>
              <button
                type="button"
                className="btn btn-outline-secondary ms-5"
                onClick={() => window.print()}
                title="Print the Report"
              >
                <span role="img" aria-label="Print">
                  &#128438; Print
                </span>
              </button>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>

            <div
              className="modal-body"
              id="#printArea"
              style={{ maxHeight: "70vh", overflowY: "auto" }}
            >
              {showData.length > 0 ? (
                <>
                  {/* Apply Details */}
                  <ApplyDetailsShow showData={showData} />

                  <hr />

                  {/* Payment Details */}
                  <ApplyPaymentsDetails
                    studentId={studentId}
                    registerId={registerId}
                    apply_type={apply_type}
                    semester_id={semester_id}
                  />
                </>
              ) : (
                <p>No details available for this ID.</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsShow;
