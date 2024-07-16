// src/App.js

import React, { useEffect } from "react";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import { StockPage } from "./components/StockPage/StockPage";
import StockChart from "./pages/StockChart/StockChart";
import Footer from "./components/Footer/Footer";
import PrivacyPolicy from "./components/Privacy/Privacy";
import Header from "./components/Header/Header";
import About from "./components/About/About";
import "./App.css";

function App() {

  return (
    <HashRouter>
      <div className="App">
        <Header></Header>
        <Routes>
          <Route path="/index.html" element={<StockPage />} />
          <Route path="/" element={<StockPage />} />
          <Route path="/stock/:symbol/:direct" element={<StockChart />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About></About>} />
        </Routes>
        <Footer></Footer>
      </div>
    </HashRouter>
  );
}

export default App;
