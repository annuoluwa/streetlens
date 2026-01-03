
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../report/reportSlice';
import styles from './AreaOverview.module.css';


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

	// Use a static list of UK cities for the city filter
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
	const categoryOptions = useMemo(() => {
		const set = new Set();
		reports.forEach(r => { if (r.category) set.add(r.category); });
		return Array.from(set).sort();
	}, [reports]);

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
		<div className={styles.areaOverviewContainer}>
			<h2 className={styles.areaOverviewHeader}>Area Overview</h2>
			<div style={{ display: 'flex', gap: '1.5em', marginBottom: '1.5em', flexWrap: 'wrap' }}>
				<div>
					<label style={{ fontWeight: 500, marginRight: 8 }}>City:</label>
					<select value={city} onChange={e => setCity(e.target.value)}>
						<option value="">All</option>
						{cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
					</select>
				</div>
				<div>
					<label style={{ fontWeight: 500, marginRight: 8 }}>Category:</label>
					<select value={category} onChange={e => setCategory(e.target.value)}>
						<option value="">All</option>
						{categoryOptions.map(cat => <option key={cat} value={cat}>{cat}</option>)}
					</select>
				</div>
				<div>
					<label style={{ fontWeight: 500, marginRight: 8 }}>Flagged:</label>
					<select value={flagged} onChange={e => setFlagged(e.target.value)}>
						<option value="all">All</option>
						<option value="flagged">Flagged</option>
						<option value="not_flagged">Not Flagged</option>
					</select>
				</div>
				<div>
					<label style={{ fontWeight: 500, marginRight: 8 }}>Sort by:</label>
					<select value={sort} onChange={e => setSort(e.target.value)}>
						<option value="date-desc">Date (Newest)</option>
						<option value="date-asc">Date (Oldest)</option>
						<option value="title-az">Title (A-Z)</option>
						<option value="title-za">Title (Z-A)</option>
					</select>
				</div>
			</div>
			{loading && <div>Loading reports...</div>}
			{error && <div className={styles.error}>{error}</div>}
			{!loading && !error && filteredReports.length === 0 && <div>No reports found for this area.</div>}
			<ul className={styles.areaOverviewList}>
				{filteredReports.map((report) => (
					<li key={report.id || report._id} className={styles.areaOverviewItem}>
						<div className={styles.areaOverviewTitle}>{report.title}</div>
						<div className={styles.areaOverviewDesc}>{report.description}</div>
						<div className={styles.areaOverviewMeta}>
							<span><em>Location:</em> {report.city || report.location}</span>
							<span><em>Date:</em> {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AreaOverview;
