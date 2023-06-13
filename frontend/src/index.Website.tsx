import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Page from "./Website/Pages/Page";
// import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./output.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Page />}>
      <Route path="/:slug/" element={<Page />} />
      {/* <Route path="/:slug/:preview/" element={Page} /> */}
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();