import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HeroSection from '../components/Landing/HeroSection';
import StatsSection from '../components/Landing/StatsSection';
import ReportCard from '../components/Landing/ReportCard';
import LogoSpinner from '../components/Spinner/LogoSpinner';
import { fetchReports } from '../report/reportSlice';

const normalizeCity = (report) => {
  const rawLocation = report.city || report.location || '';
  if (!rawLocation || typeof rawLocation !== 'string') return null;

  const normalized = rawLocation
    .split(',')[0]
    .trim()
    .toLowerCase();

  return normalized || null;
};

const getCreatedTimestamp = (report) => {
  if (!report.created_at) return 0;
  const timestamp = new Date(report.created_at).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const TESTIMONIALS = [
  {
    quote: 'StreetLens helped me avoid renting a bad apartment in Manchester.',
    author: 'Anonymous user',
  },
  {
    quote: 'Seeing real photos and reports from other tenants made me feel much more confident choosing a place.',
    author: 'Early beta tester',
  },
];

const LandingPage = () => {
  const dispatch = useDispatch();
  const { reports, total, loading, error } = useSelector((state) => state.reports);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  const reportList = useMemo(() => (Array.isArray(reports) ? reports : []), [reports]);

  const totalCities = useMemo(() => {
    const set = new Set();
    reportList.forEach((report) => {
      const normalizedCity = normalizeCity(report);
      if (normalizedCity) set.add(normalizedCity);
    });
    return set.size;
  }, [reportList]);

  const stats = useMemo(() => ({
    totalReports: total,
    totalCities: totalCities
  }), [total, totalCities]);

  const recentReports = useMemo(() => {
    return [...reportList]
      .sort((leftReport, rightReport) => getCreatedTimestamp(rightReport) - getCreatedTimestamp(leftReport))
      .slice(0, 4);
  }, [reportList]);

  const currentTestimonial = TESTIMONIALS[testimonialIndex] || TESTIMONIALS[0];

  return (
    <main className="bg-white">
      <HeroSection />

      <StatsSection totalReports={stats.totalReports} totalCities={stats.totalCities} />

      <section className="py-5 border-bottom">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
            <div>
              <h2 className="h3 mb-1">Recent Reports</h2>
              <p className="text-muted mb-0">Latest community submissions from across the UK.</p>
            </div>
            <Link to="/app" className="btn btn-outline-secondary">
              Browse all reports
            </Link>
          </div>

          {loading && (
            <div className="py-4 d-flex justify-content-center">
              <LogoSpinner message="Loading recent reports..." />
            </div>
          )}

          {!loading && error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && recentReports.length === 0 && (
            <div className="alert alert-secondary mb-0">No reports available yet. Be the first to submit one.</div>
          )}

          {!loading && !error && recentReports.length > 0 && (
            <div className="row g-3">
              {recentReports.map((report) => (
                <div className="col-12 col-md-6 col-lg-3" key={report.id || report._id || report.title}>
                  <ReportCard report={report} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-5 border-bottom bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <h2 className="h3 mb-3">What StreetLens Does</h2>
              <ul className="list-group list-group-flush">
                <li className="list-group-item bg-transparent px-0">Report housing conditions</li>
                <li className="list-group-item bg-transparent px-0">Upload evidence</li>
                <li className="list-group-item bg-transparent px-0">Share experiences</li>
                <li className="list-group-item bg-transparent px-0">Help others make informed decisions</li>
              </ul>
            </div>

            <div className="col-12 col-lg-6">
              <h2 className="h3 mb-3">Why It Matters</h2>
              <p className="text-muted mb-0">
                Housing choices are high-impact and often made with incomplete information. StreetLens promotes transparency by making real tenant experiences visible,
                helping people identify unsafe conditions earlier and make better renting decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 border-bottom">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-5">
              <h2 className="h3 mb-3">What Renters Are Saying</h2>
              <p className="text-muted mb-0">
                Real stories from people who used StreetLens to avoid costly, unsafe, or misleading rentals.
              </p>
            </div>
            <div className="col-12 col-lg-7">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <p className="fst-italic mb-3">
                    “{currentTestimonial.quote}”
                  </p>
                  <p className="mb-3 text-muted">— {currentTestimonial.author}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group" role="group" aria-label="Testimonial navigation">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        aria-label="Previous testimonial"
                        onClick={() =>
                          setTestimonialIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1))
                        }
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        aria-label="Next testimonial"
                        onClick={() =>
                          setTestimonialIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1))
                        }
                      >
                        ›
                      </button>
                    </div>
                    <div className="d-flex gap-1">
                      {TESTIMONIALS.map((_, index) => (
                        <span
                          key={index}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: index === testimonialIndex ? '#3498db' : '#d0d7de',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="p-4 p-md-5 border rounded-3 text-center">
            <h2 className="h3 mb-3">Start reporting. Help others stay informed.</h2>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <Link to="/add-report" className="btn btn-primary">
                Submit a Report
              </Link>
              <Link to="/app" className="btn btn-outline-secondary">
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;