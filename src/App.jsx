import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { ContactProvider } from "./context/ContactContext.jsx";
import { CallProvider } from "./context/CallContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";
import CallPage from "./pages/CallPage.jsx";

// Custom hook to get the current pathname
function useCurrentPath() {
  return useLocation().pathname;
}

function PrivateRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const currentPath = useCurrentPath();
  if (isLoading) return <div>Loading authentication, please wait...</div>;
  return user ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: currentPath }} replace />
  );
}

function PublicRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const currentPath = useCurrentPath();
  if (isLoading) return <div>Loading authentication, please wait...</div>;
  if (user) {
    return <Navigate to="/contacts" state={{ from: currentPath }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ContactProvider>
          <CallProvider>
            <Router>
              <Navbar />
              <Routes>
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/contacts"
                  element={
                    <PrivateRoute>
                      <ContactsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/chat/:contactId"
                  element={
                    <PrivateRoute>
                      <Chat />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/call/:contactId"
                  element={
                    <PrivateRoute>
                      <CallPage />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </CallProvider>
        </ContactProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
