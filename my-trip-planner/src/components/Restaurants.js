import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const config = require('../config.json');

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [listingsPerPage, setListingsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');

  const fetchRestaurants = useCallback((offset) => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurants?limit=${listingsPerPage}&offset=${offset}&filter=${filter}`)
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurant data:', error));
  }, [listingsPerPage, filter]);

  useEffect(() => {
    const offset = (currentPage - 1) * listingsPerPage;
    fetchRestaurants(offset);
  }, [currentPage, listingsPerPage, filter, fetchRestaurants]);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleListingsPerPageChange = (e) => {
    setListingsPerPage(parseInt(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Explore Local Restaurants</h1>
        <div className="mb-4">
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            className="p-2 rounded-md text-black"
            placeholder="Filter by category..."
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
          {Array.isArray(restaurants) && restaurants.map(restaurant => (
            <div key={restaurant.id} className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4">
              <h2 className="text-xl font-semibold">{restaurant.title}</h2>
              <p>{restaurant.category}</p>
              <p>{`Rating: ${restaurant.rating}`}</p>
              <Link to={`/restaurants/${restaurant.restaurant_id}`} className="text-blue-300 hover:text-blue-500">View Details</Link>
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

export default Restaurants;
