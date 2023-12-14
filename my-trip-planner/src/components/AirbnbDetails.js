import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const config = require('../config.json');

function AirbnbDetail() {
  const { listingId } = useParams();
  const [airbnb, setAirbnb] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/airbnbs/${listingId}`) 
      .then(response => response.json())
      .then(data => setAirbnb(data))
      .catch(error => console.error('Error fetching Airbnb details:', error));
  }, [listingId]);

  useEffect(() => {
    if (airbnb) {
      fetchRestaurantsNearAirbnb(airbnb);
    }
  }, [airbnb]);

  const fetchRestaurantsNearAirbnb = (listingID, distance) => {
    fetch(`http://${config.server_host}:${config.server_port}/restaurantsNearAirbnb/${listingID}/${distance}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRestaurants(data);
        } else {
          setRestaurants([]);
          console.log('No data available or invalid data format');
        }
      })
      .catch(error => {
        console.error('Error fetching Restaurants near Airbnb:', error);
      });
  };

  if (!airbnb) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">{airbnb.listing_name}</h1>
          <p className="text-xl md:text-2xl font-light">Located in: {airbnb.neighborhood}, {airbnb.city}</p>
        </header>

        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold">Details</h2>
            <p className="text-lg">Type: {airbnb.room_type}</p>
            <p className="text-lg">Price: ${airbnb.price} per night</p>
            <p className="text-lg">Minimum Nights: {airbnb.min_nights}</p>
            <p className="text-lg">Latitude: {airbnb.latitude}</p>
            <p className="text-lg">Longitude: {airbnb.longitude}</p>
            <p className="text-lg">Availability: {airbnb.availability_365 ? 'Available' : 'Not available'} this year</p>
          </div>
        </div>

        <div>
        <section className="restaurants p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Restaurants Near Airbnb</h2>
            <ul>
              {restaurants.map(restaurant => (
                <li key={restaurant.id} className="mb-2 p-2 rounded">
                  {restaurant.title} - {restaurant.category}- {restaurant.rating}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="text-center">
          <Link to="/airbnbs" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300">Back to Airbnbs</Link>
        </div>
      </div>
    </div>
  );
}

export default AirbnbDetail;
