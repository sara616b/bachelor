import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";
import Navigation from "./Navigation";

const Layout = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useIsAuthenticated(true);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
};
export default Layout;
