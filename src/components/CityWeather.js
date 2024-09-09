import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./CityWeather.css";

const CityWeather = () => {
  const { cityName } = useParams();
  const [weather, setWeather] = useState(null);
  const [background, setBackground] = useState("");

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}&units=metric`
      );
      setWeather(response.data);
      setWeatherBackground(response.data.weather[0].main);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  const setWeatherBackground = (condition) => {
    switch (condition.toLowerCase()) {
      case "clear":
        setBackground("sunny.jpg");
        break;
      case "clouds":
        setBackground("cloudy.jpg");
        break;
      case "rain":
        setBackground("rainy.jpg");
        break;
      default:
        setBackground("default.jpg");
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [cityName]);

  return weather ? (
    <div
      className="weather-details"
      style={{ backgroundImage: `url(/images/${background})` }}
    >
      <h2>Weather in {weather.name}</h2>
      <p>Temperature: {weather.main.temp} °C</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} m/s</p>
      <p>Condition: {weather.weather[0].main}</p>
    </div>
  ) : (
    <p>Loading weather details...</p>
  );
};

export default CityWeather;
