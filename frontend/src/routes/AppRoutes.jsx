import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/DashBoard.jsx";
import Project from "../pages/Project.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project" element={<Project />} />
            <Route path="/project/:id" element={<Project />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
