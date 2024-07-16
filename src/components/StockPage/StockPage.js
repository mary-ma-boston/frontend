import React, { useState, useEffect, useContext, useRef } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StockPage.css";
import "../../pages/DividendModal/DividendModal.css";
import DividendModal from "../../pages/DividendModal/DividendModal";

import {
  Chart,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  zipProperties,
  filter_properties,
  googleFinance,
  AnalyzeText,
  cnbcNews,
  ReversedText,
  yahooFinance,
} from "../../utils/data";
import { StateContext } from "../../StateContext";
import Filters from "../../pages/Filter/Filter";
import StockTable from "../../pages/StockTable/StockTable";
import Select from "react-select";
import { logPageView } from "../../utils/analytics";
import { useLocation } from "react-router-dom";

Chart.register(
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

let g_isInitialRender = true;
// const sortCountDic = {};

export const StockPage = () => {
  const {
    stockData,
    setStockData,
    loading,
    setLoading,
    pageIndex,
    setPageIndex,
    pageCount,
    setPageCount,
    hasMore,
    setHasMore,
    // filterConfig,
    // setFilters,
    sortConfig,
    setSortConfig,
    filterConditions,
  } = useContext(StateContext);

  const location = useLocation();

  useEffect(() => {
    logPageView();
  }, [location]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedTicker, setSelectedTicker] = useState(null);

  const prevPageIndexRef = useRef(pageIndex);

  const openModal = (ticker) => {
    setSelectedTicker(ticker);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedTicker(null);
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);

        const params = {
          page: pageIndex.num,
          per_page: 20,
        };

        if (filterConditions) {
          params.filterConfig = JSON.stringify(filterConditions);
        }

        if (sortConfig != null) {
          params.sortConfig = JSON.stringify(sortConfig);
        }

        const response = await axios.get("/api/stockdata", { params });

        let newData = [];
        response.data["listData"].forEach((element) => {
          newData.push(zipProperties(element));
        });

        setPageCount(response.data["count"] + 1);

        setStockData(newData);

        setLoading(false);

        if (newData.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error("Error fetching stock data", error);
        setLoading(false);
      }
    };

    if (g_isInitialRender || prevPageIndexRef.current.num !== pageIndex.num) {
      fetchStockData();
      g_isInitialRender = false;
      prevPageIndexRef.current = pageIndex;
    }

    return () => {
      console.log("clear data");
    };
  }, [pageIndex, sortConfig]);

  const handleSort = (key) => {
    if (
      [
        AnalyzeText,
        "industry",
        ReversedText,
        yahooFinance,
        googleFinance,
        cnbcNews,
      ].includes(key)
    ) {
      return;
    }

    let direction = "desc";
    if (sortConfig[key] !== undefined) {
      if (sortConfig[key] === "desc") {
        direction = "asc";
      }
    }

    // if (!(key in sortCountDic) || sortCountDic[key] === 0) {
    //   sortCountDic[key] = 1;
    // } else {
    //   if (sortCountDic[key] % 2 === 0) {
    //     sortCountDic[key] = 0;
    //     setSortConfig({});
    //     g_isInitialRender = true;
    //     setPageIndex({ num: 1 });
    //     return;
    //   } else {
    //     sortCountDic[key] += 1;
    //   }
    // }

    let newSortConfig = { [key]: direction };
    setSortConfig(newSortConfig);
    g_isInitialRender = true;
    setPageIndex({ num: 1 });
  };

  const handleFilterChange = (filters) => {
    // setFilters(filters);

    setPageIndex({ num: 1 });

    g_isInitialRender = true;
  };

  // const handleNextPage = () => {
  //   if (hasMore) {
  //     setPageIndex((prevPage) => ({
  //       num: prevPage.num + 1,
  //     }));
  //     g_isInitialRender = true;
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (pageIndex > 1) {
  //     setPageIndex((prevPage) => ({
  //       num: prevPage.num - 1,
  //     }));
  //     g_isInitialRender = true;
  //   }
  // };

  const handlePageJump = (pageNumber) => {
    setPageIndex({ num: pageNumber });
    g_isInitialRender = true;
  };

  const renderSkipPage = () => {
    return pageCount <= 5 ? (
      <></>
    ) : (
      <>
        <div className="skip">&nbsp;&nbsp;Skip to:&nbsp;</div>
        <div className="pagination-dropdown my-4">
          <Select
            value={{ value: pageIndex.num, label: pageIndex.num }}
            onChange={handlePageChange}
            options={pageOptions}
            className="basic-single num_show"
            classNamePrefix="select"
            isSearchable={true}
            placeholder="Select page"
          />
        </div>
      </>
    );
  };

  const renderPageNumbers = () => {
    const totalPages = pageCount;
    const pageNumbers = [];
    const visiblePages = 5; // Number of visible page buttons

    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, pageIndex.num - Math.floor(visiblePages / 2));
      let endPage = Math.min(
        totalPages,
        pageIndex.num + Math.floor(visiblePages / 2)
      );

      // Adjust startPage and endPage if they go out of bounds
      if (startPage === 1) {
        endPage = visiblePages;
      } else if (endPage === totalPages) {
        startPage = totalPages - visiblePages + 1;
      }

      // // Ensure the number of pages doesn't exceed visiblePages
      // if (endPage - startPage + 1 < visiblePages) {
      //   if (startPage === 1) {
      //     endPage = Math.min(startPage + visiblePages - 1, totalPages);
      //   } else if (endPage === totalPages) {
      //     startPage = Math.max(1, endPage - visiblePages + 1);
      //   }
      // }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (startPage > 1) {
        pageNumbers.unshift(1);

        if (startPage > 2) {
          pageNumbers.splice(1, 0, "...");
        }
      }

      if (endPage < totalPages) {
        pageNumbers.push(totalPages);
        if (endPage < totalPages - 1) {
          pageNumbers.splice(pageNumbers.length - 1, 0, "...");
        }
      }
    }

    return pageNumbers.map((num, index) => {
      if (num === pageIndex.num) {
        return (
          <span key={index} className="mx-2 num_show">
            {num}
          </span>
        );
      }

      return num === "..." ? (
        <span key={index} className="mx-1">
          ...
        </span>
      ) : (
        <button
          key={index}
          onClick={() => handlePageJump(num)}
          className={`btn ${
            pageIndex.num === num ? "btn-secondary" : "btn-primary"
          } mx-1`}
        >
          <span className="num_show">{num}</span>
        </button>
      );
    });
  };

  const handlePageChange = (selectedOption) => {
    setPageIndex({ num: Number(selectedOption.value) });
    g_isInitialRender = true;
  };

  const pageOptions = [];
  for (let i = 1; i <= pageCount; i++) {
    pageOptions.push({ value: i, label: i });
  }

  return (
    <>
      <Filters
        onFilterChange={handleFilterChange}
        availableFields={filter_properties}
      />
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <StockTable
          data={stockData}
          onSort={handleSort}
          sortConfig={sortConfig}
          onRowClick={openModal}
        />
      )}
      <div className="pagination-buttons my-4">
        {/* <button onClick={handlePrevPage} className="btn btn-primary" disabled={page === 1}>Previous Page</button> */}
        <div className="page-numbers">{renderPageNumbers()}</div>
        {/* <button onClick={handleNextPage} className="btn btn-primary ml-2" disabled={!hasMore}>Next Page</button> */}
        {renderSkipPage()}
      </div>
      {modalIsOpen ? (
        <DividendModal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          ticker={selectedTicker}
        />
      ) : (
        <></>
      )}
    </>
  );
};
