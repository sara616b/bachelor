import React from "react";
import { NavLink, Link } from "react-router-dom";

const Frontpage = () => {
  return (
    <main className="grid">
      <h1>HELLO FROM !!</h1>
      <NavLink to="/page/create/">Create Page</NavLink>
      <Link to="/page/create/">Create Page</Link>
    </main>
  );
};

export default Frontpage;
