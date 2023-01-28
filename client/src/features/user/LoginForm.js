import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "./UserSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  // const [ user, setUser ] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isLoggedIn, userName} = useSelector((state) => state.user);

  useEffect(() => {
    if(isLoggedIn) {
      navigate('/user');
    }
  }, [isLoggedIn]);
  
  const onSubmit = function (data){
    dispatch(signin(data));   
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
        {errors.userName && <p>This field is required</p>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          {...register("password", { required: "Required" })}
        />
        {errors.password && <p>This field is required</p>}
      </Form.Group>

      <Button variant="primary" type="submit">
        Log in!
      </Button>
    </Form>
  );
};

export default LoginForm;
