import React, { useState, useEffect } from 'react';
import logo from '../logo/streetlens-logo.png';
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
	const [localError, setLocalError] = useState('');
	const [registrationEventId, setRegistrationEventId] = useState(null);

	const handleEyeClick = () => setShowPassword((prev) => !prev);

	useEffect(() => {
		if (user) {
			setSuccess(true);
			if (window.fbq) window.fbq('track', 'CompleteRegistration', {}, { eventID: registrationEventId });
			//redirect after a short delay
			setTimeout(() => {
				navigate('/login'); // Redirect to login after registration
			}, 1500);
		}
	}, [user, navigate, registrationEventId]);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLocalError('');
		if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
			setLocalError('Password must be at least 8 characters and include a letter and a number.');
			return;
		}
		const eventId = crypto.randomUUID();
		setRegistrationEventId(eventId);
		dispatch(registerUser({ username, email, password, eventId }));
	};

		return (
			<div
				className="container d-flex justify-content-center align-items-center min-vh-100"
				style={{
					backgroundImage: `url(${logo})`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					backgroundSize: '400px',
					minHeight: '100vh',
					backgroundColor: 'rgba(255,255,255,0.7)',
				}}
			>
				<div className="card p-4 shadow" style={{ minWidth: 340, maxWidth: 420, width: '100%', background: 'rgba(255,255,255,0.85)', border: 'none' }}>
					<h2 className="mb-2 text-center">Create your free StreetLens account</h2>
					<p className="text-center text-muted mb-3">
						Join the StreetLens community and help make UK housing more transparent.
					</p>
					<p className="fw-semibold mb-1">Your account lets you:</p>
					<ul className="mb-3 ps-3">
						<li>Submit housing reports</li>
						<li>Keep track of your submissions</li>
						<li>Explore reports from other renters</li>
						<li>Contribute anonymously to the public housing picture</li>
					</ul>
					<p className="text-muted small mb-4">
						Your report can be submitted anonymously. Your personal details are not published with your report.
					</p>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Username</label>
							<input
								type="text"
								className="form-control"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Email</label>
							<input
								type="email"
								className="form-control"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3 position-relative">
							<label className="form-label">Password</label>
							<input
								type={showPassword ? 'text' : 'password'}
								className="form-control"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								className="btn btn-sm btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2"
								style={{ zIndex: 2 }}
								onClick={handleEyeClick}
								tabIndex={-1}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
							>
								{showPassword ? (
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
										<ellipse cx="12" cy="12" rx="8" ry="5" />
										<circle cx="12" cy="12" r="2" />
									</svg>
								) : (
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
										<ellipse cx="12" cy="12" rx="8" ry="5" />
										<line x1="4" y1="19" x2="20" y2="5" />
									</svg>
								)}
							</button>
						</div>
						{(localError || error) && (
							<div className="alert alert-danger py-2">{localError || error}</div>
						)}
						<button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
							{loading ? 'Registering...' : 'Register'}
						</button>
						{success && <div className="alert alert-success py-2">Registration successful! Redirecting to login...</div>}
					</form>
					<div className="text-center mt-2">
						Have an account? <Link to="/login">Log in here</Link>
					</div>
				</div>
			</div>
		);
};

export default Register;
