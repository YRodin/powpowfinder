import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  matchingResorts: []
};
export const searchFormSlice = createSlice({
  name: 'resorts2Display',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(populateMatchingResorts.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(populateMatchingResorts.fulfilled, (state, action)=> {
      state.isLoading = false;
      state.matchingResorts = action.payload;
    })
    .addCase(populateMatchingResorts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
      return state;
    })
  }
})
export const populateMatchingResorts = createAsyncThunk('resorts2Display/populateMatchingResorts', async(data) => {
  try {
    const response = await axios.post('http://localhost:5001/api/resortfinder', data);
    return response.data;
  } catch(err) {
    console.log(err);
  }
})

export default searchFormSlice.reducer;