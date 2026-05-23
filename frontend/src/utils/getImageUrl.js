const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value) || /^data:/i.test(value) || /^blob:/i.test(value);

const CLOUDINARY_ORIGIN = 'https://res.cloudinary.com';

// Injects Cloudinary transformation parameters into a Cloudinary URL.
// e.g. applyCloudinaryTransform(url, 'w_800,q_auto,f_auto')
const applyCloudinaryTransform = (url, transform) => {
  if (!url.startsWith(CLOUDINARY_ORIGIN)) return url;
  return url.replace('/upload/', `/upload/${transform}/`);
};

export const CLOUDINARY_TRANSFORMS = {
  thumbnail: 'w_400,h_300,c_fill,q_auto,f_auto',
  display: 'w_1200,q_auto,f_auto',
};

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

export const resolveEvidenceImageUrl = ({ evidenceUrl, evidenceFileName, transform } = {}) => {
  const apiOrigin = getApiOrigin();

  if (typeof evidenceUrl === 'string' && evidenceUrl.trim()) {
    const trimmedUrl = evidenceUrl.trim();

    if (isAbsoluteUrl(trimmedUrl)) {
      return transform ? applyCloudinaryTransform(trimmedUrl, transform) : trimmedUrl;
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
