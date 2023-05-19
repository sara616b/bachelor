import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const useIsAuthenticated = () => {
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [csrftoken, setCsrftoken] = useState<string>("");
  useEffect(() => {
    axios.get("http://127.0.0.1:8002/csrf/").then((response) => {
      Cookies.set("csrftoken", response.data.csrfToken);
      setCsrftoken(response.data.csrfToken);
    });
    axios.get("http://127.0.0.1:8002/authenticated/").then((response) => {
      setStatus(response.data.result === "authenticated" ? true : false);
    });
  }, []);
  return {
    isLoggedIn: status,
    csrftoken: csrftoken,
  };
};

export default useIsAuthenticated;
