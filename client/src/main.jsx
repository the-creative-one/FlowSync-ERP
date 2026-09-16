import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import ThemeProvider from "./providers/ThemeProvider";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,

              style: {
                borderRadius: "14px",
                padding: "14px 16px",
                fontSize: "14px",
              },
              success: {
                style: {
                  background: "#16A34A",
                  color: "#ffffff",
                },
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#16A34A",
                },
              },
              error: {
                style: {
                  background: "#DC2626",
                  color: "#ffffff",
                },
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#DC2626",
                },
              },
            }}
          />
          <App />
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
