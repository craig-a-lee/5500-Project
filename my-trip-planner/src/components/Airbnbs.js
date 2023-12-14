import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const config = require('../config.json'); 

function Airbnbs() {
  const [listings, setListings] = useState([]); 
  const [highPricedListings, setHighPricedListings] = useState([]);
  const [listingsPerPage, setListingsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState(5000);

  const fetchListings = useCallback((offset) => {
    fetch(`http://${config.server_host}:${config.server_port}/airbnbs?limit=${listingsPerPage}&offset=${offset}&filter=${filter}&priceFilter=${maxPrice}`)
      .then(response => response.json())
      .then(data => setListings(data))
      .catch(error => console.error('Error fetching Airbnb data:', error));
  }, [listingsPerPage, filter, maxPrice]); 

  const fetchHighPricedListings = useCallback(() => {
    fetch(`http://${config.server_host}:${config.server_port}/airbnbsHighPrice`)
      .then(response => response.json())
      .then(data => setHighPricedListings(data))
      .catch(error => console.error('Error fetching high-priced Airbnb data:', error));
  }, []);

  useEffect(() => {
    const offset = (currentPage - 1) * listingsPerPage;
    fetchListings(offset); 
    fetchHighPricedListings(); 
  }, [currentPage, listingsPerPage, filter, fetchListings, fetchHighPricedListings]);
  

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  }
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  }

  const handleListingsPerPageChange = (e) => {
    setListingsPerPage(parseInt(e.target.value));
  }

  const handlePriceChange = (e) => {
    setMaxPrice(parseInt(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-6">Explore Airbnb Stays</h1>
        <div className="mb-4">
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            className="p-2 rounded-md text-black"
            placeholder="Filter by neighborhood..."
          />
        </div>
        <div>
          <span>Max Price: {maxPrice} </span>
          <input
            type="range"
            name="max"
            min={0}
            max={5000}
            value={maxPrice}
            onChange={handlePriceChange}
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
          {Array.isArray(listings) && listings.map(listing => (
            <div key={listing.listing_id} className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4">
              <h2 className="text-xl font-semibold">{listing.listing_name}</h2>
              <p>{listing.neighborhood}</p>
              <p>{`$${listing.price} per night`}</p>
              <p>{`Minimum nights: ${listing.min_nights}`}</p>
              <Link to={`/airbnbs/${listing.listing_id}`} className="text-blue-300 hover:text-blue-500">View Details</Link>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <button onClick={prevPage} className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300">Previous</button>
          <button onClick={nextPage} className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300">Next</button>
        </div>
        <h2 className="text-3xl font-bold mt-10 mb-4">High-Priced Airbnb Neighborhoods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {highPricedListings.map(listing => (
            <div key={listing.neighborhood} className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4">
              <h3 className="text-xl font-semibold">{listing.neighborhood}</h3>
              <p>{`Average price: $${listing.average_price}`}</p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default Airbnbs;
