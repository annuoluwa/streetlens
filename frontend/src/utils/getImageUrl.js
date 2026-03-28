const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value) || /^data:/i.test(value) || /^blob:/i.test(value);

const getApiOrigin = () => {
  const apiBase = process.env.REACT_APP_API_URL;

  if (!apiBase) {
    return window.location.origin;
  }

  try {
    return new URL(apiBase, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
};

export const resolveEvidenceImageUrl = ({ evidenceUrl, evidenceFileName }) => {
  const apiOrigin = getApiOrigin();

  if (typeof evidenceUrl === 'string' && evidenceUrl.trim()) {
    const trimmedUrl = evidenceUrl.trim();

    if (isAbsoluteUrl(trimmedUrl)) {
      return trimmedUrl;
    }

    if (trimmedUrl.startsWith('//')) {
      return `${window.location.protocol}${trimmedUrl}`;
    }

    if (trimmedUrl.startsWith('/')) {
      return `${apiOrigin}${trimmedUrl}`;
    }

    return `${apiOrigin}/${trimmedUrl}`;
  }

  if (typeof evidenceFileName === 'string' && evidenceFileName.trim()) {
    const trimmedFileName = evidenceFileName.trim();

    if (trimmedFileName.startsWith('/uploads/')) {
      return `${apiOrigin}${trimmedFileName}`;
    }

    return `${apiOrigin}/uploads/${encodeURIComponent(trimmedFileName)}`;
  }

  return null;
};
