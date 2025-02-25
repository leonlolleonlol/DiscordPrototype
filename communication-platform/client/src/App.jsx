import React, { children, useEffect } from 'react';
// Import routing components from react-router-dom
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Import the page components that correspond to each route
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useUserStore } from './lib/store';
import { clientRequest } from './lib/utils';

const DATA_ROUTE = "profile/data";

// protected app routes that require user authentication before accessing
const AuthRequiredRoute = ({ children }) => {
  const { userData } = useUserStore();
  return userData ? children : <Navigate to="/auth" />;
}

// entry points into the app towards authentication, redirect to chat if already done
const EntryRoute = ({ children }) => {
  const { userData } = useUserStore();
  return userData ? <Navigate to="/chat" /> : children;
}

const App = () => {
  const { userData, setUserData } = useUserStore();

  // re-call to update the user data store if ever it changes
  useEffect(() => {
    // fetch user-data if it exists in a cookie
    const updUserData = async() => {
    clientRequest.get(DATA_ROUTE, {withCredentials: true})
      .then((res) => {
        setUserData(res.data.user);
      })
      .catch((err) => { console.log(err)});
    }

    if (!userData)
      updUserData();

  }, [userData, setUserData]);


  return (
    // Wrap the entire app with BrowserRouter to enable client-side routing
    <BrowserRouter>
      {/* Define all routes within the Routes container */}
      <Routes>
        {/* Route for '/auth' path, renders the Auth page */}
        <Route 
          path="/auth" 
          element={<EntryRoute><Auth /></EntryRoute>} />

        {/* Route for '/chat' path, renders the Chat page */}
        <Route 
          path="/chat" 
          element={<AuthRequiredRoute><Chat /></AuthRequiredRoute>} />

        {/* Route for '/profile' path, renders the Profile page */}
        <Route 
          path="/profile" 
          element={<AuthRequiredRoute><Profile /></AuthRequiredRoute>} />

        {/* Wildcard route that catches all undefined routes and redirects to '/chat' */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
