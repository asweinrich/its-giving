// MapLibre GL is free — but needs a tile provider for map imagery.
// We use MapTiler (you already have an API key).
export const MAP_DEFAULT_STYLE = `https://api.maptiler.com/maps/019de48b-d997-7b16-a1fb-0406ac2f5262/style.json?key=M3yBnB3aobawvcom6881`;

// General options for all maps
export const MAP_DEFAULT_OPTIONS = {
  zoom: 10,
  minZoom: 1,
  maxZoom: 18,
  pitch: 0,
  bearing: 0,
  markerColor: "#38a169",
  markerPopupBg: "bg-slate-900",
  markerPopupTextColor: "text-green-400",
};