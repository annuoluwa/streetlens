

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../user/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, user } = useSelector((state) => state.user);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (user) {
			setSuccess(true);
			//redirect after a short delay
			setTimeout(() => {
				navigate('/login'); // Redirect to login after registration
			}, 1500);
		}
	}, [user, navigate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(registerUser({ username, email, password }));
	};

	return (
		<div className="register-container">
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Username:</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Email:</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? 'Registering...' : 'Register'}
				</button>
				{error && <div className="error">{error}</div>}
				{success && <div className="success">Registration successful! Redirecting to login...</div>}
			</form>
			<div className="login-link" style={{ marginTop: '1rem' }}>
				Have an account?{' '}
				<Link to="/login">Log in here</Link>
			</div>
		</div>
	);
};

export default Register;
