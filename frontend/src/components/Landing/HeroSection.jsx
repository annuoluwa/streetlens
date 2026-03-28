import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="py-5 border-bottom bg-white">
      <div className="container py-4">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-lg-9">
            <h1 className="display-5 fw-bold mb-3">Expose real housing conditions before you rent</h1>
            <p className="lead text-muted mb-4">
              StreetLens helps tenants across the UK report and discover real living conditions based on real user submissions.
            </p>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
              <Link to="/add-report" className="btn btn-primary btn-lg px-4">
                Submit a Report
              </Link>
              <Link to="/app" className="btn btn-outline-secondary btn-lg px-4">
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;