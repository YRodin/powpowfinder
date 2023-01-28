import React from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MainUser = () => {
  const userName = useSelector(state => state.user.userName);
  return (
    <h3>Welcome to Powder Finder</h3>
  );
};

export default MainUser;
