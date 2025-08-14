import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import DarkModeToggle from "./components/ui/DarkModeToggle";
import Routes from "./Routes";
import "./styles/globals.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <NotificationProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Routes />
              <DarkModeToggle />
            </div>
          </NotificationProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
