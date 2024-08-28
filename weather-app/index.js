const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const getWeatherData = async (city) => {
    const apiKey = process.env.WEATHERSTACK_API_KEY;
    const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        throw new Error("Unable to fetch weather data.");
    }
};

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: "Please provide a city name." });
    }

    try {
        const weatherData = await getWeatherData(city);

        if (weatherData.success === false) {
            return res.status(404).json({ error: "City not found." });
        }

        const { location, current } = weatherData;
        return res.json({
            location: location.name,
            temperature: current.temperature,
            weather_descriptions: current.weather_descriptions,
            humidity: current.humidity,
            wind_speed: current.wind_speed,
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching weather data." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
