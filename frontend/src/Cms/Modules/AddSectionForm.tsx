import { FormEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Flex, TextInput, Divider } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

type Props = {
  getPageInfo: Function;
};

const App = ({ getPageInfo }: Props) => {
  const { slug } = useParams();
  const csrftoken: string | undefined = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://127.0.0.1:8002/api/ping/").then((response) => {
      if (response.status === 200) {
        console.log("ping");
      }
    });
  }, []);

  const createSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    const target = event.target as typeof event.target & {
      elements: {
        sectionname: { value: string };
      };
    };
    // axios.defaults.headers.common["Conteknt-Type"] = "application/json";
    const sectionname = target.elements.sectionname.value;
    const sectionObject = JSON.stringify({
      name: sectionname,
      columns: {
        1: {
          components: {},
        },
      },
    });
    const data = new FormData();
    data.append("object_to_add", sectionObject);
    if (csrftoken !== undefined) {
      data.append("csrfmiddlewaretoken", csrftoken);
    }

    axios
      .post(
        `http://127.0.0.1:8002/api/page/${slug}/section/create/${sectionname}/`,
        data,
      )
      .then((response) => {
        if (response.status === 200) {
          getPageInfo();
        }
      });
  };

  return (
    <form onSubmit={(event) => createSection(event)}>
      <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
      <Divider
        label="New Section"
        labelPosition="center"
        color="black"
        my="sm"
      />
      <Flex direction="row" wrap="wrap" align="end" gap="sm">
        <TextInput
          placeholder="Section Name..."
          id="sectionname"
          name="sectionname"
          required
          style={{
            flexGrow: "1",
          }}
        />
        <Button type="submit">Add New Section</Button>
      </Flex>
    </form>
  );
};

export default App;
