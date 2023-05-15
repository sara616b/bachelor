import { useEffect, useState, useReducer } from "react";
import { useNavigate, Outlet, useLoaderData } from "react-router-dom";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";
import Navigation from "./Navigation";
import Cookies from "js-cookie";
import axios from "axios";

const Layout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, csrftoken } = useIsAuthenticated(true);
  console.log(isLoggedIn);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login/");
    }
  }, [isLoggedIn]);
  return (
    <div>
      <Navigation />
      <Outlet />
    </div>
  );
};
export default Layout;
