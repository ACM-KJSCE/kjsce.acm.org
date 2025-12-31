import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import EventDetails from "./eventsComponent/EventDetails.jsx";
import EventsPage from "./eventsComponent/EventsPage.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="events" element={<EventsPage />}>
        <Route path=":eventName" element={<EventDetails />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
