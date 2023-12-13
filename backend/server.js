const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

// Route 1: GET /airports/:state
app.get('/airports/:state', routes.airports);

// Route 2: GET /airportsCity/:city
app.get('/airportsCity/:city', routes.airportsCity);

// Route 2: GET /airports
app.get('/airports', routes.getAllAirports);

// Route 3: GET /airbnbs
app.get('/airbnbs', routes.airbnbs);

// Route 4: GET /airbnbsHighPrice
app.get('/airbnbsHighPrice', routes.airbnbsHighPrice);

// Route 5: GET /airbnbsNearAirport/:airportCode/:distance
app.get('/airbnbsNearAirport/:airportCode/:distance', routes.airbnbsNearAirport);

// Route 6: GET /restaurantNearAirport/:airportCode/:distance
app.get('/restaurantNearAirport/:airportCode/:distance', routes.restaurantNearAirport);

// Route 7: GET /restaurantsNearAirbnb/:listingID/:distance
app.get('/restaurantsNearAirbnb/:listingID/:distance', routes.restaurantsNearAirbnb);

// Route 8: GET /restaurants
app.get('/restaurants', routes.restaurants);

// Route 9: GET /RestaurantAffordableAirbnbAirport/:latitude/:longitude
app.get('/RestaurantAffordableAirbnbAirport/:latitude/:longitude', routes.RestaurantAffordableAirbnbAirport);

// Route 10: GET /AirbnbsRestaurantCategory/:category
app.get('/AirbnbsRestaurantCategory/:category', routes.AirbnbsRestaurantCategory);

// Route 11: GET /allStates
app.get('/allStates', routes.getAllStates);

// Route 12: GET /cities/:state
app.get('/cities/:state', routes.getCitiesByState);

// Route: GET /restaurants/:restaurantId
app.get('/restaurants/:restaurantId', routes.getRestaurantDetail);

// Route: GET /airports/:iata
app.get('/airportByIATA/:iata', routes.getAirportByIATA);



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
