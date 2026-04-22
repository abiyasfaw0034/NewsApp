import { getDomain } from '../helpers';

describe('getDomain', () => {
  it('should extract domain from simple url', () => {
    expect(getDomain('https://google.com/search')).toBe('google.com');
  });

  it('should remove www prefix', () => {
    expect(getDomain('https://www.nytimes.com/article')).toBe('nytimes.com');
  });

  it('should handle subdomains', () => {
    expect(getDomain('https://news.ycombinator.com/item')).toBe('news.ycombinator.com');
  });

  it('should return empty string for invalid urls', () => {
    expect(getDomain('not-a-url')).toBe('');
  });

  it('should handle empty input', () => {
    expect(getDomain('')).toBe('');
  });
});
