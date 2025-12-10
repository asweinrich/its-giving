import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { MAP_DEFAULT_STYLE, MAP_DEFAULT_OPTIONS } from "@/config/mapStyle";

interface ImpactMapProps { address: string; }

const ImpactMap = ({ address }: ImpactMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: maplibregl.Map | null = null;
    let marker: maplibregl.Marker | null = null;
    let popup: maplibregl.Popup | null = null;

    async function fetchCoordinates(location: string): Promise<{ lat: number; lng: number }> {
      const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY; // Use env var for prod safety!
      const resp = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
      const data = await resp.json();
      if (data.results?.length) {
        return data.results[0].geometry;
      }
      throw new Error("Location not found");
    }

    if (address && mapContainer.current) {
      fetchCoordinates(address).then(({ lat, lng }) => {
        map = new maplibregl.Map({
          container: mapContainer.current!,
          style: MAP_DEFAULT_STYLE,
          center: [lng, lat],
          ...MAP_DEFAULT_OPTIONS,
        });

        // Custom marker element for color etc.
        const markerEl = document.createElement("div");
        markerEl.style.background = MAP_DEFAULT_OPTIONS.markerColor;
        markerEl.style.width = "18px";
        markerEl.style.height = "18px";
        markerEl.style.borderRadius = "50%";
        markerEl.style.border = "2px solid #FFF";
        markerEl.style.boxShadow = "0 0 8px #333";

        marker = new maplibregl.Marker(markerEl)
          .setLngLat([lng, lat])
          .addTo(map);

        // Custom popup styles
        popup = new maplibregl.Popup({ offset: 20 })
          .setDOMContent(
            (() => {
              const popupDiv = document.createElement("div");
              popupDiv.className = `${MAP_DEFAULT_OPTIONS.markerPopupBg} ${MAP_DEFAULT_OPTIONS.markerPopupTextColor} p-2 rounded-lg`;
              popupDiv.innerHTML = `<strong>Org HQ</strong><br>${address}`;
              return popupDiv;
            })()
          );
        marker.setPopup(popup);
        marker.togglePopup();
      }).catch(console.error);
    }

    return () => {
      if (map) map.remove();
    };
  }, [address]);

  return <div ref={mapContainer} style={{
    height: "300px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 0 16px #222",
    marginTop: "12px",
  }} />;
};

export default ImpactMap;