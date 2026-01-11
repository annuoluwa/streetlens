import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../user/userSlice';
import reportReducer from '../report/reportSlice';

import flaggedReportsReducer from '../report/flaggedReportsSlice';

const store = configureStore({
	reducer: {
		user: userReducer,
		reports: reportReducer,
		flaggedReports: flaggedReportsReducer,
	},
});

export default store;
