// src/About.js
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="subcontainer">
        <h1>About StockFilter</h1>
        <p>
          Welcome to <strong>StockFilter</strong>, the ultimate tool for long-term investors looking to make informed decisions based on comprehensive stock analysis. Our platform provides you with the insights and data needed to evaluate stocks for your investment portfolio.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to empower investors with reliable and easy-to-use tools that help them make better investment decisions. We believe that with the right information, anyone can become a successful investor.
        </p>
        <h2>Why Choose StockFilter?</h2>
        <ul>
          <li><strong>Comprehensive Analysis:</strong> We provide detailed financial data and performance metrics for a wide range of stocks.</li>
          <li><strong>Custom Filters:</strong> Our advanced filtering options allow you to narrow down stocks based on various criteria such as dividend yield, market cap, and growth rates.</li>
          <li><strong>User-Friendly Interface:</strong> Our intuitive interface makes it easy to navigate and find the information you need.</li>
          <li><strong>Regular Updates:</strong> We ensure that our data is always up-to-date, giving you the latest insights into stock performance.</li>
        </ul>
        <h2>Filters and Analysis Tools</h2>
        <p>
          StockFilter offers a variety of filtering options to help you analyze stocks based on different parameters:
        </p>
        <ul>
          <li><strong>Dividend Yield:</strong> Find stocks with attractive dividend yields to generate passive income.</li>
          <li><strong>Market Capitalization:</strong> Filter stocks by their market cap to identify companies of different sizes.</li>
          <li><strong>Growth Rates:</strong> Evaluate stocks based on their historical and projected growth rates.</li>
          <li><strong>Volatility:</strong> Analyze stocks based on their price volatility to understand risk levels.</li>
        </ul>
        <p>
          Our platform also includes tools for comparing stocks, visualizing performance trends, and more. Whether you are a seasoned investor or just getting started, StockFilter has everything you need to make well-informed investment decisions.
        </p>
        <p>
          Thank you for choosing StockFilter. We are committed to helping you achieve your investment goals.
        </p>
      </div>
    </div>
  );
};

export default About;
