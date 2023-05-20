import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Flex, Text, SegmentedControl } from "@mantine/core";
import axios from "axios";
import { AuthenticationProps } from "../../Utils/Foundation/Types";

type Props = {
  section: {
    columns: object;
  };
  sectionKey: number;
  getPageInfo: Function;
};

const AddColumnForm = ({ section, sectionKey, getPageInfo }: Props) => {
  const { csrftoken, setNotificationOpen, setNotificationText } =
    useOutletContext<AuthenticationProps>();
  const { slug } = useParams();
  const [columnAmount, setColumnAmount] = useState(
    Object.keys(section?.columns).length.toString(),
  );

  useEffect(() => {
    if (columnAmount !== Object.keys(section?.columns).length.toString()) {
      const data = new FormData();
      data.append("section_key", sectionKey.toString());

      axios.defaults.headers.common["Content-Type"] = "application/json";
      axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
      axios.defaults.withCredentials = true;
      axios
        .put(
          `${process.env.REACT_APP_API_HOST}/api/pages/${slug}/column/change/${columnAmount}/`,
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
              "Permission denied! You're not allowed to create pages.",
            );
            setNotificationOpen(true);
          }
        });
    }
  }, [
    columnAmount,
    getPageInfo,
    section,
    sectionKey,
    slug,
    csrftoken,
    setNotificationText,
    setNotificationOpen,
  ]);

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

export default AddColumnForm;
