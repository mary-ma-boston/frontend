import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { addDays, format } from "date-fns";
import "./StockChart.css";
import {
  filterStringLengh,
  convertStockHistoryDataAndInfo,
  convertMultiSimilarData,
  getFirstDatesOfEachMonth,
  tableHeader,
  shortTalbeHeaderName,
  yahooFinance,
  AnalyzeText,
  googleFinance,
  cnbcNews,
  ReversedText,
} from "../../utils/data";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-plugin-crosshair";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { tooltipEleFunc } from "../../pages/componentUtil";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  CrosshairPlugin
);
// Mock data for stock price history and additional stock information

const StockChart = () => {
  const { symbol, direct } = useParams();
  const [stock1, setStockData1] = useState(null);
  const [stock2, setStockData2] = useState(null);
  // const stock2 = stockData[symbol === 'AAPL' ? 'MSFT' : 'AAPL']; // For demo, show another stock chart

  const [range, setRange] = useState({
    startDate: addDays(new Date(), -360),
    endDate: new Date(),
  });

  const startDate = range.startDate;
  const endDate = range.endDate;

  // const [crossLinePos, setCrossLinePos] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/stock_close_history", {
          params: {
            symbol: symbol,
            start_date: startDate,
            end_date: endDate,
          },
        });

        setStockData1(convertStockHistoryDataAndInfo(response.data));

        const responseSimilarStock = await axios.get("/api/stock_similar", {
          params: {
            ticker: symbol,
            direct: direct,
            period: 252,
            start_date: startDate,
            end_date: endDate,
          },
        });

        setStockData2(convertMultiSimilarData(responseSimilarStock.data));
      } catch (error) {
        console.error("Error fetching stock history:", error);
      }
    };

    if (symbol && startDate && endDate) {
      fetchData();
    }
  }, [symbol, startDate, endDate, direct]);

  const handleRangeChange = (startDate, endDate) => {
    setRange({ startDate, endDate });
  };

  const handleMouseMove = (event) => {
    //   if (chartRef.current && chartRef.current.chartInstance) {
    //       const canvas = chartRef.current.chartInstance.canvas;
    //       const rect = canvas.getBoundingClientRect();
    //       const offsetX = event.clientX - rect.left;
    //       setCrossLinePos(offsetX);
    //       console.log(offsetX)
    //   }
    //   if (chartRef.current) {
    //     const canvas = chartRef.current.canvas;
    //     const rect = canvas.getBoundingClientRect();
    //     const offsetX = event.clientX - rect.left;
    //     setCrossLinePos(offsetX);
    //   }
  };

  if (!stock1) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const filterDataByRange = (stock) => {
    const filteredDates = stock.dates.filter((date) => {
      const currentDate = new Date(date);
      return currentDate >= startDate && currentDate <= endDate;
    });
    const filteredPrices = stock.prices.slice(
      stock.dates.indexOf(filteredDates[0]),
      stock.dates.indexOf(filteredDates[filteredDates.length - 1]) + 1
    );

    // let retDates = [];
    // filteredDates.forEach((element) => {
    //   retDates.push("");
    // });

    return {
      dates: getFirstDatesOfEachMonth(filteredDates),
      prices: filteredPrices,
      orgDates: stock.dates,
    };
  };

  const createChartData = (stock, change = false) => {
    const filteredData = filterDataByRange(stock);
    return {
      labels: filteredData.dates,
      datasets: [
        {
          dates: filteredData.orgDates,
          data: filteredData.prices,
          fill: false,
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          borderColor: change
            ? "rgba(40, 100, 169, 1.0)"
            : "rgba(40, 167, 69, 1.0)",
          tension: 0.01,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      point: {
        radius: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        padding: 10,
        boxPadding: 5,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        displayColors: false,
        callbacks: {
          title: function (tooltipItems) {
            return "";
          },
          label: function (context) {
            let label = context.dataset.data[context.dataIndex];
            if (label) {
              label =
                new Date(
                  context.dataset.dates[context.dataIndex]
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "2-digit",
                }) +
                ": " +
                label;
            }

            // if (context.parsed.y !== null) {
            //   label += new Intl.NumberFormat('en-US', {
            //     style: 'currency',
            //     currency: 'USD',
            //   }).format(context.parsed.y);
            // }
            return label;
          },
          afterLabel: function (context) {
            // const date = new Date(context.label);
            // const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            // return ` (${formattedDate})`;
            return "";
          },
        },
      },
      crosshair: {
        line: {
          color: "#aaa", // Cross line color
          width: 1, // Cross line width
          dashPattern: [5, 5], // Cross line dash pattern
        },
        sync: {
          enabled: true, // Enable trace line syncing with other charts
          group: 1, // Chart group
          suppressTooltips: false, // Suppress tooltips when showing a synced tracer
        },
        zoom: {
          enabled: false, // Enable zooming
          zoomboxBackgroundColor: "rgba(66,133,244,0.2)", // Set zoom box color
          zoomboxBorderColor: "#48F", // Set zoom box border color
          zoomButtonText: "Reset Zoom", // Default zoom button text
          zoomButtonClass: "reset-zoom", // Default zoom button class
        },
        callbacks: {
          beforeZoom: function (start, end) {
            // Called before zoom, return false to prevent zoom
            return true;
          },
          afterZoom: function (start, end) {
            // Called after zoom
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
          text: "Date",
          font: {
            size: 14,
          },
        },
        ticks: {
          font: {
            size: 12,
          },
          autoSkip: true,
          maxTicksLimit: 20,
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Price (USD)",
          font: {
            size: 14,
          },
        },
        ticks: {
          font: {
            size: 12,
            name: "Courier New",
          },
          callback: function (value, index, values) {
            return "$" + ("" + parseFloat(value).toFixed(2)).padStart(8, " ");
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          borderDash: [5, 5],
        },
      },
    },
  };

  let subEle = (element, stock) => {
    if (element === googleFinance) {
      return (
        <span className="stock-info-value">
          <a href={stock[element]} target="_blank" rel="noopener noreferrer">
            {stock[element] ? "Go to" : ""}
          </a>
        </span>
      );
    } else if (element === yahooFinance) {
      return (
        <span className="stock-info-value">
          <a href={stock[element]} target="_blank" rel="noopener noreferrer">
            {"Go to"}
          </a>
        </span>
      );
    } else if (element === cnbcNews) {
      return (
        <span className="stock-info-value">
          <a href={stock[element]} target="_blank" rel="noopener noreferrer">
            {"Go to"}
          </a>
        </span>
      );
    } else if (
      ["lastThirtyChange", "lastNinetyChange", "lastYearChange"].indexOf(
        element
      ) >= 0
    ) {
      return (
        <span
          className="stock-info-value"
          style={{ color: parseFloat(stock[element]) > 0 ? "green" : "red" }}
        >
          {stock[element]}
        </span>
      );
    } else if (element === AnalyzeText) {
      return <></>;
    } else {
      return (
        <OverlayTrigger
          placement="top"
          overlay={tooltipEleFunc(stock[element])}
        >
          <span className="stock-info-value">
            {filterStringLengh(stock[element])}
          </span>
        </OverlayTrigger>
      );
    }
  };

  return (
    <div className="stock-chart-container">
      {/* <h1>Stock Information</h1> */}
      <div className="date-range-picker">
        <div className="predefined-ranges">
          <button
            onClick={() =>
              handleRangeChange(addDays(new Date(), -30), new Date())
            }
          >
            Last 30 days
          </button>
          <button
            onClick={() =>
              handleRangeChange(addDays(new Date(), -90), new Date())
            }
          >
            Last 90 days
          </button>
          <button
            onClick={() =>
              handleRangeChange(addDays(new Date(), -360), new Date())
            }
          >
            Last 1 year
          </button>
        </div>
        <div className="custom-date-picker">
          <label>Start Date:</label>
          <input
            type="date"
            value={format(range.startDate, "yyyy-MM-dd")}
            onChange={(e) =>
              handleRangeChange(new Date(e.target.value), range.endDate)
            }
          />
          <label>End Date:</label>
          <input
            type="date"
            value={format(range.endDate, "yyyy-MM-dd")}
            onChange={(e) =>
              handleRangeChange(range.startDate, new Date(e.target.value))
            }
          />
        </div>
      </div>

      <div className="chart-wrapper" onMouseMove={handleMouseMove}>
        <div className="chart">
          <Line
            ref={chartRef}
            data={createChartData(stock1)}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
              },
            }}
          />
        </div>
        <div className="stock-info-card">
          <OverlayTrigger placement="top" overlay={tooltipEleFunc(stock1.name)}>
            <h2>{filterStringLengh(stock1.name, 25)}</h2>
          </OverlayTrigger>
          <div className="stock-info-card-inner">
            {tableHeader.map((element, tmpKey) => {
              if ([AnalyzeText, ReversedText].indexOf(element) >= 0) {
                return <></>;
              } else {
                return (
                  <p key={tmpKey} className="stock-info-item">
                    <span className="stock-info-label">
                      {shortTalbeHeaderName(element)}:
                    </span>
                    {subEle(element, stock1)}
                  </p>
                );
              }
            })}
          </div>
          {/* <p className="stock-info-item">
            <span className="stock-info-label">Previous Price:</span>
            <span className="stock-info-value">{stock1.pre_price}</span>
          </p> */}
        </div>
      </div>

      {stock2 && (
        <div>
          <div className="right-align">
            <h4 style={{ marginRight: "20px" }}>
              {direct === "similar"
                ? "Top 10 Similar Stocks"
                : "Top 10 Reversed Stocks"}
            </h4>
          </div>
          {Object.keys(stock2).map((symbol) => (
            <div className="stock-info-container">
              <div className="chart">
                <Line
                  data={createChartData(stock2[symbol], true)}
                  options={{
                    ...options,
                    plugins: {
                      ...options.plugins,
                    },
                  }}
                />
              </div>
              <div className="lowercard stock-info-card">
                <OverlayTrigger
                  placement="top"
                  overlay={tooltipEleFunc(stock2[symbol].name)}
                >
                  <h2>{filterStringLengh(stock2[symbol].name, 25)}</h2>
                </OverlayTrigger>
                <div className="stock-info-card-inner">
                  {tableHeader.map((element, tmpKey) => {
                    if ([AnalyzeText, ReversedText].indexOf(element) >= 0) {
                      return <></>;
                    } else {
                      return (
                        <p key={tmpKey} className="stock-info-item">
                          <span className="stock-info-label">
                            {shortTalbeHeaderName(element)}:
                          </span>
                          {subEle(element, stock2[symbol])}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* {crossLinePos !== null && (
        <div className="cross-line" style={{ left: crossLinePos }}>
          <div className="line-vertical"></div>
          <div className="line-horizontal"></div>
          <div className="cross-point"></div>
        </div>
      )} */}
      <div style={{ height: "200px" }}></div>
    </div>
  );
};

export default StockChart;
