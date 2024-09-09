import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CitiesTable from "./components/CitiesTable";
import CityWeather from "./components/CityWeather";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/city/:cityName" element={<CityWeather />} />
      </Routes>
    </Router>
  );
}

export default App;
