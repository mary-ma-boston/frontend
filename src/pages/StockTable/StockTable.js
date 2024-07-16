// src/StockTable.js
import React, { useState, useEffect } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import StockChartTooltip from "../StockChartTooltip";
import axios from "axios";
import {
  filterStringLengh,
  lineChart,
  tableHeader,
  shortTalbeHeaderName,
  AnalyzeText,
  g_columnWidthsMap,
  yahooFinance,
  getColumnStyle,
  googleFinance,
  ReversedText,
  cnbcNews,
} from "../../utils/data";
import { useParams, useNavigate } from "react-router-dom";

import "../../components/StockPage/StockPage.css";
import { tooltipEleFunc } from "../../pages/componentUtil";

const StockTable = ({ data, onSort, sortConfig, onRowClick }) => {
  const [hoveredStock, setHoveredStock] = useState(null);
  const [hoveredStockData, setHoveredStockData] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (hoveredStock) {
      const fetchStockData = async () => {
        try {
          //   const response = await axios.get(`/path-to-your-api-endpoint/${hoveredStock}`);
          const response = { data: lineChart }; //await axios.get(`/path-to-your-api-endpoint/${hoveredStock}`);

          setHoveredStockData(response.data);
        } catch (error) {
          console.error("Error fetching stock data", error);
        }
      };

      fetchStockData();
    }
  }, [hoveredStock]);

  const getSortIcon = (key) => {
    if (
      [
        AnalyzeText,
        ReversedText,
        yahooFinance,
        "industry",
        googleFinance,
        cnbcNews,
      ].indexOf(key) >= 0
    ) {
      return "";
    }

    if (sortConfig[key] !== undefined) {
      return sortConfig[key] === "asc"
        ? "sort-icon fas fa-sort-up"
        : "sort-icon fas fa-sort-down";
    }
    return "sort-icon fas fa-sort";
  };

  return (
    <div className="table-container">
      <table className="stock-table">
        <thead className="tableheadertop">
          <tr>
            {tableHeader.map((element, tmpKey) => (
              <th
                key={tmpKey}
                style={{ width: g_columnWidthsMap[element] }}
                onClick={() => onSort(element)}
              >
                <span>
                  {" "}
                  {shortTalbeHeaderName(element)}{" "}
                  <i className={getSortIcon(element)}></i>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((stock, index) => (
            <tr key={index}>
              {tableHeader.map((element, keyIndex) => {
                if (element == googleFinance) {
                  return (
                    <td
                      key={keyIndex}
                      className={
                        sortConfig[element] !== undefined ? "sortcolor" : ""
                      }
                    >
                      <a href={stock[element]} target="_blank">
                        {stock[element] ? "Go to" : ""}
                      </a>
                    </td>
                  );
                } else if (element == cnbcNews) {
                  return (
                    <td
                      key={keyIndex}
                      className={
                        sortConfig[element] !== undefined ? "sortcolor" : ""
                      }
                      style={getColumnStyle(element)}
                    >
                      <a href={stock[element]} target="_blank">
                        {"Go to"}
                      </a>
                    </td>
                  );
                } else if (element == yahooFinance) {
                  return (
                    <td
                      key={keyIndex}
                      className={
                        sortConfig[element] !== undefined ? "sortcolor" : ""
                      }
                      style={getColumnStyle(element)}
                    >
                      <a href={stock[element]} target="_blank">
                        {"Go to"}
                      </a>
                    </td>
                  );
                } else if (
                  [
                    "lastThirtyChange",
                    "lastNinetyChange",
                    "lastYearChange",
                  ].indexOf(element) >= 0
                ) {
                  return (
                    <td
                      key={keyIndex}
                      className={
                        sortConfig[element] !== undefined ? "sortcolor" : ""
                      }
                      style={{
                        color: parseFloat(stock[element]) > 0 ? "green" : "red",
                        ...getColumnStyle(element),
                      }}
                    >
                      {stock[element]}
                    </td>
                  );
                } else if (element == "dividend") {
                  return (
                    <td
                      key={keyIndex}
                      className={
                        sortConfig[element] !== undefined ? "sortcolor" : ""
                      }
                      style={getColumnStyle(element)}
                    >
                      <span
                        className="linkAnalyze"
                        onClick={() => onRowClick(stock.ticker)}
                      >
                        {" "}
                        {stock[element]}{" "}
                      </span>
                    </td>
                  );
                } else if (element == ReversedText) {
                  return (
                    <td key={keyIndex}>
                      <span
                        className="linkAnalyze"
                        onClick={() =>
                          navigate(`/stock/${stock.ticker}/reverse`)
                        }
                      >
                        {" "}
                        {ReversedText}{" "}
                      </span>
                    </td>
                  );
                } else if (element == AnalyzeText) {
                  return (
                    <td key={keyIndex}>
                      <span
                        className="linkAnalyze"
                        onClick={() =>
                          navigate(`/stock/${stock.ticker}/similar`)
                        }
                      >
                        {" "}
                        {AnalyzeText}{" "}
                      </span>
                    </td>
                  );
                } else if (element == "ticker") {
                  return (
                    <td
                      key={keyIndex}
                      className={
                        sortConfig[element] !== undefined ? "sortcolor" : ""
                      }
                      style={getColumnStyle(element)}
                    >
                      <p style={{ margin: "0px", padding: "0px" }}>
                        {filterStringLengh(stock[element])}
                      </p>
                      <OverlayTrigger
                        placement="bottom"
                        overlay={tooltipEleFunc(stock["name"], 10)}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color: "gray",
                            margin: "0px",
                            padding: "0px",
                          }}
                        >
                          {filterStringLengh(stock["name"], 10)}
                        </span>
                      </OverlayTrigger>
                    </td>
                  );
                } else if (element == "industry") {
                  return (
                    <OverlayTrigger
                      key={keyIndex}
                      placement="top"
                      overlay={tooltipEleFunc(stock[element], 20)}
                    >
                      <td
                        className={
                          sortConfig[element] !== undefined ? "sortcolor" : ""
                        }
                        style={getColumnStyle(element)}
                      >
                        {filterStringLengh(stock[element], 20)}
                      </td>
                    </OverlayTrigger>
                  );
                } else if (element == "pre_price") {
                  return (
                    <OverlayTrigger
                      key={keyIndex}
                      placement="top"
                      overlay={tooltipEleFunc(stock[element], 20)}
                    >
                      <td
                        className={
                          sortConfig[element] !== undefined ? "sortcolor" : ""
                        }
                        style={getColumnStyle(element)}
                      >
                        {"$" + filterStringLengh(stock[element], 20)}
                      </td>
                    </OverlayTrigger>
                  );
                } else {
                  return (
                    <OverlayTrigger
                      key={keyIndex}
                      placement="top"
                      overlay={tooltipEleFunc(stock[element])}
                    >
                      <td
                        className={
                          sortConfig[element] !== undefined ? "sortcolor" : ""
                        }
                        style={getColumnStyle(element)}
                      >
                        {filterStringLengh(stock[element])}
                      </td>
                    </OverlayTrigger>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {hoveredStock && (
        <Tooltip id={`tooltip-${hoveredStock}`} effect="solid">
          {hoveredStockData.length > 0 ? (
            <StockChartTooltip data={hoveredStockData} />
          ) : (
            <p>Loading...</p>
          )}
        </Tooltip>
      )}
    </div>
  );
};

export default StockTable;
