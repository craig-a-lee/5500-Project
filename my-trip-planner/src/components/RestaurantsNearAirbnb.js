import React, { useState, useEffect } from 'react';

const RestaurantsNearAirbnb = ({ listingId, distance }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/restaurantsNearAirbnb/${listingId}/${distance}`)
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching nearby restaurants:', error));
  }, [listingId, distance]);

  return (
    <div className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center">
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Nearby Restaurants</h2>
        <div className="max-h-64 overflow-y-auto">
          <ul className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg">
            {restaurants.length > 0 ? (
              restaurants.map((restaurant, index) => (
                <li key={index} className="px-6 py-2 border-b border-gray-300 w-full">
                  {restaurant.title} ({restaurant.rating}) - <span className="text-gray-300">{restaurant.distance.toFixed(2)} miles away</span>
                </li>
              ))
            ) : (
              <li className="px-6 py-2">No nearby restaurants found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RestaurantsNearAirbnb;
