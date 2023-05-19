export type ComponentObjectProps = {
  name: string;
  [index: string]: string | boolean;
};

export type PageObjectProps = {
  online: boolean;
  title: string;
  slug: string;
  thumbnail_url: string;
  data: {
    sections: {
      [index: number]: {
        name: string;
        wrap_reverse: boolean;
        background_color: string;
        columns: {
          [index: number]: {
            name: string;
            alignContent: string;
            components: {
              [index: number]: ComponentObjectProps;
            };
          };
        };
      };
    };
  };
};

export type UserObjectProps = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_superuser: boolean;
};

export type AuthenticationProps = {
  isLoggedIn: boolean;
  csrftoken: string;
  setNotificationOpen: Function;
  setNotificationText: Function;
};
