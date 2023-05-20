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
    axios
      .get(`${process.env.REACT_APP_API_HOST}/logout/`, {})
      .then((response) => {
        if (response.status === 200) {
          navigate("/login/");
        }
      });
  };

  return (
    <Button.Group>
      <Flex direction="row" wrap="wrap" px="xl" py="sm" mx="auto">
        <Link to="/">
          <Button variant="default">Home</Button>
        </Link>
        <Link to="/pages/">
          <Button variant="default">Pages</Button>
        </Link>
        <Link to="/users/">
          <Button variant="default">Users</Button>
        </Link>
        <Link to="/images/">
          <Button variant="default">Images</Button>
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
