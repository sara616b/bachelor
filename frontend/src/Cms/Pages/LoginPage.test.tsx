import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import useIsAuthenticated from "../Hooks/useIsAuthenticated";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { getByLabelText } from "@testing-library/react";

jest.mock("../Hooks/useIsAuthenticated");
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("LoginPage", () => {
  beforeEach(() => {
    // Mock useIsAuthenticated hook
    (useIsAuthenticated as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      csrftoken: "dummy_csrftoken",
    });

    // Mock axios post method
    axios.post = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the login form", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Log In");
  });

  test("submits the login form with the correct data", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const postData = {
      status: 200,
      data: {
        result: "logged in",
      },
    };

    // Mock the axios.post method to return a custom response
    (axios.post as jest.Mock).mockResolvedValueOnce(postData);

    // Fill out and submit the form
    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(submitButton);

    // Wait for axios post method to be called
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        "http://127.0.0.1:8002/login/",
        expect.any(FormData),
      );
    });

    // Check that the form data was correct
    const formData = (axios.post as jest.Mock).mock.calls[0][1];
    expect(formData.get("username")).toBe("testuser");
    expect(formData.get("password")).toBe("testpassword");
    expect(formData.get("csrfmiddlewaretoken")).toBe("dummy_csrftoken");

    // Check that the user is redirected on successful login
    await waitFor(() => {
      expect(window.location.pathname).toBe("/");
    });
  });

  test("does not submit the login form if the username and password are not provided", async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    // Submit the form without filling it out
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    // Wait for axios post method to not be called
    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
