import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const useIsAuthenticated = () => {
  const [status, setStatus] = useState<boolean | undefined>(undefined);
  const [csrftoken, setCsrftoken] = useState<string>("");
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_HOST + "/csrf/").then((response) => {
      console.log(response);
      console.log("get csrf");
      Cookies.set("csrftoken", response.data.csrfToken);
      setCsrftoken(response.data.csrfToken);
      console.log("csrftoken get", csrftoken);
      console.log("csrftok", Cookies.get("csrftoken"));
    });
    axios
      .get(process.env.REACT_APP_API_HOST + "/authenticated/")
      .then((response) => {
        console.log(response);
        console.log("get authenticated");
        setStatus(response.data.result === "authenticated" ? true : false);
        console.log("csrftoken auth", csrftoken);
      });
  }, [status]);
  console.log("csrftoken", csrftoken);
  return {
    isLoggedIn: status,
    csrftoken: csrftoken,
  };
};

export default useIsAuthenticated;
