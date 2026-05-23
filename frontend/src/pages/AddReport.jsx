import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { addReport } from '../report/reportSlice';
import styles from './AddReport.module.css';

const toTitleCase = (str) => str.replace(/\b\w/g, c => c.toUpperCase());
const toSentenceCase = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

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
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [flagged, setFlagged] = useState(false);

  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [rights, setRights] = useState([]);
  const [matchedLaws, setMatchedLaws] = useState([]);
  const [councilEmail, setCouncilEmail] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    api.get('/rights').then(res => setRights(res.data.laws || [])).catch(() => {});
  }, []);

  const scanForRights = (text) => {
    const lower = text.toLowerCase();
    return rights.filter(law =>
      law.triggerWords.some(word => lower.includes(word.toLowerCase()))
    );
  };

  const [submitting, setSubmitting] = useState(false);
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

  const uploadEvidenceFiles = async (reportId, evidenceFiles) => {
    for (const f of evidenceFiles) {
      const evidenceForm = new FormData();
      evidenceForm.append('file', f);

      await api.post(`/reports/${reportId}/evidence`, evidenceForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
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
    if (!files.length) {
      setFileError('Evidence file is required.');
      valid = false;
    }
    if (!valid) return;

    setSubmitting(true);

    const reportPayload = {
      title,
      description,
      city,
      flat_number: flatNumber,
      postcode,
      street,
      property_type: propertyType,
      landlord_or_agency: landlordOrAgency,
      advert_source: advertSource,
      category: category === 'Other' ? customCategory : category,
      is_anonymous: String(isAnonymous),
      flagged: String(flagged),
    };

    try {
      const resultAction = await dispatch(addReport(reportPayload));

      if (addReport.fulfilled.match(resultAction)) {
        const createdReport = resultAction.payload;
        const reportId = createdReport?.id;

        if (reportId) {
          try {
            await uploadEvidenceFiles(reportId, files);
          } catch (uploadErr) {
            setFileError('Report created, but evidence upload failed.');
            return;
          }
        }

        const matched = scanForRights(`${title} ${description}`);
        setMatchedLaws(matched);

        let resolvedEmail = null;
        if (city && matched.length > 0) {
          try {
            const emailRes = await api.get('/council-email', { params: { city } });
            resolvedEmail = emailRes.data.email || null;
          } catch {}
        }
        setCouncilEmail(resolvedEmail);
        setShowModal(true);
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
        setAgreedToTerms(false);
      }
    } finally {
      setSubmitting(false);
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

      <form
        onSubmit={handleSubmit}
        style={{ opacity: submitting ? 0.4 : 1, pointerEvents: submitting ? 'none' : 'auto', transition: 'opacity 0.4s ease' }}
      >
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
            onChange={(e) => setTitle(toSentenceCase(e.target.value))}
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
            onChange={(e) => setDescription(toSentenceCase(e.target.value))}
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
            onChange={(e) => setCity(toTitleCase(e.target.value))}
            required
            placeholder="e.g. London, Manchester"
          />
          {cityError && <div className={styles.error}>{cityError}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Postcode:</label>
          <input
            className={styles.input}
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value.toUpperCase())}
            placeholder="e.g. SW1A 1AA"
          />
          <small style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
            This will be visible on the public dashboard to show general area trends.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Flat/Unit Number:</label>
          <input
            className={styles.input}
            type="text"
            value={flatNumber}
            onChange={(e) => setFlatNumber(toTitleCase(e.target.value))}
            placeholder="e.g. Flat 2A, Unit 5"
          />
          <small style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
            This remains strictly private and is only used for verified reporting to authorities.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Street:</label>
          <input
            className={styles.input}
            type="text"
            value={street}
            onChange={(e) => setStreet(toTitleCase(e.target.value))}
            placeholder="e.g. 221B Baker Street"
          />
          <small style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
            This will be visible on the public dashboard to show general area trends.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Property Type:</label>
          <input
            className={styles.input}
            type="text"
            value={propertyType}
            onChange={(e) => setPropertyType(toTitleCase(e.target.value))}
            placeholder="e.g. Flat, House, Studio"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Landlord or Agency:</label>
          <input
            className={styles.input}
            type="text"
            value={landlordOrAgency}
            onChange={(e) => setLandlordOrAgency(toTitleCase(e.target.value))}
            placeholder="e.g. John Smith, Acme Lettings"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Advert Source:</label>
          <input
            className={styles.input}
            type="text"
            value={advertSource}
            onChange={(e) => setAdvertSource(toTitleCase(e.target.value))}
            placeholder="e.g. Rightmove, Gumtree, Facebook"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Category <span style={{ color: '#e74c3c' }}>*</span>:
          </label>
          <div className={styles.customSelect} ref={categoryRef}>
            <button
              type="button"
              className={styles.customSelectTrigger}
              onClick={() => setCategoryOpen(o => !o)}
            >
              <span className={category ? undefined : styles.customSelectTriggerPlaceholder}>
                {category || 'Select a category'}
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {categoryOpen && (
              <div className={styles.customSelectMenu}>
                <div className={styles.customSelectGroup}>Negative / Hazard</div>
                {['Health Hazard','Security Hazard','Fire Hazard','Structural Hazard','Environmental Hazard'].map(opt => (
                  <div
                    key={opt}
                    className={`${styles.customSelectOption} ${category === opt ? styles.customSelectOptionSelected : ''}`}
                    onMouseDown={() => { setCategory(opt); setCategoryOpen(false); }}
                  >{opt}</div>
                ))}
                <div className={styles.customSelectGroup}>Positive</div>
                {['Well Maintained Property','Responsive Landlord','Fair Rent','Safe and Secure','Good Condition'].map(opt => (
                  <div
                    key={opt}
                    className={`${styles.customSelectOption} ${category === opt ? styles.customSelectOptionSelected : ''}`}
                    onMouseDown={() => { setCategory(opt); setCategoryOpen(false); }}
                  >{opt}</div>
                ))}
                <div className={styles.customSelectGroup}>Other</div>
                <div
                  className={`${styles.customSelectOption} ${category === 'Other' ? styles.customSelectOptionSelected : ''}`}
                  onMouseDown={() => { setCategory('Other'); setCategoryOpen(false); }}
                >Other (please specify)</div>
              </div>
            )}
          </div>

          {category === 'Other' && (
            <input
              type="text"
              className={styles.input}
              style={{ marginTop: '0.5rem' }}
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

        <div className={styles.formGroup}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              required
              style={{ marginTop: '0.2rem' }}
            />
            <span>
              I agree to the <a href="/legal" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>Terms of Use</a> and acknowledge the <a href="/legal" target="_blank" rel="noopener noreferrer" style={{ color: '#3498db' }}>Legal Disclaimer</a>.
            </span>
          </label>
        </div>

        <button className={styles.button} type="submit" disabled={loading || !agreedToTerms}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </form>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowModal(false)}>✕</button>

            <div className={styles.modalSuccess}>
              <span>✓</span> Report submitted successfully!
            </div>

            {matchedLaws.length > 0 && (
              <>
                <div className={styles.rightsHeader}>
                  Based on your report, here are your rights under the Renters' Rights Act 2025/2026:
                </div>
                {matchedLaws.map(law => (
                  <div key={law.id} className={styles.rightsCard}>
                    <div className={styles.rightsCardCategory}>{law.category}</div>
                    <div className={styles.rightsCardThreshold}>{law.threshold_condition}</div>
                    <div className={styles.rightsCardFeedback}>{law.feedback}</div>
                    <div className={styles.rightsCardAction}>
                      <strong>What to do: {law.emergencyAction.entity}</strong>
                      <div className={styles.rightsCardActionRow}>
                        {(() => {
                          const isPlaceholder = law.emergencyAction.email?.includes('yourlocalcouncil.gov.uk');
                          if (isPlaceholder) {
                            return councilEmail
                              ? <a href={`mailto:${councilEmail}`}>{councilEmail}</a>
                              : <a href="https://www.gov.uk/find-local-council" target="_blank" rel="noopener noreferrer">Find your local council →</a>;
                          }
                          return law.emergencyAction.email
                            ? <a href={`mailto:${law.emergencyAction.email}`}>{law.emergencyAction.email}</a>
                            : null;
                        })()}
                        {(() => {
                          const isPlaceholder = law.emergencyAction.helpline === 'Contact Local Council';
                          if (isPlaceholder) {
                            return councilEmail
                              ? null
                              : <a href="https://www.gov.uk/find-local-council" target="_blank" rel="noopener noreferrer">Find your local council</a>;
                          }
                          return law.emergencyAction.helpline
                            ? <span>📞 {law.emergencyAction.helpline}</span>
                            : null;
                        })()}
                      </div>
                      <div>{law.emergencyAction.instructions}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReport;
