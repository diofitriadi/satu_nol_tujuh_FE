import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Polygon } from "@react-google-maps/api";
import useFetch from "../hooks/useFetch";

const apiKey = import.meta.env.VITE_API_KEY;
const mapKey = import.meta.env.VITE_MAPS_API;

const containerStyle = {
  width: "80%",
  height: "500px",
  margin: "auto",
};

function Map() {
  const [center] = useState({
    lat: 35.70099999999,
    lng: 139.71199999999,
  });
  const [polygons, setPolygons] = useState([]);
  const [prevSelectedPolygons, setPrevSelectedPolygons] = useState([]);

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
          body: JSON.stringify({ lat: center.lat, lng: center.lng }),
        }
      );
      const data = await response.json();
      const allLatLng = data?.value?.features?.map((value) => {
        const data = value.geometry?.coordinates[0];
        return data;
      });
      setPolygons(allLatLng);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [center]);

  const handleClick = (polygon) => {
    const index = prevSelectedPolygons.findIndex((p) => p[0] === polygon[0]);

    if (index === -1) {
      // Set polygon as selected if it is not in the list of previously selected polygons
      setPrevSelectedPolygons([...prevSelectedPolygons, polygon]);
    } else {
      // Deselect the polygon if it is already selected
      setPrevSelectedPolygons(
        prevSelectedPolygons.filter((p) => p[0] !== polygon[0])
      );
    }
  };
  return (
    <div className="flex justify-center">
      <LoadScript googleMapsApiKey={mapKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {polygons?.map((polygon, index) => {
            const isSelected = prevSelectedPolygons.some(
              (p) => p[0] === polygon[0]
            );
            // console.log(isSelected);

            const path = polygon[0].map((point) => ({
              lat: point[1],
              lng: point[0],
            }));

            return (
              <Polygon
                key={index}
                path={path}
                onClick={() => handleClick(polygon)}
                options={{
                  fillColor: isSelected ? "red" : "#87CEEB",
                  fillOpacity: 0.3,
                  strokeColor: "blue",
                  strokeOpacity: 0.2,
                  strokeWeight: 1,
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Map;
