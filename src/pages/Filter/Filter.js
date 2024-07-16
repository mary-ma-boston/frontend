// src/Filters.js
import React, { useContext, useState } from "react";
import { StateContext, c_searchFiledName } from "../../StateContext";
import { getDisplayName } from "../../utils/data";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Filter.css";
import DeleteConfirmationModal from "../DeleteConfirmationModal";

const Filters = ({ onFilterChange, availableFields }) => {
  const { filterConditions, setFilterConditions, searchValue, setSearchValue } =
    useContext(StateContext);

  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  //validate prePrice
  const [prePriceValidate, setPrePriceValidate] = useState(true);
  const [prePriceValidateMessage, setPrePriceValidateMessage] = useState("");

  //validate dividend
  const [dividendValidate, setDividendValidate] = useState(true);
  const [dividendValidateMessage, setDividendValidateMessage] = useState("");

  //validate market cap
  const [marketCapValidate, setMarketCapValidate] = useState(true);
  const [marketCapValidateMessage, setMarketCapValidateMessage] = useState("");

  //validate DivRate
  const [divRateValidate, setDivRateValidate] = useState(true);
  const [divRateValidateMessage, setDivRateValidateMessage] = useState("");

  //validate lastThirtyChange
  const [lastThirtyValidate, setLastThirtyValidate] = useState(true);
  const [lastThirtyValidateMessage, setLastThirtyValidateMessage] =
    useState("");

  //validate lastNinetyChange
  const [lastNinetyValidate, setLastNinetyValidate] = useState(true);
  const [lastNinetyValidateMessage, setLastNinetyValidateMessage] =
    useState("");

  //validate lastYearChange
  const [lastYearValidate, setLastYearValidate] = useState(true);
  const [lastYearValidateMessage, setLastYearValidateMessage] = useState("");

  const handleReset = () => {
    // Perform delete action here
    let newFilterConfig = [
      { field: c_searchFiledName, condition: "like", value: "" },
      { field: "", condition: "", value: "" },
    ];

    setSearchValue("");
    setFilterConditions(newFilterConfig);
    onFilterChange(newFilterConfig);

    setShowModal(false);
  };

  const resetFilter = () => {
    setShowModal(true);

    setPrePriceValidate(true);
    setPrePriceValidateMessage("");

    setDividendValidate(true);
    setDividendValidateMessage("");

    setMarketCapValidate(true);
    setMarketCapValidateMessage("");

    setDivRateValidate(true);
    setDivRateValidateMessage("");

    setLastThirtyValidate(true);
    setLastThirtyValidateMessage("");

    setLastNinetyValidate(true);
    setLastNinetyValidateMessage("");

    setLastYearValidate(true);
    setLastYearValidateMessage("");
  };

  const handleAddFilter = () => {
    let newFilterConfig = [
      ...filterConditions,
      { field: "", condition: "", value: "" },
    ];

    setFilterConditions(newFilterConfig);

    setMarketCapValidateMessage("");
  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const newFilterConditions = [...filterConditions];

    // const currentFilter = newFilterConditions[index];
    // if (isNaN(currentFilter.value) && (currentFilter.condition === '>' || currentFilter.condition === '<')) {
    //   setError('Value must be a number for comparison filters.');
    //   return;
    // }

    newFilterConditions[index][name] = value;
    setFilterConditions(newFilterConditions);
  };

  const handleBlur = (index, e) => {
    const { value } = e.target;

    //validate preprice
    if (filterConditions[index].field === "pre_price" && value !== null) {
      const prePricePattern = /^-?\d+(\.\d+)?$/;

      if (!prePricePattern.test(value)) {
        setPrePriceValidate(false);
        setPrePriceValidateMessage(
          "Invalid prePrice. Expected format: daigital"
        );
      } else {
        setPrePriceValidate(true);
        setPrePriceValidateMessage("");
      }
    }

    //validate divident
    if (filterConditions[index].field === "divident" && value !== null) {
      const dividendPattern = /^-?\d+(\.\d+)?$/;

      if (!dividendPattern.test(value)) {
        setDividendValidate(false);
        setDividendValidateMessage(
          "Invalid dividend. Expected format: daigital"
        );
      } else {
        setDividendValidate(true);
        setDividendValidateMessage("");
      }
    }

    //validate market cap
    if (filterConditions[index].field === "market_cap" && value !== null) {
      const marketCapPattern = /^\d+(\.\d+)?\s?[MBTmbt]?$/;

      if (!marketCapPattern.test(value)) {
        setMarketCapValidate(false);
        setMarketCapValidateMessage(
          "Invalid marketCap. Expected format: daigital or digital + M, B, T, m, b, t"
        );
      } else {
        setMarketCapValidate(true);
        setMarketCapValidateMessage("");
      }
    }

    //validate lastyear divident/price
    if (filterConditions[index].field === "divRate" && value !== null) {
      const divRatePattern = /^\d+(\.\d+)?%?$/;

      if (!divRatePattern.test(value)) {
        setDivRateValidate(false);
        setDivRateValidateMessage(
          "Invalid divRate. Expected format: digital or digital + %"
        );
      } else {
        setDivRateValidate(true);
        setDivRateValidateMessage("");
      }
    }

    //validate 30days performance
    if (
      filterConditions[index].field === "lastThirtyChange" &&
      value !== null
    ) {
      const lastThirtyChangePattern = /^\d+(\.\d+)?%?$/;

      if (!lastThirtyChangePattern.test(value)) {
        setLastThirtyValidate(false);
        setLastThirtyValidateMessage(
          "Invalid lastThirtyChange. Expected format: digital or digital + %"
        );
      } else {
        setLastThirtyValidate(true);
        setLastThirtyValidateMessage("");
      }
    }

    //validate 90days performance
    if (
      filterConditions[index].field === "lastNinetyChange" &&
      value !== null
    ) {
      const lastNinetyChangePattern = /^\d+(\.\d+)?%?$/;

      if (!lastNinetyChangePattern.test(value)) {
        setLastNinetyValidate(false);
        setLastNinetyValidateMessage(
          "Invalid lastNinetyChange.Expected format: digital or digital + %"
        );
      } else {
        setLastYearValidate(true);
        setLastYearValidateMessage("");
      }
    }

    //validate lastyear performance
    if (filterConditions[index].field === "lastYearChange" && value !== null) {
      const lastYearChangePattern = /^\d+(\.\d+)?%?$/;

      if (!lastYearChangePattern.test(value)) {
        setLastYearValidate(false);
        setLastYearValidateMessage(
          "Invalid lastYearChange.Expected format: digital or digital + %"
        );
      } else {
        setLastYearValidate(true);
        setLastYearValidateMessage("");
      }
    }
  };

  const handleSearchInputChange = (e) => {
    const { value } = e.target;
    const newFilterConditions = [...filterConditions];

    let tmpArr = newFilterConditions.filter(
      (oneItem) => oneItem.field === c_searchFiledName
    );

    if (tmpArr.length <= 0) {
      let tmpFilterConfig = [
        { field: c_searchFiledName, condition: "like", value },
        ...newFilterConditions,
      ];
      setFilterConditions(tmpFilterConfig);
    } else {
      tmpArr[0].value = value;
      setFilterConditions(newFilterConditions);
    }

    setSearchValue(value);
  };

  const handleRemoveFilter = (index) => {
    const newFilterConditions = filterConditions.filter((_, i) => i !== index);
    setFilterConditions(newFilterConditions);

    if (filterConditions[index].field === "market_cap") {
      setMarketCapValidate(true);
      setMarketCapValidateMessage("");
    } else if (filterConditions[index].field === "pre_price") {
      setPrePriceValidate(true);
      setPrePriceValidateMessage("");
    } else if (filterConditions[index].field === "dividend") {
      setDividendValidate(true);
      setDividendValidateMessage("");
    } else if (filterConditions[index].field === "divRate") {
      setDivRateValidate(true);
      setDivRateValidateMessage("");
    } else if (filterConditions[index].field === "lastThirtyChange") {
      setLastThirtyValidate(true);
      setLastThirtyValidateMessage("");
    } else if (filterConditions[index].field === "lastNinetyChange") {
      setLastNinetyValidate(true);
      setLastNinetyValidateMessage("");
    } else if (filterConditions[index].field === "lastYearChange") {
      setLastYearValidate(true);
      setLastYearValidateMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onFilterChange(filterConditions);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      onFilterChange(filterConditions);
    }
  };

  const handleSearchClick = () => {
    onFilterChange(filterConditions);
  };

  return (
    <div className="filters my-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="search-bar">
        <input
          type="text"
          maxLength="200"
          className="form-control"
          placeholder="Search by Symbol, Name or Industry..."
          name={c_searchFiledName}
          value={searchValue}
          onChange={(e) => handleSearchInputChange(e)}
          onKeyDown={handleSearchKeyPress}
        />
        <i
          className="fas fa-search search-icon"
          onClick={handleSearchClick}
        ></i>
        {/* <button
          className="btn btn-primary"
          onClick={handleSearchClick}
          style={{ height: "38px", width: "40px" }}
        >
          <i className="fas fa-search"></i>
        </button> */}
        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddFilter}
            style={{ width: "85px", height: "34px" }}
          >
            Add Filter
          </button>
        </div>

        <div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={resetFilter}
            style={{ width: "85px", height: "34px" }}
          >
            Reset
          </button>
        </div>
      </div>

      {filterConditions
        .filter((item, _) => item.field !== c_searchFiledName)
        .map((filter, index) => (
          <div className="filteritem row mb-2" key={index}>
            <div className="col-md-3">
              <select
                className="form-control"
                name="field"
                value={filter.field}
                onChange={(e) => handleInputChange(index + 1, e)}
              >
                <option value="">Select Field</option>
                {availableFields.map((field, idx) => (
                  <option key={idx} value={field}>
                    {getDisplayName(field)}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-control"
                name="condition"
                value={filter.condition}
                onChange={(e) => handleInputChange(index + 1, e)}
              >
                <option value="">Select Condition</option>
                <option value=">">&gt;</option>
                <option value="<">&lt;</option>
                <option value="=">=</option>
                <option value="!=">!=</option>
              </select>
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Value"
                name="value"
                value={filter.value}
                onChange={(e) => handleInputChange(index + 1, e)}
                onKeyDown={handleKeyPress}
                onBlur={(e) => handleBlur(index + 1, e)}
              />
            </div>
            <div className="conditionbutton">
              <button
                type="button"
                className="btn btn-danger"
                // style={{ width: "38px", textAlign:"center" }}
                onClick={() => handleRemoveFilter(index + 1)}
                style={{ height: "34px" }}
              >
                <i className="bi bi-trash"></i>
              </button>
              {index === filterConditions.length - 2 ? (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleSearchClick}
                  style={{ width: "85px", height: "34px" }}
                >
                  Execute
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
      {!dividendValidate && (
        <div className="error-message">{dividendValidateMessage}</div>
      )}
      {!prePriceValidate && (
        <div className="error-message">{prePriceValidateMessage}</div>
      )}
      {!marketCapValidate && (
        <div className="error-message">{marketCapValidateMessage}</div>
      )}
      {!divRateValidate && (
        <div className="error-message">{divRateValidateMessage}</div>
      )}
      {!lastThirtyValidate && (
        <div className="error-message">{lastThirtyValidateMessage}</div>
      )}
      {!lastNinetyValidate && (
        <div className="error-message">{lastNinetyValidateMessage}</div>
      )}
      {!lastYearValidate && (
        <div className="error-message">{lastYearValidateMessage}</div>
      )}
      <DeleteConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onDelete={handleReset}
      />
    </div>
  );
};

export default Filters;
