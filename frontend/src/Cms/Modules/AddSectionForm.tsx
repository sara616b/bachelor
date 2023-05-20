import { FormEvent } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Button, Flex, TextInput, Divider } from "@mantine/core";
import axios from "axios";
import { AuthenticationProps } from "../../Utils/Foundation/Types";

type Props = {
  getPageInfo: Function;
};

const App = ({ getPageInfo }: Props) => {
  const { slug } = useParams();
  const { csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();

  const createSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      elements: {
        sectionname: { value: string };
      };
    };
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
    data.append("csrfmiddlewaretoken", csrftoken);

    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    axios.defaults.withCredentials = true;
    axios
      .put(
        `${process.env.REACT_APP_API_HOST}/api/pages/${slug}/section/0/`,
        data,
      )
      .then((response) => {
        if (response.status === 200) {
          getPageInfo();
        }
      })
      .catch((error) => {
        if (error.response.status === 403) {
          setNotificationText(
            "Permission denied! You're not allowed to add sections.",
          );
          setNotificationOpen(true);
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
