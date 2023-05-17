import Title from "../../Website/Components/Title";
import Text from "../../Website/Components/Text";
import Image from "../../Website/Components/Image";

type ComponentValues = {
  component: any;
  values: {
    [index: string]: string | boolean;
  };
  customization: object;
};

export interface ComponentTypes {
  [index: string]: ComponentValues;
}

const components: ComponentTypes = {
  Title: {
    component: Title,
    values: {
      name: "Title",
      title_color: "#000",
      text: "New Title",
      alignment: "center",
      bold: false,
    },
    customization: {
      text: {
        type: "text",
        name: "Title Text",
      },
      title_color: {
        type: "color",
        name: "Title Color",
      },
      alignment: {
        type: "alignment",
        name: "Title Alignment",
      },
      bold: {
        type: "boolean",
        name: "Bold",
      },
    },
  },
  Text: {
    component: Text,
    values: {
      name: "Text",
      text_color: "#000",
      text: "New Text",
      alignment: "center",
    },
    customization: {
      text: {
        type: "textarea",
        name: "Text Text",
      },
      text_color: {
        type: "color",
        name: "Text Color",
      },
      alignment: {
        type: "alignment",
        name: "Text Alignment",
      },
    },
  },
  Image: {
    component: Image,
    values: {
      name: "Image",
      link: "",
      alignment: "center",
    },
    customization: {
      link: {
        type: "text",
        name: "Link",
      },
    },
  },
};

export default components;
