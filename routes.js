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

// Route 2: GET /airports/:city
const city = async function(req, res) {
  const cityName = req.params.state;
  connection.query(`
  SELECT *
  FROM Airports
  WHERE city LIKE ?`, [cityName],
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 3: GET /airbnbs
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

// Route 4: GET /airbnbsHighPrice
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

// Route 5: GET /airbnbsNearAirport/:airportCode/:distance
const airbnbsNearAirport = async function(req, res) {
  const airportCode = req.params.airportCode;
  const distance = req.params.distance;
  connection.query(`
  WITH relevantAirport AS(
    SELECT iata, latitude, longitude
    FROM Airports
    WHERE Iata = ${airportCode}),
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
  WHERE distance < ${distance}
  ORDER BY distance;`,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /restaurantNearAirport/:airportCode/:distance
const restaurantNearAirport = async function(req, res) {
  const airportCode = req.params.airportCode;
  const distance = req.params.distance;
  connection.query(`
  WITH relevantAirport AS(
    SELECT iata, latitude, longitude
    FROM Airports
    WHERE iata = ${airportCode}),
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
  WHERE distance < ${distance}
  ORDER BY distance;`,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 7: GET /restaurantsNearAirbnb/:listingID/:distance
const restaurantsNearAirbnb = async function(req, res) {
  const listingID = req.params.listingID;
  const distance = req.params.distance;
  connection.query(`
  WITH relevantAirbnb AS(
    SELECT listing_id, listing_name, latitude, longitude
    FROM Airbnb
    WHERE listing_id = ${listingID}),
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
  ORDER BY ${distance};`,
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


// Route 8: GET /restaurant
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

// Route 9: GET /RestaurantAffordableAirbnbAirport/:latitude/:longitude
const RestaurantAffordableAirbnbAirport = async function(req, res) {
  const latitude = req.params.latitude;
  const longitude = req.params.longitude;
  const minNights = req.query.minNights ?? 365;
  const roomType = req.query.roomType ?? '%%';
  const restaurantCategory = req.query.restaurantCategory ?? '%%';
  const restaurantRating = req.query.restaurantRating ?? 0;

  connection.query(`
  WITH airbnb_price_stats AS (
    SELECT
        neighborhood,
        AVG(price) AS average_price
    FROM Airbnb
    GROUP BY neighborhood
 ),
 closest_restaurant AS (
    SELECT
        R.title,
        R.latitude,
        R.longitude,
        (
            3959 * 2 * ASIN(SQRT(
                POWER(SIN((RADIANS(R.latitude) - RADIANS((${latitude}))) / 2), 2) +
                COS(RADIANS(R.latitude)) * COS(RADIANS((${latitude}))) *
                POWER(SIN((RADIANS(R.longitude) - RADIANS((${longitude}))) / 2), 2)
            ))
        ) AS distance_to_restaurant
    FROM Restaurant R
    WHERE R.category LIKE '%${restaurantCategory}%'
        AND R.rating > ${restaurantRating}
    ORDER BY distance_to_restaurant
    LIMIT 1
 ),
 closest_airbnb AS (
    SELECT
        A.listing_name,
        A.latitude,
        A.longitude,
        APS.average_price,
        (
            3959 * 2 * ASIN(SQRT(
                POWER(SIN((RADIANS(A.latitude) - RADIANS((${latitude}))) / 2), 2) +
                COS(RADIANS(A.latitude)) * COS(RADIANS((${latitude}))) *
                POWER(SIN((RADIANS(A.longitude) - RADIANS((${longitude}))) / 2), 2)
            ))
        ) AS distance_to_airbnb
    FROM Airbnb A
    INNER JOIN airbnb_price_stats APS ON A.neighborhood = APS.neighborhood
    WHERE A.price < APS.average_price -- Selecting Airbnbs priced below the neighborhood average
        AND A.min_nights < ${minNights}
        AND A.room_type LIKE '%${roomType}%'
    ORDER BY distance_to_airbnb
    LIMIT 1
 ),
 closest_airport AS (
    SELECT
        AP.airport,
        AP.latitude,
        AP.longitude,
        (
            3959 * 2 * ASIN(SQRT(
                POWER(SIN((RADIANS(AP.latitude) - RADIANS((${latitude}))) / 2), 2) +
                COS(RADIANS(AP.latitude)) * COS(RADIANS((${latitude}))) *
                POWER(SIN((RADIANS(AP.longitude) - RADIANS((${longitude}))) / 2), 2)
            ))
        ) AS distance_to_airport
    FROM Airports AP
    ORDER BY distance_to_airport
    LIMIT 1
 )
 SELECT
    CR.title AS restaurant_name,
    CR.distance_to_restaurant,
    CA.listing_name AS airbnb_name,
    CA.distance_to_airbnb,
    CA.average_price AS airbnb_average_price,
    CPA.airport AS closest_airport_name,
    CPA.distance_to_airport,
    3959 * 2 * ASIN(SQRT(
        POWER(SIN((RADIANS(CR.latitude) - RADIANS(CA.latitude)) / 2), 2) +
        COS(RADIANS(CR.latitude)) * COS(RADIANS(CA.latitude)) *
        POWER(SIN((RADIANS(CR.longitude) - RADIANS(CA.longitude)) / 2), 2)
    )) AS distance_restaurant_to_airbnb,
    3959 * 2 * ASIN(SQRT(
        POWER(SIN((RADIANS(CA.latitude) - RADIANS(CPA.latitude)) / 2), 2) +
        COS(RADIANS(CA.latitude)) * COS(RADIANS(CPA.latitude)) *
        POWER(SIN((RADIANS(CA.longitude) - RADIANS(CPA.longitude)) / 2), 2)
    )) AS distance_airbnb_to_airport
 FROM closest_restaurant CR
 CROSS JOIN closest_airbnb CA
 CROSS JOIN closest_airport CPA;`, 
  
  (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 10: GET /AirbnbsRestaurantCategory/:category
const AirbnbsRestaurantCategory = async function(req, res) {
  const category = req.params.category;
  connection.query(`
  WITH TopRatedRestaurant AS (
    SELECT r.restaurant_id, r.title AS restaurant_name, r.rating AS restaurant_rating, r.latitude, r.longitude
    FROM Restaurant r
    WHERE r.category LIKE '%${category}%'
    ORDER BY r.rating DESC
    LIMIT 1
 ),
 NearbyAirbnbs AS (
    SELECT a.listing_id, a.listing_name, a.neighborhood, a.price, a.min_nights, a.city, (
        3959 * 2 * ASIN(SQRT(
            POWER(SIN((RADIANS(a.latitude) - RADIANS((SELECT latitude FROM TopRatedRestaurant))) / 2), 2) +
            COS(RADIANS(a.latitude)) * COS(RADIANS((SELECT latitude FROM TopRatedRestaurant))) *
            POWER(SIN((RADIANS(a.longitude) - RADIANS((SELECT longitude FROM TopRatedRestaurant))) / 2), 2)
        ))
    ) AS distance_to_restaurant
    FROM Airbnb a
    WHERE ABS(a.latitude - (SELECT latitude FROM TopRatedRestaurant)) < 2
      AND ABS(a.longitude - (SELECT longitude FROM TopRatedRestaurant)) < 2
 )
 SELECT
    n.listing_id,
    n.listing_name,
    n.neighborhood,
    n.price,
    n.min_nights,
    n.city,
    n.distance_to_restaurant,
    t.restaurant_name,
    t.restaurant_rating
 FROM NearbyAirbnbs n
 CROSS JOIN TopRatedRestaurant t
 ORDER BY n.distance_to_restaurant
 LIMIT 10;`, 
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
  restaurantsNearAirbnb,
  RestaurantAffordableAirbnbAirport,
  AirbnbsRestaurantCategory,
}
