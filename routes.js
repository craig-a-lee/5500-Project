const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /airports/:state
const airports = async function(req, res) {
  const stateVar = req.params.state;
  connection.query(`
  SELECT *
  FROM Airports
  WHERE state LIKE ?`, [stateVar],
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 1: GET /airports/:state
const city = async function(req, res) {
  const stateVar = req.params.state;
  connection.query(`
  SELECT *
  FROM Airports
  WHERE city LIKE ?`, [city],
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 2: GET /airbnbs
const airbnbs = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Airbnb`, 
  
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 2: GET /airbnbsHighPrice
const airbnbsHighPrice = async function(req, res) {
  connection.query(`
  SELECT neighborhood, AVG(price) AS average_price
  FROM Airbnb
  GROUP BY neighborhood
  ORDER BY average_price DESC
  LIMIT 5;
`, 
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Get airbnbs within 10 miles of a given airport
const airbnbsNearAirport = async function(req, res) {
  const airportCode = req.params.airportCode;
  connection.query(`
  WITH relevantAirport AS(
    SELECT iata, latitude, longitude
    FROM Airports
    WHERE Iata = ?),
  nearbyAirbnbs AS (
    SELECT *
    FROM Airbnb
    WHERE (ABS(latitude - (SELECT latitude FROM relevantAirport)) < 2)
      AND (ABS(longitude - (SELECT longitude FROM relevantAirport)) < 2)
  ),
  distances AS(
      SELECT *, (
          3958.8 * 2 * ASIN(SQRT(
             POWER(SIN(RADIANS((SELECT latitude FROM relevantAirport) - nearbyAirbnbs.latitude) / 2), 2) +
             COS(RADIANS(nearbyAirbnbs.latitude)) * COS(RADIANS((SELECT latitude FROM relevantAirport))) *
             POWER(SIN(RADIANS((SELECT longitude FROM relevantAirport) - nearbyAirbnbs.longitude) / 2), 2)
         ))
      ) AS distance
      FROM nearbyAirbnbs
      )
  SELECT listing_id, listing_name, host_id, neighborhood, room_type, price, min_nights, city, distance
  FROM distances
  WHERE distance < 10
  ORDER BY distance;`, [airportCode],
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Get airbnbs within 10 miles of a given airport
const restaurantNearAirport = async function(req, res) {
  const airportCode = req.params.airportCode;
  connection.query(`
  WITH relevantAirport AS(
    SELECT iata, latitude, longitude
    FROM Airports
    WHERE iata = ?),
  nearbyRestaurants AS (
    SELECT *
    FROM Restaurant
    WHERE (ABS(latitude - (SELECT latitude FROM relevantAirport)) < 2)
      AND (ABS(longitude - (SELECT longitude FROM relevantAirport)) < 2)
  ),
  distances AS(
      SELECT *, (
          3958.8 * 2 * ASIN(SQRT(
             POWER(SIN(RADIANS((SELECT latitude FROM relevantAirport) - nearbyRestaurants.latitude) / 2), 2) +
             COS(RADIANS(nearbyRestaurants.latitude)) * COS(RADIANS((SELECT latitude FROM relevantAirport))) *
             POWER(SIN(RADIANS((SELECT longitude FROM relevantAirport) - nearbyRestaurants.longitude) / 2), 2)
         ))
      ) AS distance
      FROM nearbyRestaurants
      )
  SELECT title, address, category, rating, website, phone, distance
  FROM distances
  WHERE distance < 10
  ORDER BY distance;`, [airportCode],
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// find restaurants within 10 miles of given airbnb
const restaurantsNearAirbnb = async function(req, res) {
  const listingID = req.params.listingID;
  connection.query(`
  WITH relevantAirbnb AS(
    SELECT listing_id, listing_name, latitude, longitude
    FROM Airbnb
    WHERE listing_id = ?),
  nearbyRestaurants AS (
    SELECT *
    FROM Restaurant
    WHERE (ABS(latitude - (SELECT latitude FROM relevantAirbnb)) < 2)
      AND (ABS(longitude - (SELECT longitude FROM relevantAirbnb)) < 2)
  ),
  distances AS(
      SELECT *, (
          3958.8 * 2 * ASIN(SQRT(
             POWER(SIN(RADIANS((SELECT latitude FROM relevantAirbnb) - nearbyRestaurants.latitude) / 2), 2) +
             COS(RADIANS(nearbyRestaurants.latitude)) * COS(RADIANS((SELECT latitude FROM relevantAirbnb))) *
             POWER(SIN(RADIANS((SELECT longitude FROM relevantAirbnb) - nearbyRestaurants.longitude) / 2), 2)
         ))
      ) AS distance
      FROM nearbyRestaurants
      )
  SELECT title, address, category, rating, website, phone, distance
  FROM distances
  WHERE distance < 10
  ORDER BY distance;`, [listingID],
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


// Route 3: GET /restaurant
const restaurants = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Restaurant`, 
  
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}






module.exports = {
  airports,
  airbnbs,
  restaurants,
  airbnbsHighPrice,
  airbnbsNearAirport,
  restaurantNearAirport,
  restaurantsNearAirbnb
}
