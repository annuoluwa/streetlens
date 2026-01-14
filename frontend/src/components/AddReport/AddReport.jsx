import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReport } from '../../report/reportSlice';

const AddReport = () => {
	const dispatch = useDispatch();
	const { loading, error } = useSelector((state) => state.reports);

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [location, setLocation] = useState('');
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess(false);
		const resultAction = await dispatch(addReport({ title, description, location }));
		if (addReport.fulfilled.match(resultAction)) {
			setTitle('');
			setDescription('');
			setLocation('');
			setSuccess(true);
		}
	};

		return (
			<div className="container d-flex justify-content-center align-items-center min-vh-100">
				<div className="card p-4 shadow" style={{ minWidth: 340, maxWidth: 400, width: '100%' }}>
					<h2 className="mb-4 text-center">Submit a Report</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label className="form-label">Title</label>
							<input
								type="text"
								className="form-control"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Description</label>
							<textarea
								className="form-control"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Location</label>
							<input
								type="text"
								className="form-control"
								value={location}
								onChange={(e) => setLocation(e.target.value)}
								required
							/>
						</div>
						{error && <div className="alert alert-danger py-2">{error}</div>}
						<button type="submit" className="btn btn-primary w-100 mb-2" disabled={loading}>
							{loading ? 'Submitting...' : 'Submit Report'}
						</button>
						{success && <div className="alert alert-success py-2">Report submitted successfully!</div>}
					</form>
				</div>
			</div>
		);
};

export default AddReport;
