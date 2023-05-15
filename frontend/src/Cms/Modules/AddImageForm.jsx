import { useState } from "react";
import { Button, FileInput, Flex, ActionIcon, Divider } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

const App = () => {
  const csrftoken = Cookies.get("csrftoken");
  const [imageFile, setImageFile] = useState(null);

  const uploadImage = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.set("image", imageFile);
    data.set("key", "61bf5339efd0f697d130a299c4c0cc02");
    delete axios.defaults.headers.common["X-CSRFToken"];
    axios
      .post(`https://api.imgbb.com/1/upload`, data)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.data.display_url);
          return response.data.data.display_url;
        }
      })
      .then((image_url) => {
        const image_data = new FormData();
        image_data.set("image_url", image_url);
        axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
        axios
          .post(`http://127.0.0.1:8002/api/image/create/`, image_data)
          .then((response) => {
            if (response.status === 200) {
              console.log("success");
            }
          });
      });
  };

  return (
    <form onSubmit={(event) => uploadImage(event)}>
      <Flex
        bg="blue.1"
        gap="sm"
        justify="left"
        align="center"
        direction="column"
        mt="sm"
        px="xl"
        py="sm"
      >
        <Divider
          label="Upload an Image"
          labelPosition="center"
          color="black"
          style={{
            width: "100%",
          }}
        />
        <Flex
          bg="blue.1"
          gap="sm"
          justify="left"
          align="end"
          direction="row"
          wrap="wrap"
          style={{
            width: "100%",
          }}
        >
          <FileInput
            name="image"
            id="image"
            placeholder="Upload Image..."
            onChange={setImageFile}
            style={{
              flexGrow: "1",
            }}
            icon={
              <ActionIcon size="sm" title="Add Image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path>
                </svg>
              </ActionIcon>
            }
          />
          <Button type="submit">Upload Image</Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default App;
