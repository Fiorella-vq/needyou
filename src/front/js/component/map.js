import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%"
};

export const Map = ({ workers = [] }) => {
  const [center, setCenter] = useState({
    lat: -34.9011, // Montevideo default
    lng: -56.1645
  });

  const [zoom, setZoom] = useState(12);

  // 📍 obtener ubicación usuario
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocalización no soportada");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setZoom(13);
      },
      (error) => {
        console.log("Error ubicación:", error.message);
      }
    );
  }, []);

  return (
    <div className="map-container">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
        >
          {/* 📍 tu ubicación */}
          <Marker
            position={center}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />

          {/* 🛠️ workers */}
          {workers.length > 0 &&
            workers.map((w) =>
              w.lat && w.lng ? (
                <Marker
                  key={w.id}
                  position={{
                    lat: Number(w.lat),
                    lng: Number(w.lng)
                  }}
                />
              ) : null
            )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};