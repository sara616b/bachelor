import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// import { MantineProvider } from "@mantine/core";
import Frontpage from "./Cms/Pages/Frontpage";
import CreatePage from "./Cms/Pages/CreatePage";
// import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
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
// import Navigation from "../Modules/Navigation.jsx";
import Navigation from "./Cms/Modules/Navigation";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Frontpage />}>
      <Route path="/page/create/" element={<CreatePage />} />
      <Route path="/page/" element={<CreatePage />} />
    </Route>,
  ),
);

// const Main = () => {
//   return (
//     <BrowserRouter>
//       <Navigation />
//       <Routes>
//         <Route exact path="/" element={Frontpage} />
//         <Route path="/page/create/" element={CreatePage} />
//         <Route path="/page/all/" element={PageOverview} />
//         <Route path="/page/edit/:slug" element={EditPage} />
//         <Route path="/user/create/" element={CreateUser} />
//         <Route path="/user/edit/:username" element={EditUser} />
//         <Route path="/users/" element={UsersOverview} />
//         <Route path="/login/" element={LoginPage} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

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
