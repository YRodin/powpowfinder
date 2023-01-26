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
      {/* */}
      <BrowserRouter>
      <Navbar/>
        <Routes>
          <Route path="/" exact element={<></>}></Route>
          <Route path="/user" exact element={<><MainUser/></>}></Route>
          <Route path="/user/delete" element={<DeleteUser/>}></Route>
          <Route path="/user/login" element={<><LoginForm/></>}></Route>
          <Route path="/user/signup" element={<><SignUpForm/></>}></Route>
          <Route path="/user/edit" element={<><EditUserForm/></>}></Route>
          {/* <Route path="" element={}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
