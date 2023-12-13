import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-400 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">My Trip Planner</Link>
        </h1>
        <div>
          <Link to="/airbnbs" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Airbnbs</Link>
          <Link to="/restaurants" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Restaurants</Link>
          <Link to="/airports" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Airports</Link>
          <Link to="/plan-trip" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Plan Trip</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
