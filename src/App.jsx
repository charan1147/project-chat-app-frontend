import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import { ContactProvider } from "./context/ContactContext";
import { CallProvider } from "./context/CallContext";

import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ContactsPage from "./pages/ContactsPage";
import CallScreen from "./components/CallScreen";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

 function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ContactProvider>
          <CallProvider>
            <Router>
              <Navbar />
              <div className="container py-4">
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
                        <CallScreen />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </Router>
          </CallProvider>
        </ContactProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App