// src/Header.js
import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="headercontainer">
        <div className="header-logo">
          <Link to="/">
            <img
              src="./logo_transparent_w.png"
              style={{ borderRadius: "1px", scale: "1.2" }}
              alt="Stock Analysis Chart for Long-Term Investment"
            />
          </Link>
          {/* <span style={{"color":"white"}}>Beta</span> */}
        </div>
        <nav className="header-nav">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
        </nav>
        {/* <div className="header-search">
          <input type="text" placeholder="Search stocks..." />
          <button type="submit"><i className="fas fa-search"></i></button>
        </div> */}
      </div>
    </header>
  );
};

export default Header;
