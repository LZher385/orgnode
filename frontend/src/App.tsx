import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import "react-day-picker/dist/style.css";
import { HomePage, ListPage } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lists" element={<ListPage />} />
      </Routes>
    </div>
  );
}

export default App;
