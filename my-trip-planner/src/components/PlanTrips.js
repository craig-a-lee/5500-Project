import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

const config = require('../config.json');

function PlanTrips() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedAirport, setSelectedAirport] = useState('');
  const [airports, setAirports] = useState([]);
  const [airbnbs, setAirbnbs] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [states, setStates] = useState([]);

  const [airbnbPage, setAirbnbPage] = useState(1);
  const [restaurantPage, setRestaurantPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    fetchStates();
    if (selectedState) {
      fetchAirportsByState(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedAirport) {
      fetchAirbnbsNearAirport(selectedAirport, airbnbPage, itemsPerPage); 
      fetchRestaurantsNearAirport(selectedAirport, restaurantPage, itemsPerPage);
    }
  }, [selectedAirport, airbnbPage, restaurantPage]);

  const fetchAirportsByState = (state) => {
    fetch(`http://${config.server_host}:${config.server_port}/airports/${state}`)
      .then(response => response.json())
      .then(data => setAirports(data))
      .catch(error => console.error('Error fetching airports by state:', error));
  };

  const fetchAirbnbsNearAirport = (airportCode, distance) => {
    setLoading(true); 
    fetch(`http://${config.server_host}:${config.server_port}/airbnbsNearAirport/${airportCode}/${distance}`)
      .then(response => response.json())
      .then(data => {
        setLoading(false); 
        if (Array.isArray(data)) {
          console.log('dataaa');
          setAirbnbs(data);
        } else {
          setAirbnbs([]);
          console.log('no dataaa');
          console.log('No data available or invalid data format');
        }
      })
      .catch(error => {
        setLoading(false); 
        console.error('Error fetching Airbnbs near airport:', error);
      });
  };
  
  const fetchRestaurantsNearAirport = (airportCode, distance) => {
    setLoading(true); 
    console.log('hereee');
    fetch(`http://${config.server_host}:${config.server_port}/restaurantNearAirport/${airportCode}/${distance}`)
      .then(response => response.json())
      .then(data => {
        setLoading(false); 
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          setRestaurants([]);
          console.log('No data available or invalid data format');
        }
      })
      .catch(error => {
        setLoading(false); 
        console.error('Error fetching restaurants near airport:', error);
      });
  };
  

  const fetchStates = () => {
    fetch(`http://${config.server_host}:${config.server_port}/allStates`)
      .then(response => response.json())
      .then(data => setStates(data))
      .catch(error => console.error('Error fetching states:', error));
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const handleAirportSelect = (iata) => {
    setSelectedAirport(iata);
  };

  const handleLoadMoreAirbnbs = () => {
    setAirbnbPage(prevPage => prevPage + 1);
  };

  const handleLoadMoreRestaurants = () => {
    setRestaurantPage(prevPage => prevPage + 1);
  };

  const handleSortChange = (e) => {
    setSortCriteria(e.target.value);
    sortListings(e.target.value);
  };

  const sortListings = (criteria) => {
    if (criteria === 'price') {
      setAirbnbs([...airbnbs].sort((a, b) => a.price - b.price));
      setRestaurants([...restaurants].sort((a, b) => a.price - b.price));
    } else if (criteria === 'rating') {
      setRestaurants([...restaurants].sort((a, b) => b.rating - a.rating));
    }
  };

  if (loading) {
    return <Spinner />; 
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Plan Your Trip</h1>
          <p className="text-xl md:text-2xl font-light">Explore options based on your selected airport</p>
        </header>

        <div className="sorting-controls">
            <label htmlFor="sort" className="block text-lg font-medium">Sort by:</label>
            <select id="sort" value={sortCriteria} onChange={handleSortChange} className="w-full mt-2 p-2 rounded border bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
                <option value="">Select Sort Criteria</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
            </select>
        </div>

        <div className="state-selector mb-6">
          <label htmlFor="state" className="block text-lg font-medium">Select State:</label>
          <select 
            id="state" 
            value={selectedState} 
            onChange={handleStateChange} 
            className="w-full mt-2 p-2 rounded border bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg"
          >
            <option value="">Select a State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="airports p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Airports</h2>
            <ul>
              {airports.map(airport => (
                <li 
                  key={airport.iata} 
                  className="mb-2 p-2 rounded cursor-pointer hover:bg-blue-500 hover:bg-opacity-50 transition duration-300"
                  onClick={() => handleAirportSelect(airport.iata)}
                >
                  {airport.airport} - {airport.iata}
                </li>
              ))}
            </ul>
          </section>

          <section className="airbnbs p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Airbnbs</h2>
            <ul>
              {airbnbs.map(airbnb => (
                <li key={airbnb.listing_id} className="mb-2 p-2 rounded">
                  {airbnb.listing_name} - ${airbnb.price}/night
                </li>
              ))}
            </ul>
            <button onClick={handleLoadMoreAirbnbs} className="mt-4 p-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300">Load More</button>
          </section>

          <section className="restaurants p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Restaurants</h2>
            <ul>
              {restaurants.map(restaurant => (
                <li key={restaurant.id} className="mb-2 p-2 rounded">
                  {restaurant.title} - {restaurant.category}- {restaurant.rating}
                </li>
              ))}
            </ul>
            <button onClick={handleLoadMoreRestaurants} className="mt-4 p-2 bg-blue-500 rounded hover:bg-blue-600 transition duration-300">Load More</button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PlanTrips;
