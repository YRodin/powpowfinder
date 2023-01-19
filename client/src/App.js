import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DeleteUser from "./features/user/DeleteUser";
import EditUserForm from "./features/user/EditUserForm";
import LoginForm from "./features/user/LoginForm";
import MainUser from "./features/user/MainUser";
import SignUpForm from "./features/user/SignUpForm";
import Navbar from "./features/navbar/Navbar";

function App() {
  return (
    <div>
      <Navbar/>
      <BrowserRouter>
        <Routes>
          <Route index element={<div>hello world</div>}></Route>
          <Route path="" element={<></>}></Route>
          <Route path="" element={<></>}></Route>
          <Route path="" element={<></>}></Route>
          <Route path="" element={<></>}></Route>
          <Route path="" element={<></>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
