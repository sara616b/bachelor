import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import Frontpage from "./Cms/Pages/Frontpage";
import CreatePage from "./Cms/Pages/CreatePage";
import EditPage from "./Cms/Pages/EditPage";
import PagesOverview from "./Cms/Pages/PagesOverview";
import CreateUser from "./Cms/Pages/CreateUser";
import EditUser from "./Cms/Pages/EditUser";
import UsersOverview from "./Cms/Pages/UsersOverview";
import LoginPage from "./Cms/Pages/LoginPage";
import Layout from "./Cms/Modules/Layout";
import ImagesOverview from "./Cms/Pages/ImagesOverview";
// import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login/" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Frontpage />} />
        <Route path="/pages/" element={<PagesOverview />} />
        <Route path="/pages/create/" element={<CreatePage />} />
        <Route path="/pages/:slug" element={<EditPage />} />
        <Route path="/users/" element={<UsersOverview />} />
        <Route path="/users/create/" element={<CreateUser />} />
        <Route path="/users/:username/" element={<EditUser />} />
        <Route path="/images/" element={<ImagesOverview />} />
      </Route>
    </>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
