import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const useIsAuthenticated = (initial: boolean | (() => boolean) = false) => {
  const [status, setStatus] = useState<boolean>(initial);
  axios.get("http://127.0.0.1:8002/authenticated/").then((response) => {
    setStatus(response.status === 200 ? true : false);
  });
  return {
    isLoggedIn: status,
    csrftoken: Cookies.get("csrftoken") || "",
  };
};

export default useIsAuthenticated;
