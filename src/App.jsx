import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Map from "./components/Map";
function App() {
  return (
    <div>
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
        Shinjuku City API Map
      </p>
      <Map />
    </div>
  );
}

export default App;
