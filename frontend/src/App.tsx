import AddPlanet from "./AddPlanet.tsx";
import ReactDOM from "react-dom";
import React from "react";

function App() {
  return (
    <div>
      <h1>Hello Vite App</h1>
      <AddPlanet />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('app'));