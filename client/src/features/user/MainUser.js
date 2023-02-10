import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { scrapePassInfo } from "./UserSlice";


const MainUser = () => {
  // const { seasonPassesInfo } = useSelector(state => state.user);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   if(!seasonPassesInfo) {
  //     dispatch(scrapePassInfo());
  //   }
  // }, []);
  return (
    <h3>Welcome to Powder Finder</h3>
  );
};

export default MainUser;
