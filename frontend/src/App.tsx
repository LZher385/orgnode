import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import { HomePage, ListPage, NodePage } from "./pages";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lists" element={<ListPage />} />
        <Route path="/node/:id" element={<NodePage />} />
      </Routes>
    </div>
  );
}

export default App;
