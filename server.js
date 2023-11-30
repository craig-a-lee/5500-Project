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
app.get('/airports/:state', routes.airports);
app.get('/airbnbsNearAirport/:airportCode', routes.airbnbsNearAirport);
app.get('/airbnbs', routes.airbnbs);
app.get('/restaurants', routes.restaurants);
app.get('/restaurantNearAirport/:airportCode', routes.restaurantNearAirport);
app.get('/restaurantsNearAirbnb/:listingID', routes.restaurantsNearAirbnb);
app.get('/airbnbsHighPrice', routes.airbnbsHighPrice);



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
