import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";
import Navigation from "./Navigation";

const Layout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, csrftoken } = useIsAuthenticated();
  console.log(isLoggedIn);
  useEffect(() => {
    if (isLoggedIn === undefined) return;
    if (!isLoggedIn) {
      navigate("/login/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <Navigation />
      <Outlet context={{ isLoggedIn: isLoggedIn, csrftoken: csrftoken }} />
    </div>
  );
};
export default Layout;
