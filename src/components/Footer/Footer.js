// src/Footer.js
import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <p className="mb-1">
          © 2024 StockFilter.net, All Rights Reserved ·{" "}
          <Link to="/privacy-policy">Privacy Policy</Link>
        </p>
        <p className="text-muted">
          All correlation calculations and similarity scores use our proprietary
          logic, which may not reflect all nuances or relations between various
          stocks. None of the information provided constitutes a recommendation
          to buy or sell, a trading strategy, nor should the information be
          taken as any guarantee of a relationship between two stocks either in
          the past, present, or future. All information is provided "as is" and
          the user assumes the entire risk of any use of this information. All
          data is provided for internal use only and may not be reproduced
          without permission from the administrator of StockFilter.net. All
          trademarks and other marks on this site not owned by StockFilter.net
          are the property of their respective owners.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
