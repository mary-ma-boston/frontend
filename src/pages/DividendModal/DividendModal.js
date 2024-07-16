import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DividendModal.css";

const ITEMS_PER_PAGE = 8;

const DividendModal = ({ isOpen, onRequestClose, ticker }) => {
  const [dividendData, setDividendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (ticker) {
      fetchDividendData();
    }
  }, [ticker]);

  const fetchDividendData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/dividenddata`, {
        params: { ticker },
      });
      setDividendData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dividend data", error);
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(dividendData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = dividendData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      style={{ display: isOpen ? "block" : "none" }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Dividend History for {ticker}</h5>
          </div>
          <div className="modal-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                {dividendData.length > 0 ? (
                  <>
                    <table className="table table-striped mt-3">
                      <thead>
                        <tr>
                          <th
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Declaration Date
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Dividend Amount
                          </th>
                          <th
                            style={{
                              textAlign: "center",
                            }}
                          >
                            Pay Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((dividend, index) => (
                          <tr key={index}>
                            <td>
                              {new Date(dividend[0]).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td>{dividend[1]}</td>
                            <td>
                              {new Date(dividend[2]).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="pagination d-flex justify-content-center mt-3">
                      <button
                        className="btn btn-primary mx-1"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          className={`btn btn-secondary mx-1 ${
                            currentPage === i + 1 ? "active" : ""
                          }`}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className="btn btn-primary mx-1"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </>
                ) : (
                  <p>No dividend data found for the specified ticker.</p>
                )}
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onRequestClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DividendModal;
