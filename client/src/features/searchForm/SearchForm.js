import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {populateMatchingResorts} from './SearchFormSlice';


const SearchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [radiusValue, setRadiusValue] = useState(0);
  const handleRadiusChange = (e) => {
    setRadiusValue(parseInt(e.target.value));
  };
  const dispatch = useDispatch();
  const onSubmit = async(data) => {
    console.log(`onSubmit is invoked!`)
    const radius = data.radius * 1000; //convert to meters
    const cityNState = data.location;
    const [city, state] = cityNState.split(' ').map((string) => string.trim());
    dispatch(populateMatchingResorts({city, state, radius}))
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formBasicText">
        <Form.Label>Enter city and state:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter location"
          {...register("location", { required: true })}
          isInvalid={errors.location}
        />
        <Form.Control.Feedback type="invalid">
          Please enter your location.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="formBasicRange">
        <Form.Label>Select a radius:</Form.Label>
        <Form.Control
          type="range"
          step="5"
          min="0"
          max="50"
          value={radiusValue}   
          {...register("radius", { required: true })}
          onChange={handleRadiusChange} 
          isInvalid={errors.radius}
        />
        <Form.Control.Feedback type="invalid">
          Please select a radius.
        </Form.Control.Feedback>
        <Form.Text>Current radius: {radiusValue} km</Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default SearchForm;

//To Do:
// implement input validation/normalization with npm react-hook-form and @hookform/resolvers/yup';
// this form kicks off an api request for data from openWeatherApi
// renew and store api key in separate folder added to .gitIgnore
// data retreived from openWeatherApi gets stored in redux state to be later passed on Map and Table components for rendering
