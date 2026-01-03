import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../user/userSlice';
import reportReducer from '../report/reportSlice';

const store = configureStore({
	reducer: {
		user: userReducer,
		reports: reportReducer,
	},
});

export default store;
