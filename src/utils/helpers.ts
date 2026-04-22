import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatRelativeTime = (timestamp: number) => {
  return dayjs.unix(timestamp).fromNow();
};

export const getDomain = (url: string) => {
  try {
    if (!url) return '';
    const domain = new URL(url).hostname.replace('www.', '');
    return domain;
  } catch {
    return '';
  }
};

export const getFaviconUrl = (url: string) => {
  const domain = getDomain(url);
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null;
};
