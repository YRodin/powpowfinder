import React from "react";
import { useDispatch } from "react-redux";
import { deleteUser } from "./UserSlice";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const DeleteUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function submitHandler(){
    dispatch(deleteUser());
    navigate.push('/');
  }
  return (
    
    <Button variant="primary" type="submit"   onClick={submitHandler}>
        Bon Voyage!
      </Button>
  )
}

export default DeleteUser;