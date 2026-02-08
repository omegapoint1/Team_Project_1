import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

function FixLeafletResize() {
  const map = useMap();

  useEffect(() => {
    // Let layout finish, then force Leaflet to recalc dimensions (was having serious problems with map being too big)
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => clearTimeout(t);
  }, [map]);

  return null;
}

function MapBackground() {
  return (
    <MapContainer
      className="leafletMap"
      center={[50.7, -3.5]}
      zoom={13}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <FixLeafletResize />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
    </MapContainer>
  );
}

export default MapBackground;
