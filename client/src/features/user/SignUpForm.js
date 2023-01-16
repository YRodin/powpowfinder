import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { signupAsync } from "./UserSlice";
import { useHistory } from "react-router-dom";

const SignUpForm = () => {
  const schema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().min(7).required(),
  });
  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
  });
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = (data) => {
    // append user data to redux state
    dispatch(signupAsync(data));
    // redirect to home page
    history.push("/");
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>User Name</Form.Label>
        <Form.Control
          type="userName"
          name="userName"
          placeholder="Enter username"
          ref={register}
        />
        {errors.userName && <p>This field is required</p>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          ref={register}
        />
        {errors.password && <p>This field is required</p>}
      </Form.Group>

      <Button variant="primary" type="submit">
        Sign Up!
      </Button>
    </Form>
  );
};

export default SignUpForm;
