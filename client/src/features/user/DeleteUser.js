import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "./UserSlice";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const DeleteUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isLoggedIn, token} = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/user");
    }
  }, [isLoggedIn]);

  function submitHandler() {
    dispatch(deleteUser(token));
  }
  return (
    <Container>
      <Row>
        <Button variant="primary" type="submit" onClick={submitHandler}>
          Bon Voyage!
        </Button>
      </Row>
    </Container>
  );
};

export default DeleteUser;
