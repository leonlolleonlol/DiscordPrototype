import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/auth/Auth.jsx";
import Chat from "./pages/chat/Chat.jsx";
import Profile from "./pages/profile/Profile.jsx";
import { useUserStore } from "./lib/store";
import { clientRequest } from "./lib/utils";

const DATA_ROUTE = "profile/data";

// Protected app routes that require user authentication before accessing
const AuthRequiredRoute = ({ children }) => {
  const { userData } = useUserStore();
  return userData ? children : <Navigate to="/auth" />;
};

// Entry point into the app towards authentication, redirect to chat if already done
const EntryRoute = ({ children }) => {
  const { userData } = useUserStore();
  return userData ? <Navigate to="/chat" /> : children;
};

const App = () => {
  const { userData, setUserData } = useUserStore();

  // re-call to update the user data store if ever it changes
  useEffect(() => {
    // fetch user-data if it exists in a cookie
    const updUserData = async() => {
      clientRequest.get(DATA_ROUTE, { withCredentials: true })
        .then((res) => {
          setUserData(res.data.user);
        })
        .catch((err) => { console.log(err.message);});
    };

    if (!userData)
      updUserData();

  }, [userData, setUserData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={<EntryRoute><Auth /></EntryRoute>}
        />
        <Route
          path="/chat"
          element={<AuthRequiredRoute><Chat /></AuthRequiredRoute>}
        />
        <Route
          path="/profile"
          element={<AuthRequiredRoute><Profile /></AuthRequiredRoute>}
        />
        <Route
          path="*"
          element={<Navigate to="/auth" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
