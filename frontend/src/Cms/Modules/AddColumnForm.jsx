import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Flex, Text, SegmentedControl } from "@mantine/core";
import Cookies from "js-cookie";
import axios from "axios";

const App = ({ section, sectionKey, getPageInfo }) => {
  const csrftoken = Cookies.get("csrftoken");
  axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.withCredentials = true;
  const { slug } = useParams();
  const [columnAmount, setColumnAmount] = useState(
    Object.keys(section?.columns).length.toString(),
  );

  useEffect(() => {
    if (columnAmount !== Object.keys(section?.columns).length.toString()) {
      const data = new FormData();
      data.append("section_key", sectionKey);
      axios
        .post(
          `http://127.0.0.1:8002/api/page/${slug}/column/change/${columnAmount}/`,
          data,
        )
        .then((response) => {
          if (response.status === 200) {
            getPageInfo();
          }
        });
    }
  }, [columnAmount, getPageInfo, section, sectionKey, slug]);

  return (
    <Flex direction="row" gap="sm" align="center">
      <Text>Amount of columns</Text>
      <SegmentedControl
        value={columnAmount}
        data={[
          { label: "One", value: "1" },
          { label: "Two", value: "2" },
        ]}
        fullWidth
        transitionDuration={200}
        transitionTimingFunction="ease-out"
        onChange={setColumnAmount}
      />
    </Flex>
  );
};

export default App;
