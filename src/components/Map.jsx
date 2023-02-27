import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Polygon,
} from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_API_KEY;
const mapKey = import.meta.env.VITE_MAPS_API;

const containerStyle = {
  width: "800px",
  height: "600px",
};

function Map() {
  const [center, setCenter] = useState({
    lat: 35.72123671702373,
    lng: 139.7315125062222,
  });
  const [polygons, setPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!center) return;
      try {
        const response = await fetch(
          "https://ato-auto-estimate.107.jp/api/v1/trial",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              lat: center.lat,
              lng: center.lng,
            }),
          }
        );
        const data = await response.json();
        const allLatLng = data?.value?.features?.map((value) => {
          const data = value.geometry?.coordinates[0];
          return data;
        });
        console.log(allLatLng, "wihuyyy");
        // console.log(coordinates);
        // console.log(data.value.features);
        setPolygons(allLatLng);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [center]);

  const handleClick = (polygon) => {
    console.log("Polygon clicked:", polygon);
    setSelectedPolygon(polygon);
  };

  console.log("Polygon clicked value:", selectedPolygon);

  const handleMapClick = (event) => {
    const newCenter = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setCenter(newCenter);
  };

  console.log(polygons, "CEK");
  console.log(selectedPolygon, "wew");

  return (
    <LoadScript googleMapsApiKey={`${mapKey}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={handleMapClick}
      >
        {polygons?.map((polygon, index) => (
          <Polygon
            key={index}
            path={polygon[0].map((point) => ({ lat: point[1], lng: point[0] }))}
            onClick={() => handleClick(polygon)}
            options={{
              fillColor:
                selectedPolygon && selectedPolygon[0] === polygon[0]
                  ? "red"
                  : "blue",
              fillOpacity: 0.2,
              strokeColor: "blue",
              strokeOpacity: 0.4,
              strokeWeight: 1,
            }}
          >
            {selectedPolygon && selectedPolygon[0] === polygon[0] && (
              <InfoWindow
                position={{ lat: polygon[0], lng: polygon[1] }}
                onCloseClick={() => setSelectedPolygon(null)}
              >
                <div>
                  <h2>NAMA : {polygon[0]}</h2>
                  <p>Deskripsi : {polygon[1]}</p>
                </div>
              </InfoWindow>
            )}
          </Polygon>
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;
