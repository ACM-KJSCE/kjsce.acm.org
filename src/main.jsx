import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import './index.css'
import App from './App.jsx'
import EventDetails from './components/EventDetails.jsx';
import EventsPage from './components/EventsPage.jsx';
import EventsSectionPage from './pages/EventsSectionPage.jsx';
import TeamSectionPage from './pages/TeamSectionPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about-us" element={<App />} />
      <Route path="/events" element={<EventsSectionPage />} />
      <Route path="/sponsors" element={<App />} />
      <Route path="/our-team" element={<TeamSectionPage />} />
      <Route path="/contact-us" element={<App />} />
      <Route path="events" element={<EventsPage />}>
        <Route path=":eventName" element={<EventDetails />} />
      </Route>
    </Routes>
  </BrowserRouter>,
)
