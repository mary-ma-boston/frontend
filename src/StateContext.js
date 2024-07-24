// src/StateContext.js
import React, { createContext, useState } from "react";
export const c_searchFiledName = "info";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState({ num: 1 });
  const [pageCount, setPageCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // const [filterConfig, setFilters] = useState(null);
  const [sortConfig, setSortConfig] = useState({});
  const [filterConditions, setFilterConditions] = useState([
    { field: c_searchFiledName, condition: "like", value: "" },
    { field: "", condition: "", value: "" },
  ]);
  const [searchValue, setSearchValue] = useState("");

  return (
    <StateContext.Provider
      value={{
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
        setFilterConditions,
        searchValue,
        setSearchValue,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
