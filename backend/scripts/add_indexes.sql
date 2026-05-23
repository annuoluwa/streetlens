-- Run once against the production/local database to add performance indexes.
-- Safe to re-run: all use CREATE INDEX IF NOT EXISTS.

-- Reports: primary filter and sort fields
CREATE INDEX IF NOT EXISTS idx_reports_postcode     ON reports (postcode);
CREATE INDEX IF NOT EXISTS idx_reports_street       ON reports (street);
CREATE INDEX IF NOT EXISTS idx_reports_city         ON reports (city);
CREATE INDEX IF NOT EXISTS idx_reports_category     ON reports (category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at   ON reports (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_admin_flagged ON reports (admin_flagged);
CREATE INDEX IF NOT EXISTS idx_reports_is_flagged   ON reports (is_flagged);
CREATE INDEX IF NOT EXISTS idx_reports_user_id      ON reports (user_id);

-- Composite index for the threshold/flag query (postcode + street + flat_number)
CREATE INDEX IF NOT EXISTS idx_reports_location_compound
  ON reports (postcode, street, flat_number);

-- Comments: fetching by report and tree-building
CREATE INDEX IF NOT EXISTS idx_comments_report_id         ON comments (report_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_comment_id ON comments (parent_comment_id);

-- Evidence files: fetching by report
CREATE INDEX IF NOT EXISTS idx_evidence_report_id ON evidence_files (report_id);
