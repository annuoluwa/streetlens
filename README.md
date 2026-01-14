
# StreetLens

StreetLens is a platform for reporting, tracking, and escalating rent abuse and neighborhood issues. Empower your community by making your street safer and more transparent.

**Note:** All users must create an account to submit reports, whether they choose to report anonymously or with their identity attached.

## Features
- Report rent abuse and neighborhood concerns (all users must have an account; anonymity is optional per report)
- Admin escalation workflow for critical reports
- Email notifications for admins and authorities
- User authentication and profile management
- Password reset and account deletion (with confirmation)
- Admin dashboard for managing reports and users
- Clean, professional, and production-ready codebase

## Technology Stack
- **Backend:** Node.js, Express, PostgreSQL, JWT, Nodemailer
- **Frontend:** React, Redux, Axios, Bootstrap, CSS Modules
- **Testing:** Mailtrap (for email), Jest (for frontend tests)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- PostgreSQL database

### Backend Setup
1. Navigate to the backend directory:
	```sh
	cd backend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file based on `.env.example` and configure your environment variables.
4. Start the backend server:
	```sh
	npm start
	```

### Frontend Setup
1. Navigate to the frontend directory:
	```sh
	cd frontend
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Create a `.env` file based on `.env.example` and set `REACT_APP_API_URL` to your backend URL.
4. Start the frontend app:
	```sh
	npm start
	```

## Folder Structure
- `backend/` - Express API, controllers, models, routes, and utilities
- `frontend/` - React app, components, Redux slices, and utilities

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for improvements or bug fixes.

## License
This project is licensed under the MIT License.

## Contact
For questions or support, please contact the project maintainer at: leezabethyomi@gmail.com
