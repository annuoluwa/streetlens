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
	const [showPassword, setShowPassword] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleEyeClick = () => setShowPassword((prev) => !prev);

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
					<div style={{ display: 'flex', alignItems: 'center', position: 'relative', maxWidth: '350px' }}>
						<input
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							style={{ paddingRight: '2.5rem', width: '100%' }}
						/>
						<span
							onClick={handleEyeClick}
							style={{
								display: 'flex',
								alignItems: 'center',
								position: 'absolute',
								right: '0.75rem',
								top: '50%',
								transform: 'translateY(-50%)',
								background: 'transparent',
								border: 'none',
								cursor: 'pointer',
								userSelect: 'none',
								padding: 0,
							}}
							aria-label={showPassword ? 'Hide password' : 'Show password'}
						>
							{showPassword ? (
								// Open eye SVG
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
									<ellipse cx="12" cy="12" rx="8" ry="5" />
									<circle cx="12" cy="12" r="2" />
								</svg>
							) : (
								// Closed eye SVG
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
									<ellipse cx="12" cy="12" rx="8" ry="5" />
									<line x1="4" y1="19" x2="20" y2="5" />
								</svg>
							)}
						</span>
					</div>
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
