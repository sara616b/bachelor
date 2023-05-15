import { Button, Flex } from "@mantine/core";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const LogOut = () => {
    const csrftoken = Cookies.get("csrftoken");
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.get(`http://127.0.0.1:8002/logout/`, {}).then((response) => {
      if (response.status === 200) {
        navigate("/login/");
      } else {
        console.log(response);
      }
      return response;
    });
  };

  return (
    <Button.Group>
      <Flex direction="row" wrap="wrap" px="xl" py="sm" mx="auto">
        <Link to="/">
          <Button variant="default">Home</Button>
        </Link>
        <Link to="/pages/create/">
          <Button variant="default">Create New Page</Button>
        </Link>
        <Link to="/pages/">
          <Button variant="default">Pages</Button>
        </Link>
        <Link to="/users/">
          <Button variant="default">Users</Button>
        </Link>
        <Button
          variant="default"
          component="a"
          rel="noopener noreferrer"
          onClick={() => LogOut()}
        >
          Log Out
        </Button>
      </Flex>
    </Button.Group>
  );
};

export default App;
