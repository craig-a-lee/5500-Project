import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center">
    <div className="max-w-4xl mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">Explore the World</h1>
        <p className="text-xl md:text-2xl font-light">Discover your next adventure with personalized trip planning</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div className="p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Find an Airbnb</h2>
            <p className="mb-5">Browse through listings to find the perfect stay for your trip.</p>
            <Link to="/airbnbs" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300">Explore Stays</Link>
        </div>

        <div className="p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Local Restaurants</h2>
            <p className="mb-5">Discover local culinary delights to make your trip unforgettable.</p>
            <Link to="/restaurants" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300">Find Eats</Link>
        </div>

        <div className="p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Airport Info</h2>
            <p className="mb-5">Get all the information you need about airports on your route.</p>
            <Link to="/airports" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300">Airport Details</Link>
        </div>

        <div className="p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-3">Plan Your Route</h2>
            <p className="mb-5">Effortlessly plan the route for your upcoming journey.</p>
            <Link to="/plan-trip" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-100 transition duration-300">Map It Out</Link>
        </div>
        </div>
    </div>
    </div>
  );
}

export default App;
