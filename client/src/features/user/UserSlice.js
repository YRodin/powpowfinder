import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoggedIn: false,
  token: null
};

// async signin request to api; returns jwt;
export const signinAsync = (data) => createAsyncThunk(
  'user/signin',
  axios.post('http://localhost:5001/api/auth/signin', data)
    .then(response => {
      return response;
    })
    .catch(err => console.log(err))
)

export const signupAsync = (data) => createAsyncThunk(
  'user/signup',
  axios.post('http://localhost:5001/api/auth/signup', data)
  .then(response => {
    return response;
  })
  .catch(err => console.log(err))
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signinAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signinAsync.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload;
      })
      .addCase(signupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload;
      })
  }
});

export default userSlice.reducer;