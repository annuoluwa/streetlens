
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../report/reportSlice';



const AreaOverview = () => {
	const dispatch = useDispatch();
	const { reports, loading, error } = useSelector((state) => state.reports);

	const [city, setCity] = useState('');
	const [category, setCategory] = useState('');
	const [sort, setSort] = useState('date-desc');
	const [flagged, setFlagged] = useState('all'); // 'all', 'flagged', 'not_flagged'

	useEffect(() => {
		dispatch(fetchReports());
	}, [dispatch]);

	// A static list of UK cities for the city filter
	const ukCities = [
		'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh',
		'Bristol', 'Cardiff', 'Belfast', 'Newcastle', 'Leicester', 'Coventry', 'Kingston upon Hull',
		'Bradford', 'Stoke-on-Trent', 'Wolverhampton', 'Nottingham', 'Plymouth', 'Southampton',
		'Reading', 'Derby', 'Dudley', 'Northampton', 'Portsmouth', 'Luton', 'Preston', 'Milton Keynes',
		'Aberdeen', 'Sunderland', 'Norwich', 'Walsall', 'Swansea', 'Bournemouth', 'Oxford', 'Cambridge',
		'Ipswich', 'York', 'Blackpool', 'Bolton', 'Peterborough', 'Middlesbrough', 'Stockport',
		'Brighton', 'Slough', 'West Bromwich', 'Huddersfield', 'Rotherham', 'Croydon', 'Watford',
		'Oldham', 'Woking', 'Chelmsford', 'Basildon', 'Gillingham', 'Solihull', 'Hounslow', 'Warrington',
		'Basingstoke', 'Eastbourne', 'Colchester', 'Crawley', 'Gateshead', 'High Wycombe', 'Cheltenham',
		'Doncaster', 'Maidstone', 'Wokingham', 'St Albans', 'Bath', 'Stevenage', 'Hastings', 'Harrow',
		'Bedford', 'Chatham', 'Hemel Hempstead', 'Darlington', 'Hartlepool', 'Halifax', 'Chester',
		'Guildford', 'Barnsley', 'Grimsby', 'Wakefield', 'Telford', 'Barrow-in-Furness', 'Poole',
		'Burnley', 'Bury', 'Salford', 'Rochdale', 'Southend-on-Sea', 'Birkenhead', 'Warrington',
		'Wigan', 'Blackburn', 'Mansfield', 'Swindon', 'Exeter', 'Lincoln', 'Gloucester', 'Shrewsbury',
		'Stafford', 'Hereford', 'Carlisle', 'Durham', 'Stirling', 'Inverness', 'Perth', 'Dundee',
		'Paisley', 'Motherwell', 'Falkirk', 'Kilmarnock', 'Ayr', 'Greenock', 'Hamilton', 'Cumbernauld',
		'Livingston', 'East Kilbride', 'Dunfermline', 'Kirkcaldy', 'Bathgate', 'Elgin', 'Aberystwyth',
		'Bangor', 'Wrexham', 'Newport', 'Merthyr Tydfil', 'Bridgend', 'Barry', 'Neath', 'Cwmbran',
		'Pontypridd', 'Llanelli', 'Swansea', 'Rhondda', 'Caerphilly', 'Port Talbot', 'Aberdare',
		'Llandudno', 'Colwyn Bay', 'Holyhead', 'Carmarthen', 'Brecon', 'Cardigan', 'Lampeter',
		'Llangefni', 'Pwllheli', 'Bala', 'Dolgellau', 'Porthmadog', 'Barmouth', 'Machynlleth',
		'Tywyn', 'Harlech', 'Criccieth', 'Conwy', 'Betws-y-Coed', 'Denbigh', 'Ruthin', 'Mold',
		'Flint', 'St Asaph', 'Prestatyn', 'Rhyl', 'Wrexham', 'Llangollen', 'Oswestry', 'Chester',
		'Shrewsbury', 'Welshpool', 'Newtown', 'Ludlow', 'Knighton', 'Leominster', 'Hereford',
		'Ross-on-Wye', 'Monmouth', 'Abergavenny', 'Chepstow', 'Usk', 'Caldicot', 'Pontypool',
		'Blaenavon', 'Ebbw Vale', 'Tredegar', 'Brynmawr', 'Abertillery', 'Crickhowell', 'Hay-on-Wye'
	];
	const cityOptions = ukCities;
	const categoryOptions = [
		'Health Hazard',
		'Security Hazard',
		'Fire Hazard',
		'Structural Hazard',
		'Environmental Hazard'
	];

	// Filter and sort reports
	const filteredReports = useMemo(() => {
		let filtered = reports;
		if (city) filtered = filtered.filter(r => r.city === city);
		if (category) filtered = filtered.filter(r => r.category === category);
		if (flagged === 'flagged') filtered = filtered.filter(r => r.is_flagged === true);
		if (flagged === 'not_flagged') filtered = filtered.filter(r => r.is_flagged === false);
		if (sort === 'date-desc') filtered = filtered.slice().sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at));
		if (sort === 'date-asc') filtered = filtered.slice().sort((a, b) => new Date(a.createdAt || a.created_at) - new Date(b.createdAt || b.created_at));
		if (sort === 'title-az') filtered = filtered.slice().sort((a, b) => (a.title || '').localeCompare(b.title || ''));
		if (sort === 'title-za') filtered = filtered.slice().sort((a, b) => (b.title || '').localeCompare(a.title || ''));
		return filtered;
	}, [reports, city, category, flagged, sort]);

			return (
				<div className="container my-4">
					<h2 className="mb-4">Area Overview</h2>
					<div className="row g-3 mb-4">
						<div className="col-12 col-md-3">
							<label className="form-label fw-semibold">City</label>
							<select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
								<option value="">All</option>
								{cityOptions.map((c, idx) => <option key={c + '-' + idx} value={c}>{c}</option>)}
							</select>
						</div>
						<div className="col-12 col-md-3">
							<label className="form-label fw-semibold">Category</label>
							<select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
								<option value="">All</option>
								<option value="Health Hazard">Health Hazard</option>
								<option value="Security Hazard">Security Hazard</option>
								<option value="Fire Hazard">Fire Hazard</option>
								<option value="Structural Hazard">Structural Hazard</option>
								<option value="Environmental Hazard">Environmental Hazard</option>
							</select>
						</div>
						<div className="col-12 col-md-3">
							<label className="form-label fw-semibold">Flagged</label>
							<select className="form-select" value={flagged} onChange={e => setFlagged(e.target.value)}>
								<option value="all">All</option>
								<option value="flagged">Flagged</option>
								<option value="not_flagged">Not Flagged</option>
							</select>
						</div>
						<div className="col-12 col-md-3">
							<label className="form-label fw-semibold">Sort by</label>
							<select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
								<option value="date-desc">Date (Newest)</option>
								<option value="date-asc">Date (Oldest)</option>
								<option value="title-az">Title (A-Z)</option>
								<option value="title-za">Title (Z-A)</option>
							</select>
						</div>
					</div>
					{loading && <div className="alert alert-info">Loading reports...</div>}
					{error && <div className="alert alert-danger">{error}</div>}
					{!loading && !error && filteredReports.length === 0 && (
						<div className="alert alert-secondary">No reports found for this area.</div>
					)}
					<div className="row g-3">
						{filteredReports.map((report) => (
							<div className="col-12 col-md-6 col-lg-4" key={report.id || report._id}>
								<div className="card h-100 shadow-sm">
									<div className="card-body">
										<h5 className="card-title">{report.title}</h5>
										<p className="card-text">{report.description}</p>
										<p className="card-text mb-1"><span className="fw-semibold">Location:</span> {report.city || report.location}</p>
										<p className="card-text mb-1"><span className="fw-semibold">Date Posted:</span> {
											report.createdAt
												? new Date(report.createdAt).toLocaleString()
												: report.created_at
													? new Date(report.created_at).toLocaleString()
													: 'N/A'
										}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			);
};

export default AreaOverview;
