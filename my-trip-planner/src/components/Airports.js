import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const config = require('../config.json');

function Airports() {
    const [airports, setAirports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listingsPerPage, setListingsPerPage] = useState(9);
  const [searchState, setSearchState] = useState(''); 
  const [searchName, setSearchName] = useState('');
  const [searchIata, setSearchIata] = useState('');

  const fetchAirports = useCallback((offset) => {
    let query = `limit=${listingsPerPage}&offset=${offset}`;
    if (searchState) query += `&state=${searchState}`;
    if (searchName) query += `&name=${searchName}`;
    if (searchIata) query += `&iata=${searchIata}`;

    fetch(`http://${config.server_host}:${config.server_port}/airports?${query}`)
      .then(response => response.json())
      .then(data => setAirports(data))
      .catch(error => console.error('Error fetching airport data:', error));
  }, [listingsPerPage, searchState, searchName, searchIata]);

  useEffect(() => {
    const offset = (currentPage - 1) * listingsPerPage;
    fetchAirports(offset);
  }, [currentPage, listingsPerPage, searchState, searchName, searchIata, fetchAirports]);

  const handleNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleIataChange = (e) => {
    setSearchIata(e.target.value);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStateChange = (e) => {
    setSearchState(e.target.value);
  };

  const handleListingsPerPageChange = (e) => {
    setListingsPerPage(parseInt(e.target.value));
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Explore Airports</h1>
        <div className="mb-4">
          <input
            type="text"
            value={searchState}
            onChange={handleStateChange}
            placeholder="Enter State..."
            className="p-2 rounded-md text-black mr-2"
          />
          <input
            type="text"
            value={searchName}
            onChange={handleNameChange}
            placeholder="Enter Airport Name..."
            className="p-2 rounded-md text-black mr-2"
          />
          <input
            type="text"
            value={searchIata}
            onChange={handleIataChange}
            placeholder="Enter IATA Code..."
            className="p-2 rounded-md text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="listingsPerPage" className="mr-2">Listings per page:</label>
          <select
            id="listingsPerPage"
            value={listingsPerPage}
            onChange={handleListingsPerPageChange}
            className="p-2 rounded-md bg-white text-black"
          >
            <option value="3">3</option>
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.isArray(airports) && airports.map(airport => (
                <div key={airport.id} className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4">
                <h2 className="text-xl font-semibold">{airport.airport}</h2> 
                <p>State: {airport.state}</p> 
                <p>{`IATA: ${airport.iata}`}</p> 
                <Link to={`/airportByIATA/${airport.iata}`} className="text-blue-300 hover:text-blue-500">View Details</Link> {/* Check if this is correct */}
                </div>
            ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <button onClick={prevPage} className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300">Previous</button>
          <button onClick={nextPage} className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300">Next</button>
        </div>
      </div>
    </div>
  );
}

export default Airports;
