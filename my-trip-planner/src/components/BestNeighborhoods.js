import React, { useEffect, useState } from 'react';

const config = require('../config.json');

const BestNeighborhoods = () => {
    const [neighborhoods, setNeighborhoods] = useState([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/bestNeighborhoods`)
            .then(response => response.json())
            .then(data => setNeighborhoods(data))
            .catch(error => console.error('Error fetching best neighborhoods:', error));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col justify-center">
            <div className="max-w-4xl mx-auto p-4 md:p-8">
                <h1 className="text-center text-4xl md:text-6xl font-extrabold tracking-tight mb-8">Top Affordable Neighborhoods</h1>
                <div className="overflow-x-auto bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="text-center bg-blue-500 text-white">
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold uppercase tracking-wider">
                                    Neighborhood
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold uppercase tracking-wider">
                                    Average Price
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 text-xs font-semibold uppercase tracking-wider">
                                    Average Distance to High-Rated Restaurants (miles)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(neighborhoods) && neighborhoods.map((neighborhood, index) => (
                                <tr key={index} className="text-center bg-white border-b border-gray-200">
                                    <td className="px-5 py-5 text-sm text-black">{neighborhood.neighborhood}</td>
                                    <td className="px-5 py-5 text-sm text-black">${neighborhood.AveragePrice.toFixed(2)}</td>
                                    <td className="px-5 py-5 text-sm text-black">{neighborhood.AverageDistanceToRestaurants.toFixed(2)} miles</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BestNeighborhoods;
