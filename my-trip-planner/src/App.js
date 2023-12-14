import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Airbnbs from './components/Airbnbs';
import Home from './components/Home';
import Navbar from './components/Navbar';
import PlanTrips from './components/PlanTrips';
import Restaurants from './components/Restaurants';
import RestaurantDetail from './components/RestaurantDetails';
import Airports from './components/Airports';
import AirportDetails from './components/AirportDetails';
import AirbnbDetail from './components/AirbnbDetails';
import BestNeighborhoods from './components/BestNeighborhoods';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/airbnbs" element={<Airbnbs />} />
        <Route path="/plan-trip" element={<PlanTrips />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:restaurantId" element={<RestaurantDetail />} />
        <Route path="/airports" element={<Airports />} />
        <Route path="/airportByIATA/:iata" element={<AirportDetails />} />
        <Route path="/airbnbs/:listingId" element={<AirbnbDetail />} />
        <Route path="/bestNeighborhoods" element={<BestNeighborhoods />} />
      </Routes>
    </Router>
  );
}

export default App;
