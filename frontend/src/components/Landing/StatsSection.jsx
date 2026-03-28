import React from 'react';

const StatsSection = ({ totalReports, totalCities }) => {
  return (
    <section className="py-5 bg-light border-bottom">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-lg-8">
            <p className="text-uppercase text-muted fw-semibold mb-2">Community Proof</p>
            <h2 className="h3 fw-bold mb-2">{`${totalReports}+ reports across ${totalCities} UK cities`}</h2>
            <p className="text-muted mb-0">Built from real submissions by renters and residents.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;