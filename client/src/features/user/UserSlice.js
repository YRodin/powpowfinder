
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoggedIn: false,
  token: null,
  seasonPass: null,
  userName: null,
};

// async signin request to api; returns jwt;
export const signin = (data) => createAsyncThunk(
  'user/signin',
  axios.post('http://localhost:5001/api/auth/signin', data)
    .then(response => {
      return response;
    })
    .catch(err => console.log(err))
);

export const signup = (data) => createAsyncThunk(
  'user/signup',
  axios.post('http://localhost:5001/api/auth/signup', data)
  .then(response => {
    return response;
  })
  .catch(err => console.log(err))
);

export const editUser = (data) => {
  createAsyncThunk(
    'user/editUser',
    axios.put('http://localhost:5001/api/user/updateinfo', data)
    .then(response => {
      return response;
    })
    .catch(err => console.log(err))
  )
}
export const deleteUser = () => {
  createAsyncThunk(
    'user/deleteUser',
    axios.delete('http://localhost:5001/api//api/user/delete')
    .then(response => {
      return response;
    })
    .catch(err => console.log(err))
  )
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload;
      })
      .addCase(editUser.pending, (state) => { state.status = 'loading';})
      .addCase(editUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.seasonPass = action.payload.seasonPass;
        state.userName = action.payload.userName
      })
      .addCase(deleteUser.pending, (state) => { state.status = 'loading';})
      .addCase(deleteUser.fulfilled, (state) => {
        return initialState;
      })
  }
});

export default userSlice.reducer;