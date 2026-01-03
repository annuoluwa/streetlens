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
		<div className="add-report-container">
			<h2>Submit a Report</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Title:</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Description:</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Location:</label>
					<input
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						required
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? 'Submitting...' : 'Submit Report'}
				</button>
				{error && <div className="error">{error}</div>}
				{success && <div className="success">Report submitted successfully!</div>}
			</form>
		</div>
	);
};

export default AddReport;
