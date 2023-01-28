
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoggedIn: false,
  token: null,
  seasonPass: null,
  userName: null,
};

// async signin request to api; returns jwt;
export const signin = createAsyncThunk(
  'user/signin',
  async (data) => {
    try{
      const response = await axios.post('http://localhost:5001/api/auth/signin', data)
      return response.data;
    } catch(err) {
      console.log(err);
      throw err;
    }
  }
);

export const signup = createAsyncThunk(
  'user/signup',
  async(data) => {
    try{
      const response = await axios.post('http://localhost:5001/api/auth/signup', data)
      return response.data; 
    } catch(err) {
      console.log(err);
      throw err;
    }
  }
);

export const editUser = createAsyncThunk(
    'user/editUser',
    async (data) => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`
        }
        const response = await axios.put('http://localhost:5001/api/user/updateinfo', data, { headers });
        console.log(response);
        return response.data;
      } catch(err) {
        throw err;
    }
  }
  )

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async () => {
      try {
        const response = await axios.delete('http://localhost:5001/api//api/user/delete');
        return response.data;
      } catch(err) {
        console.log(err);
      }
    }
  )


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signOut: () => {
      return initialState;
    }
  },
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
        state.seasonPass = action.payload.user.seasonPass;
        state.userName = action.payload.user.userName
      })
      .addCase(editUser.rejected, (state) => {
        console.log(`editUser.rejected redux thunk handler invoked`)
        return state;
      })
      .addCase(deleteUser.pending, (state) => { state.status = 'loading';})
      .addCase(deleteUser.fulfilled, (state) => {
        return initialState;
      })
  }
});

export default userSlice.reducer;