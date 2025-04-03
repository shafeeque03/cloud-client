import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

// Import components
import ProtectedRoute from "./route-protect/ProtectedRoute";
import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import Folder from "./pages/Folder";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          {/* Custom toast configuration */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#363636",
                color: "#fff",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
              success: {
                duration: 3000,
                style: {
                  background: "#10B981",
                  color: "#fff",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#10B981",
                },
              },
              error: {
                duration: 3000,
                style: {
                  background: "#EF4444",
                  color: "#fff",
                },
                iconTheme: {
                  primary: "#fff",
                  secondary: "#EF4444",
                },
              },
              // Enable close button for all toasts
              className: "",
              close: true,
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              {/* Add more protected routes here */}
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/folder/:folderId" element={<Folder />} />
            </Route>

            {/* 404 and redirects */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
