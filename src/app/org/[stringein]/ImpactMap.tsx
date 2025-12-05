"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

interface MapProps {
  city: string;
  state: string;
}

const ImpactMap = ({ city, state }: MapProps) => {
  const mapContainer = useRef(null);

  // Function to fetch coordinates from a geocoding API
  const fetchCoordinates = async (location: string): Promise<{ lat: number; lng: number }> => {
    

    const apiKey = "7e902a24d10142fd9559d0610b57a731"; // Replace with your API key
      
    console.log('api key: ',apiKey)

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry;
      return { lat, lng };
    } else {
      throw new Error("Location not found");
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current, // Reference to the map's container
      style: "https://demotiles.maplibre.org/style.json", // Open-source MapLibre tiles
      center: [-122.4194, 37.7749], // Default to San Francisco
      zoom: 2.5,
    });

    // Dynamically center the map based on city and state
    const location = `${city}, ${state}`;
    fetchCoordinates(location)
      .then(({ lat, lng }) => {
        map.setCenter([lng, lat]);
        map.setZoom(2.5); // Adjust zoom level to focus on the location

        // Add a marker at the new location
        new maplibregl.Marker()
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup().setHTML(`<h3>${location}</h3>`))
          .addTo(map);
      })
      .catch((error) => {
        console.error("Error fetching location coordinates:", error);
      });

    return () => map.remove(); // Cleanup map instance on unmount
  }, [city, state]); // Re-run the effect if city or state changes

  return (
    <div className="my-6">
      <h2 className="text-lg font-semibold text-white mb-2">Service Area</h2>
      <p className="text-xs text-slate-300 mb-4">
        Service Area and Headquarters
      </p>
      <div className="max-w-xl">
        <div className="w-full max-w-xl h-48 md:h-72 rounded-lg" ref={mapContainer} />
      </div>
    </div>
  );
};

export default ImpactMap;
