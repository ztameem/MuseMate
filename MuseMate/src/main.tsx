import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import Notebook from "./components/Notebook";
import AboutUs from "./components/AboutUs";
import Navbar from "./components/Navbar";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/notebook" element={<Notebook />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/sign-in" element={<h1>Sign In Page</h1>} />
        </Routes>
      </Router>
    </ClerkProvider>
  </React.StrictMode>
);
