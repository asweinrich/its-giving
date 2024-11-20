"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

const ImpactMap = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current, // Reference to the map's container
      style: "https://demotiles.maplibre.org/style.json", // Open-source MapLibre tiles
      center: [-122.4194, 37.7749], // San Francisco
      zoom: 5,
    });

    // Add a marker
    new maplibregl.Marker()
      .setLngLat([-122.4194, 37.7749])
      .setPopup(new maplibregl.Popup().setHTML("<h3>San Francisco</h3>"))
      .addTo(map);

    return () => map.remove(); // Cleanup map instance on unmount
  }, []);

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
