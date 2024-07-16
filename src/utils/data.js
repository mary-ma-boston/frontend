export const data = [
  {
    name: "AAPL",
    ticker: "122",
    industry: "tech",
    marketCap: "10",
    closingPrice: "11",
    yearChange: "12123",
    peRatio: "11.1",
    dividendYield: "2.2",
  },
  {
    name: "MC",
    ticker: "122",
    industry: "tech",
    marketCap: "10",
    closingPrice: "11",
    yearChange: "12123",
    peRatio: "11.1",
    dividendYield: "2.2",
  },
  {
    name: "MC",
    ticker: "122",
    industry: "tech",
    marketCap: "10",
    closingPrice: "11",
    yearChange: "12123",
    peRatio: "11.1",
    dividendYield: "2.2",
  },
  {
    name: "MC",
    ticker: "122",
    industry: "tech",
    marketCap: "10",
    closingPrice: "11",
    yearChange: "12123",
    peRatio: "11.1",
    dividendYield: "2.2",
  },
];

export const lineChart = [
  {
    date: "2021-1-1",
    price: "10",
  },
  {
    date: "2021-1-2",
    price: "11",
  },
  {
    date: "2021-1-3",
    price: "12",
  },
  {
    date: "2021-1-4",
    price: "13",
  },
  {
    date: "2021-1-5",
    price: "14",
  },
  {
    date: "2021-1-6",
    price: "15",
  },
];

let g_allStockData = null;

export const AnalyzeText = "Similar";
export const ReversedText = "Reversed";
export const yahooFinance = "yahooFinance";
export const googleFinance = "googleFinance";
export const cnbcNews = "CNBC News";

export function GetAllStockData() {
  return g_allStockData;
}

export function SetAllStockData(data) {
  g_allStockData = data;
}

// Function to zip the data array with the column names
export function zipStockHistoryDataWithColumnNames(data) {
  const columnNames = [
    "id",
    "symbol",
    "timestamp",
    "open",
    "high",
    "low",
    "close",
    "volume",
    "volumeP",
  ];

  return data.map((row) => {
    const rowData = {};
    row.forEach((value, index) => {
      rowData[columnNames[index]] = value;
    });
    return rowData;
  });
}

export const table_properties_dontchange = [
  "ticker",
  "name",
  "market",
  "dividend",
  "pre_price",
  "market_cap",
  "lastThirtyChange",
  "lastNinetyChange",
  "lastYearChange",
  "lastThirtyChangeLevel",
  "lastNinetyChangeLevel",
  "lastYearChangeLevel",
  "industry",
  "primary_exchange",
  "divRate",
];
export const filter_properties = [
  "dividend",
  "pre_price",
  "divRate",
  "market_cap",
  "lastThirtyChange",
  "lastNinetyChange",
  "lastYearChange",
];

export const tableHeader = [
  "ticker",
  "industry",
  AnalyzeText,
  ReversedText,
  "dividend",
  "pre_price",
  "divRate",
  "market_cap",
  "lastThirtyChange",
  "lastNinetyChange",
  "lastYearChange",
  yahooFinance,
  googleFinance,
  cnbcNews,
];

export function getCNBCNewsURL(ticker) {
  // Base URL for Google Finance

  return `https://www.cnbc.com/quotes/${ticker}?tab=news`;
}

function getGoogleFinanceURL(ticker, exchangeISO) {
  if (!exchangeISO) {
    return "";
  }
  // Base URL for Google Finance
  const baseURL = "https://www.google.com/finance/quote/";

  // Mapping of ISO codes to Google Finance exchange codes
  const exchangeMap = {
    XNAS: "NASDAQ",
    XNYS: "NYSE",
    // Add more mappings as needed
  };

  if (!(exchangeISO in exchangeMap)) {
    console.log(exchangeISO);
    return "";
  }
  // Get the Google Finance exchange code
  const exchangeCode = exchangeMap[exchangeISO];

  // Check if the exchange code exists in the map
  if (!exchangeCode) {
    throw new Error("Exchange ISO code not recognized");
  }

  // Construct the full URL
  const fullURL = `${baseURL}${ticker}:${exchangeCode}?window=1Y`;

  return fullURL;
}

export function getYahooFinanceURL(ticker) {
  // Base URL for Google Finance
  const baseURL = "https://finance.yahoo.com/quote/";

  // Construct the full URL
  const fullURL = `${baseURL}${ticker}`;

  return fullURL;
}

export function zipProperties(values) {
  let zippedObject = {};
  for (let i = 0; i < table_properties_dontchange.length; i++) {
    let tmpVal = values[i];

    if (["pre_price"].indexOf(table_properties_dontchange[i]) >= 0) {
      tmpVal = values[i].toFixed(2);
      tmpVal = tmpVal > 0 ? tmpVal : "";
    } else if (["dividend"].indexOf(table_properties_dontchange[i]) >= 0) {
      tmpVal = values[i].toFixed(2);
    } else if (table_properties_dontchange[i] == "market_cap") {
      if (tmpVal > 1000000000000) {
        tmpVal = "" + (values[i] / 1000000000000.0).toFixed(2) + " T";
      } else if (tmpVal > 1000000000) {
        tmpVal = "" + (values[i] / 1000000000.0).toFixed(2) + " B";
      } else if (tmpVal > 1000000) {
        tmpVal = "" + (values[i] / 1000000.0).toFixed(2) + " M";
      } else {
        tmpVal = "" + values[i];
      }
    } else if (
      [
        "lastThirtyChange",
        "lastNinetyChange",
        "lastYearChange",
        "divRate",
      ].indexOf(table_properties_dontchange[i]) >= 0
    ) {
      tmpVal = "" + (values[i] * 100.0).toFixed(2) + "%";
    }

    zippedObject[table_properties_dontchange[i]] = tmpVal;
  }

  zippedObject[yahooFinance] = getYahooFinanceURL(zippedObject["ticker"]);
  zippedObject[googleFinance] = getGoogleFinanceURL(
    zippedObject["ticker"],
    zippedObject["primary_exchange"]
  );
  zippedObject[cnbcNews] = getCNBCNewsURL(zippedObject["ticker"]);
  return zippedObject;
}

export function convertStockHistoryDataAndInfo(data) {
  const result = {
    dates: [],
    prices: [],
  };

  data["history"].forEach((item) => {
    result.prices.push(item[0]);
    result.dates.push(item[1]);
    // let tmp = new Date(item[1]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year:"2-digit" })
    // result.labels.push(  tmp + ":" + item[0])
  });

  let retResult = result;
  if (data["info"] && data["info"].length > 0) {
    let retStockInfo = zipProperties(data["info"][0]);
    retResult = { ...retResult, ...retStockInfo };
  }

  return retResult;
}

export function convertMultiSimilarData(data) {
  const result = {};
  data["info"].forEach((item) => {
    result[item[0]] = {
      name: item[1],
      prices: [],
      dates: [],
      ...zipProperties(item),
    };
  });

  data["history"].forEach((item) => {
    let symbol = item[0];
    let closePrice = item[1];
    let timeDate = item[2];
    if (symbol in result) {
      result[symbol].prices.push(closePrice);
      result[symbol].dates.push(timeDate);
    }
  });

  return result;
}

const headerNameMap = {
  ticker: "Symbol",
  name: "Name",
  market: "Market",
  dividend: "Last_Year_Dividend",
  market_cap: "Market_Cap",
  lastThirtyChange: "30D Performance",
  lastNinetyChange: "90D Performance",
  lastYearChange: "1Y Performance",
  lastThirtyChangeLevel: "30D Change Level",
  lastNinetyChangeLevel: "90D Change Level",
  lastYearChangeLevel: "1Y Change Level",
  industry: "Industry",
  googleFinance: "Google Finance",
  yahooFinance: "Yahoo Finance",
  pre_price: "Price",
  divRate: "Last_Year_Dividend / Price",
};

const columnStyle = {
  ticker: { fontWeight: "bold" },
  dividend: { fontWeight: "bold" },
  market_cap: { fontWeight: "bold" },
  lastThirtyChange: { fontWeight: "bold" },
  lastNinetyChange: { fontWeight: "bold" },
  lastYearChange: { fontWeight: "bold" },
  pre_price: { fontWeight: "bold" },
  divRate: { fontWeight: "bold" },
  industry: { fontSize: "12px" },
};

export const getColumnStyle = (varName) => {
  if (varName in columnStyle) {
    return columnStyle[varName];
  }

  return {};
};

export const filterStringLengh = (inputStr, limitLen = 15) => {
  if (typeof inputStr !== "string") {
    return inputStr;
  }

  if (inputStr.length > limitLen) {
    return inputStr.slice(0, limitLen) + "...";
  }

  return inputStr;
};

export const getDisplayName = (varName) => {
  if (varName in headerNameMap) {
    return headerNameMap[varName];
  }

  return varName;
};

export const g_columnWidthsMap = {
  ticker: "200px",
  name: "200px",
  market: "100px",
  [AnalyzeText]: "100px",
  dividend: "150px",
  market_cap: "300px",
  pre_price: "100px",
  lastThirtyChange: "100px",
  lastNinetyChange: "100px",
  lastYearChange: "100px",
  lastThirtyChangeLevel: "100px",
  lastNinetyChangeLevel: "100px",
  lastYearChangeLevel: "100px",
  industry: "100px",
  googleFinance: "100px",
  divRate: "200px",
};

// Function to map the header names
export function shortTalbeHeaderName(name) {
  return headerNameMap[name] || name;
}

export const getFirstDatesOfEachMonth = (dates) => {
  let seenMonths = new Set();
  return dates.map((dateString) => {
    const date = new Date(dateString);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
    });
    return formattedDate;

    if (seenMonths.has(monthKey)) {
      return "";
    } else {
      seenMonths.add(monthKey);
      return formattedDate;
    }
  });
};
