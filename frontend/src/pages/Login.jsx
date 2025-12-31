

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../user/userSlice';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { loading, error, user } = useSelector((state) => state.user);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (user) {
			setSuccess(true);

			setTimeout(() => {
				navigate('/'); // Redirect to home or profile
			}, 1500);
		}
	}, [user, navigate]);

	const handleSubmit = (e) => {
		e.preventDefault();
		dispatch(loginUser({ email, password }));
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
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
					{loading ? 'Logging in...' : 'Login'}
				</button>
				{error && <div className="error">{error}</div>}
				{success && <div className="success">Login successful! Redirecting...</div>}
			</form>
			<div className="signup-link" style={{ marginTop: '1rem' }}>
				Not a member yet?{' '}
				<Link to="/register">Sign up here</Link>
			</div>
		</div>
	);
};

export default Login;
