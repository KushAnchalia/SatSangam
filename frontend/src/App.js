import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import LumaStyleEventCreator from "./pages/LumaStyleEventCreator";
import EventCreationPayment from "./pages/EventCreationPayment";
import HostDashboard from "./pages/HostDashboard";
import AdvancedHostDashboard from "./pages/AdvancedHostDashboard";
import MyRegistrations from "./pages/MyRegistrations";
import AuthPage from "./pages/AuthPage";
import PaymentSuccess from "./pages/PaymentSuccess";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: API,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
    toast.success("Welcome back!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen lotus-pattern">
      <BrowserRouter>
        <Navigation user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />
          <Route path="/events" element={<EventsPage user={user} />} />
          <Route path="/events/:eventId" element={<EventDetailPage user={user} />} />
          <Route
            path="/auth"
            element={
              user ? <Navigate to="/" /> : <AuthPage onLogin={handleLogin} />
            }
          />
          <Route
            path="/create-event"
            element={
              user ? (
                <EventCreationPayment />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/create-event-form"
            element={
              user ? (
                <LumaStyleEventCreator user={user} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/edit-event/:eventId"
            element={
              user ? (
                <LumaStyleEventCreator user={user} isEdit />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <AdvancedHostDashboard user={user} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/my-events"
            element={
              user ? <MyRegistrations user={user} /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/payment/success"
            element={
              user ? <PaymentSuccess user={user} /> : <Navigate to="/auth" />
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
