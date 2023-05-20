import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";
import Navigation from "./Navigation";
import { Notification, Container } from "@mantine/core";
import Cookies from "js-cookie";

const Layout = () => {
  const navigate = useNavigate();
  const { isLoggedIn, csrftoken } = useIsAuthenticated();
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [notificationText, setNotificationText] = useState<string>("");
  useEffect(() => {
    if (isLoggedIn === undefined) return;
    if (!isLoggedIn) {
      navigate("/login/");
    }
  }, [isLoggedIn, navigate]);
  console.log("layout", Cookies.get());

  return (
    <div>
      <Navigation />
      {notificationOpen && (
        <Container size="xs">
          <Notification
            title={notificationText}
            onClose={() => setNotificationOpen(false)}
          />
        </Container>
      )}
      <Outlet
        context={{
          isLoggedIn: isLoggedIn,
          csrftoken: csrftoken,
          setNotificationOpen: setNotificationOpen,
          setNotificationText: setNotificationText,
        }}
      />
    </div>
  );
};
export default Layout;
