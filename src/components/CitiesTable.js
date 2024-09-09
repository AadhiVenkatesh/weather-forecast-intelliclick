import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Select from "react-select";
import debounce from "lodash/debounce";
import "./CitiesTable.css";

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://public.opendatasoft.com/api/records/1.0/search/",
        {
          params: {
            dataset: "geonames-all-cities-with-a-population-1000",
            rows: 10,
            start: (page - 1) * 10, // Calculate the correct start for the current page
            sort: "name",
            q: searchTerm,
          },
        }
      );
      if (page === 1) {
        setCities(response.data.records);
        setFilteredCities(response.data.records);
        setCityOptions(
          response.data.records.map((city) => ({
            value: city.fields.name,
            label: city.fields.name,
          }))
        );
      } else {
        setCities((prevCities) => [...prevCities, ...response.data.records]);
        setFilteredCities((prevCities) => [
          ...prevCities,
          ...response.data.records,
        ]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
    setLoading(false);
  };

  const debouncedSearch = debounce((inputValue) => {
    setSearchTerm(inputValue);
    setPage(1);
    setCities([]);
  }, 300);

  const handleInputChange = (inputValue) => {
    debouncedSearch(inputValue);
  };

  const handleSearchChange = (selectedOption) => {
    if (selectedOption) {
      const filtered = cities.filter(
        (city) => city.fields.name === selectedOption.value
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [page, searchTerm]); // Track changes in page and searchTerm

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.scrollHeight - 50 &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div className="container my-4">
      <h1 className="mb-4 text-center">City List</h1>
      <div className="mb-4">
        <Select
          placeholder="Search for a city..."
          options={cityOptions}
          onChange={handleSearchChange}
          onInputChange={handleInputChange}
          isClearable
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>
      <ul className="list-group">
        {filteredCities.map((city) => (
          <li key={city.recordid} className="list-group-item">
            <Link
              to={`/city/${city.fields.name}`}
              className="text-decoration-none"
            >
              {city.fields.name}
            </Link>
          </li>
        ))}
      </ul>
      {loading && <p className="text-center mt-4">Loading...</p>}
    </div>
  );
};

export default CitiesTable;
