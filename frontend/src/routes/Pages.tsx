import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { AuthContext } from "../utils/AuthProvider";
import Home from "./Home";
import Welcome from "./Welcome";
import Me from "./Me";

export default function Pages() {
  const { isCheckingAuth, isLoggedIn } = useContext(AuthContext);

  if (isCheckingAuth) {
    return <Spinner />;
  }

  return (
    <Routes>
      <Route
        path='/welcome'
        element={isLoggedIn ? <Navigate to='/' replace /> : <Welcome />}
      />
      <Route
        path='/'
        element={isLoggedIn ? <Home /> : <Navigate to='/welcome' replace />}
      />
      <Route
        path='/me'
        element={isLoggedIn ? <Me /> : <Navigate to='/welcome' replace />}
      />
    </Routes>
  );
}
