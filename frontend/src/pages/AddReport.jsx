import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addReport } from '../report/reportSlice';
import styles from './AddReport.module.css';

const AddReport = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.reports);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showAuthMessage, setShowAuthMessage] = useState(false);

  useEffect(() => {
    let timer;
    if (!user) {
      setShowAuthMessage(true);
      timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setShowAuthMessage(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [user, navigate]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [street, setStreet] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [landlordOrAgency, setLandlordOrAgency] = useState('');
  const [advertSource, setAdvertSource] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [flagged, setFlagged] = useState(false);

  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const [success, setSuccess] = useState(false);
  const [fileError, setFileError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');
  const [cityError, setCityError] = useState('');

  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [filePreviews]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    filePreviews.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });

    setFiles(selectedFiles);
    setFilePreviews(
      selectedFiles.map((file) =>
        file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setFileError('');
    setTitleError('');
    setDescError('');
    setCityError('');

    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    }
    if (!description.trim()) {
      setDescError('Description is required.');
      valid = false;
    }
    if (!city.trim()) {
      setCityError('City is required.');
      valid = false;
    }
    if (!flatNumber.trim()) {
      alert('Flat/Unit Number is required.');
      valid = false;
    }
    if (!files.length) {
      setFileError('Evidence file is required.');
      valid = false;
    }
    if (!valid) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('city', city);
    formData.append('flat_number', flatNumber);
    formData.append('postcode', postcode);
    formData.append('street', street);
    formData.append('property_type', propertyType);
    formData.append('landlord_or_agency', landlordOrAgency);
    formData.append('advert_source', advertSource);
    formData.append('category', category === 'Other' ? customCategory : category);
    formData.append('is_anonymous', String(isAnonymous));
    formData.append('flagged', String(flagged));

    files.forEach((file) => formData.append('evidence', file));

    const resultAction = await dispatch(addReport(formData));

    if (addReport.fulfilled.match(resultAction)) {
      setSuccess(true);

      setTitle('');
      setDescription('');
      setCity('');
      setPostcode('');
      setStreet('');
      setFlatNumber('');
      setPropertyType('');
      setLandlordOrAgency('');
      setAdvertSource('');
      setCategory('');
      setCustomCategory('');
      setIsAnonymous(true);
      setFlagged(false);
      setFiles([]);
      setFilePreviews([]);

      // navigate('/reports');
    }
  };

  if (showAuthMessage) {
    return (
      <div className={styles.addReportContainer}>
        <div className={styles.header}>Submit a Report</div>
        <div
          className={styles.error}
          style={{ marginTop: '2rem', fontSize: '1.1rem' }}
        >
          You must be signed in to submit a report. Redirecting to login...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.addReportContainer}>
      <div className={styles.header}>Submit a Report</div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className={styles.formGroup}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
            Flagged as:
          </label>

          <label style={{ marginRight: 16 }}>
            <input
              type="radio"
              name="flagged"
              value="true"
              checked={flagged === true}
              onChange={() => setFlagged(true)}
            />{' '}
            Negative / Sensitive
          </label>

          <label>
            <input
              type="radio"
              name="flagged"
              value="false"
              checked={flagged === false}
              onChange={() => setFlagged(false)}
            />{' '}
            Positive / Neutral
          </label>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Title <span style={{ color: '#e74c3c' }}>*</span>:
          </label>
          <input
            className={styles.input}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Mould in bedroom, broken heating, etc."
          />
          {titleError && <div className={styles.error}>{titleError}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Description <span style={{ color: '#e74c3c' }}>*</span>:
          </label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe the issue, location, and any relevant details."
          />
          {descError && <div className={styles.error}>{descError}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            City <span style={{ color: '#e74c3c' }}>*</span>:
          </label>
          <input
            className={styles.input}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="e.g. London, Manchester"
          />
          {cityError && <div className={styles.error}>{cityError}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Postcode <span style={{ color: '#e74c3c' }}>*</span>:</label>
          <input
            className={styles.input}
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            required
            placeholder="e.g. SW1A 1AA"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Flat/Unit Number <span style={{ color: '#e74c3c' }}>*</span>:
          </label>
          <input
            className={styles.input}
            type="text"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value)}
            required
            placeholder="e.g. Flat 2A, Unit 5"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Street <span style={{ color: '#e74c3c' }}>*</span>:</label>
          <input
            className={styles.input}
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            placeholder="e.g. 221B Baker Street"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Property Type:</label>
          <input
            className={styles.input}
            type="text"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            placeholder="e.g. Flat, House, Studio"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Landlord or Agency:</label>
          <input
            className={styles.input}
            type="text"
            value={landlordOrAgency}
            onChange={(e) => setLandlordOrAgency(e.target.value)}
            placeholder="e.g. John Smith, Acme Lettings"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Advert Source:</label>
          <input
            className={styles.input}
            type="text"
            value={advertSource}
            onChange={(e) => setAdvertSource(e.target.value)}
            placeholder="e.g. Rightmove, Gumtree, Facebook"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Category <span style={{ color: '#e74c3c' }}>*</span>:
          </label>
          <select
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Health Hazard">Health Hazard</option>
            <option value="Security Hazard">Security Hazard</option>
            <option value="Fire Hazard">Fire Hazard</option>
            <option value="Structural Hazard">Structural Hazard</option>
            <option value="Environmental Hazard">Environmental Hazard</option>
            <option value="Other">Other (please specify)</option>
          </select>

          {category === 'Other' && (
            <input
              type="text"
              className={styles.input}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Please specify category"
              required
            />
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Anonymous?</label>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Evidence <span style={{ color: '#e74c3c' }}>*</span>:
          </label>

          <input
            className={styles.input}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileChange}
            required
          />

          {fileError && <div className={styles.error}>{fileError}</div>}

          {filePreviews.length > 0 && (
            <div
              style={{
                marginTop: '0.5rem',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              {filePreviews.map(
                (preview, idx) =>
                  preview && (
                    <img
                      key={idx}
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      style={{
                        maxWidth: 120,
                        maxHeight: 120,
                        borderRadius: 8,
                      }}
                    />
                  )
              )}
            </div>
          )}

          {files.length > 0 && (
            <div style={{ marginTop: '0.5rem', color: '#555' }}>
              {files.map((file, idx) => (
                <div key={idx}>File selected: {file.name}</div>
              ))}
            </div>
          )}
        </div>

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>Report submitted successfully!</div>
        )}
      </form>
    </div>
  );
};

export default AddReport;
