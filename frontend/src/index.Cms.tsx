import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { MantineProvider } from "@mantine/core";
import Frontpage from "./Cms/Pages/Frontpage";
import CreatePage from "./Cms/Pages/CreatePage";
// import reportWebVitals from './reportWebVitals';
// import Root, { rootLoader } from "./routes/root";
// import Team, { teamLoader } from "./routes/team";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";
// import {
//   CreatePage,
//   PageOverview,
//   EditPage,
//   CreateUser,
//   EditUser,
//   UsersOverview,
//   Frontpage,
//   LoginPage,
// } from "../Pages/index.jsx";
import Navigation from "./Cms/Modules/Navigation";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={
        <div>
          <Navigation />
          <Outlet />
        </div>
      }
    >
      <Route path="/" element={<Frontpage />} />
      <Route path="/page/create/" element={<CreatePage />} />
      <Route path="/page/" element={<CreatePage />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <MantineProvider withGlobalStyles withNormalizeCSS> */}
    <RouterProvider router={router} />
    {/* </MantineProvider> */}
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
