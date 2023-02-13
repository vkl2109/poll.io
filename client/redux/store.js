import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import avatarReducer from './reducers/avatarReducer';

export const store = configureStore({
  reducer: {
    user: userReducer,
    avatar: avatarReducer
  }
});