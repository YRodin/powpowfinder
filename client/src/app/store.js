import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../features/user/UserSlice";
import searchFormReducer from "../features/searchForm/SearchFormSlice";

const rootReducer = combineReducers({
  user: userReducer,
  resorts2Display: searchFormReducer,
});
export const store = configureStore({
  reducer: rootReducer,
});
