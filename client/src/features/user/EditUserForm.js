import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { editUser } from "./UserSlice";
import { useNavigate } from "react-router-dom";

const EditUserForm = () => {
  const schema = yup.object().shape({
    userName: yup.string(),
    password: yup.string().min(7),
    seasonPass: yup.string(),
  });
  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName, seasonPass } = useSelector((state) => state.user);

  const onSubmit = (data) => {
    // dispatch api Put request and save data in redux state  
    dispatch(editUser(data));
    // redirect to home page
    navigate.push("/");
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Update User Name</Form.Label>
        <Form.Control
          type="userName"
          name="userName"
          placeholder={userName}
          ref={register}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Update Season Pass</Form.Label>
        <Form.Control
          type="seasonPass"
          name="seasonPass"
          placeholder={seasonPass}
          ref={register}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Update your Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          ref={register}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Send it!
      </Button>
    </Form>
  );
};

export default EditUserForm;
