import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "./UserSlice";
import { useNavigate } from "react-router-dom";

const EditUserForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName, token } = useSelector((state) => state.user);

  function onSubmit (data) {
    // dispatch api Put request and save data in redux state
    const dataAndToken = { ...data, token};
    console.log(dataAndToken);
    dispatch(editUser(dataAndToken));
    // redirect to home page
    navigate("/user");
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label>Update User Name</Form.Label>
        <Form.Control
          type="userName"
          placeholder={userName}
          {...register("userName")}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Update Season Pass</Form.Label>
        <Form.Control
          type="text"
          placeholder="Dropdown menu to be built"
          {...register("seasonPass")}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Update your Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          {...register("password")}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Send it!
      </Button>
    </Form>
  );
};

export default EditUserForm;
