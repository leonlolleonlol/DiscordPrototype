import React from 'react'
// Import routing components from react-router-dom
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// Import the page components that correspond to each route
import Auth from "./pages/auth"
import Chat from "./pages/chat"
import Profile from "./pages/profile"

const App = () => {
  return (
    // Wrap the entire app with BrowserRouter to enable client-side routing
    <BrowserRouter>
      {/* Define all routes within the Routes container */}
      <Routes>
        {/* Route for '/auth' path, renders the Auth page */}
        <Route path="/auth" element={<Auth />} />

        {/* Route for '/chat' path, renders the Chat page */}
        <Route path="/chat" element={<Chat />} />

        {/* Route for '/profile' path, renders the Profile page */}
        <Route path="/profile" element={<Profile />} />

        {/* Wildcard route that catches all undefined routes and redirects to '/chat' */}
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
