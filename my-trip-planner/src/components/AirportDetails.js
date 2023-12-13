import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const config = require('../config.json');

function AirportDetails() {
  const { iata } = useParams();
  const [airport, setAirport] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/airportByIATA/${iata}`)
      .then(response => response.json())
      .then(data => setAirport(data))
      .catch(error => console.error('Error fetching airport details:', error));
  }, [iata]);

  if (!airport) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">{airport.airport}</h1>
          <p className="text-xl md:text-2xl font-light">IATA Code: {airport.iata}</p>
        </header>

        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold">Details</h2>
            <p className="text-lg">Location: {airport.city}, {airport.state}</p>
            <p className="text-lg">Country: {airport.country}</p>
            <p className="text-lg">Latitude: {airport.latitude}</p>
            <p className="text-lg">Longitude: {airport.longitude}</p>
          </div>
        </div>

        <div className="text-center">
          <Link to="/airports" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300">Back to Airports</Link>
        </div>
      </div>
    </div>
  );
}

export default AirportDetails;
