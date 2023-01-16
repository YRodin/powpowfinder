import React from "react";
import Container from "react-bootstrap/Container";
import { useSelector } from "react-redux";
import * as yup from 'yup';

const SearchForm = () => {
  
  const userSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
  });

};
export default SearchForm;

//To Do:
// implement input validation/normalization with npm react-hook-form and @hookform/resolvers/yup';
// this form kicks off an api request for data from openWeatherApi
// renew and store api key in separate folder added to .gitIgnore
// data retreived from openWeatherApi gets stored in redux state to be later passed on Map and Table components for rendering
