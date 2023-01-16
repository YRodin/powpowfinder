import React from "react";
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const LoginForm = () => {
  const schema = yup.object().shape({
    userName: yup.string().required(),
    password: yup.string().min(7).required()
  });
  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema
  });
  const onSubmit = data => {
    console.log(`${data} must be passed to an api login`);
  }
}
