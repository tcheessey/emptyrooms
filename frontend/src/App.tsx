import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./utils/AuthProvider";
import Pages from "./routes/Pages";

const App = () => {
  useEffect(() => {
    const setUnits = () => {
      const vh = window.innerHeight * 0.01;
      const tileSize = Math.max(24, Math.min(50, window.innerWidth / 20));
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      document.documentElement.style.setProperty("--tiun", `${tileSize}px`);
    };

    setUnits();
    window.addEventListener("resize", setUnits);
    return () => window.removeEventListener("resize", setUnits);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Pages />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
