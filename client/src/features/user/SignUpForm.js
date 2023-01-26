import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
// import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "./UserSlice";
import { useNavigate } from "react-router-dom";
import Row from "react-bootstrap/Row";
// import { yupResolver } from '@hookform/resolvers/yup';

function SignUpForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log(data);
    dispatch(signup(data));
    navigate("/user");
    // if(isLoggedIn) {
      
    // } else {
    //   console.error("Error Logging In")
    // }
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>User Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter user name"
          {...register("userName", { required: "Required" })}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          {...register("password", { required: "Required" })}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default SignUpForm;
